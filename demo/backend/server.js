/**
 * @file server.js
 * @description Express 서버 진입점 + 카드 관련 API 엔드포인트
 *
 * API 목록
 *   GET  /api/cards               카드 목록 (슬라이더·드롭다운용)
 *   GET  /api/cards/:cardId/transactions  카드별 이용내역
 *
 * DB ↔ 프론트 매핑 규칙 (이 파일 하단 mapper 함수 참고)
 *   Oracle 컬럼명(UPPER_SNAKE)  →  React 프롭(camelCase)
 */

"use strict";

require("dotenv").config();

const express      = require("express");
const cors         = require("cors");
const cookieParser = require("cookie-parser");
const { apiLogger } = require("./utils/logger");
const jwt = require("jsonwebtoken");
const { initPool, withConnection, closePool } = require("./db");
const { detectBrand, maskCardNumber } = require("./utils/cardBrand");
const { getBillingPeriod }            = require("./utils/billingPeriod");
const { getBillingSummaryByMonth }    = require("./utils/billingByMonth");

const JWT_SECRET          = process.env.JWT_SECRET          || "dev-secret";
// Access Token: 짧은 TTL — 만료 시 Refresh Token으로 재발급
const JWT_ACCESS_EXPIRES_IN  = process.env.JWT_ACCESS_EXPIRES_IN  || "30m";
// Refresh Token: 긴 TTL — httpOnly 쿠키로 관리 (JS 접근 불가)
const JWT_REFRESH_SECRET     = process.env.JWT_REFRESH_SECRET     || "dev-refresh-secret";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

/**
 * POC용 인메모리 Refresh Token 저장소.
 * 프로덕션에서는 Redis 또는 DB 테이블로 교체해야 한다.
 * Map<userId, refreshToken>
 */
const refreshTokenStore = new Map();

/** 보호 라우트에 적용할 JWT 검증 미들웨어 */
function verifyToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "인증이 필요합니다." });
  }
  try {
    req.user = jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    return res
      .status(401)
      .json({ error: "토큰이 만료되었거나 유효하지 않습니다." });
  }
}

const app = express();
const PORT = process.env.PORT || 3001;

// ── 미들웨어 ─────────────────────────────────────────────────────────────────

app.use(
  cors({
    origin: (origin, cb) => {
      // 서버 간 호출(origin 없음) 또는 localhost 계열은 허용
      if (!origin || /^https?:\/\/localhost(:\d+)?$/.test(origin))
        return cb(null, true);
      cb(new Error(`CORS blocked: ${origin}`));
    },
    // withCredentials 요청(httpOnly 쿠키 전송)을 허용하기 위해 필수
    credentials: true,
  }),
);
app.use(express.json());
// httpOnly 쿠키(Refresh Token) 파싱
app.use(cookieParser());
app.use(apiLogger);

// ── 개발용: D_SPIDERLINK의 POC_ 테이블 목록 및 컬럼 확인 ────────────────────
app.get("/api/dev/raw", async (_req, res) => {
  try {
    const result = await withConnection((conn) =>
      conn.execute(
        `SELECT "이용자", "이용일자", "승인시각", "결제예정일"
           FROM D_SPIDERLINK.POC_카드사용내역
          WHERE ROWNUM <= 5`,
      ),
    );
    res.json({ rows: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/dev/tables", async (_req, res) => {
  try {
    const result = await withConnection((conn) =>
      conn.execute(
        `SELECT TABLE_NAME FROM ALL_TABLES
          WHERE OWNER = 'D_SPIDERLINK'
            AND TABLE_NAME LIKE 'POC%'
          ORDER BY TABLE_NAME`,
      ),
    );
    res.json({ tables: (result.rows || []).map((r) => r.TABLE_NAME) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/dev/usage-stat
 * POC_카드사용내역 "이용자" 컬럼 분포 진단용 엔드포인트.
 *
 * 반환:
 *   totalCount   — 테이블 전체 레코드 수
 *   distribution — { value, trimmedValue, count } 목록 (이용자 값별 건수)
 *
 * "이용자" 값의 선행/후행 공백이나 대소문자 차이가
 * WHERE "이용자" = :userId 필터에서 레코드가 누락되는 주 원인이므로
 * 원본 값(value)과 TRIM 값(trimmedValue)을 함께 반환한다.
 */
app.get("/api/dev/usage-stat", async (_req, res) => {
  try {
    const [countResult, distResult] = await Promise.all([
      withConnection((conn) =>
        conn.execute(
          `SELECT COUNT(*) AS TOTAL_CNT FROM D_SPIDERLINK.POC_카드사용내역`,
        ),
      ),
      withConnection((conn) =>
        conn.execute(
          `SELECT "이용자"        AS RAW_VAL,
                  TRIM("이용자") AS TRIM_VAL,
                  COUNT(*)       AS CNT
             FROM D_SPIDERLINK.POC_카드사용내역
            GROUP BY "이용자", TRIM("이용자")
            ORDER BY CNT DESC`,
        ),
      ),
    ]);

    res.json({
      totalCount:   countResult.rows[0]?.TOTAL_CNT ?? 0,
      distribution: (distResult.rows || []).map((r) => ({
        value:        r.RAW_VAL,       // DB에 실제 저장된 값 (공백 포함 가능)
        trimmedValue: r.TRIM_VAL,      // 앞뒤 공백 제거 후 값
        count:        r.CNT,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/dev/columns/:tbl", async (req, res) => {
  try {
    const tbl = req.params.tbl.toUpperCase();
    const result = await withConnection((conn) =>
      conn.execute(
        `SELECT COLUMN_NAME, DATA_TYPE
           FROM ALL_TAB_COLUMNS
          WHERE OWNER = 'D_SPIDERLINK'
            AND TABLE_NAME = :tbl
          ORDER BY COLUMN_ID`,
        { tbl }, // SQL 인젝션 방지: bind variable 사용
      ),
    );
    res.json({ table: tbl, columns: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── 인증 ─────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 * Body: { userId: string, password: string }
 * - LOG_YN = 'N' 계정은 비활성 처리
 * - 성공 시 LAST_LOGIN_DTIME 업데이트
 */
app.post("/api/auth/login", async (req, res) => {
  const { userId, password } = req.body ?? {};

  if (!userId || !password) {
    return res
      .status(400)
      .json({ success: false, message: "아이디와 비밀번호를 입력하세요." });
  }

  try {
    const result = await withConnection(async (conn) => {
      return conn.execute(
        `SELECT USER_ID, USER_NAME, USER_GRADE, LOG_YN
           FROM D_SPIDERLINK.POC_USER
          WHERE USER_ID = :userId AND PASSWORD = :password`,
        { userId, password },
      );
    });

    const row = result.rows?.[0];

    if (!row) {
      return res.status(401).json({
        success: false,
        message: "아이디 또는 비밀번호가 틀렸습니다.",
      });
    }

    if (row.LOG_YN !== "Y") {
      return res.status(403).json({
        success: false,
        message: "사용이 정지된 계정입니다. 관리자에게 문의하세요.",
      });
    }

    // 마지막 로그인 시각 업데이트 (실패해도 로그인은 허용)
    withConnection((conn) =>
      conn.execute(
        `UPDATE D_SPIDERLINK.POC_USER
          SET LAST_LOGIN_DTIME = TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')
        WHERE USER_ID = :userId`,
        { userId },
        { autoCommit: true },
      ),
    ).catch((e) =>
      console.warn("[login] LAST_LOGIN_DTIME 업데이트 실패:", e.message),
    );

    const payload = {
      userId:    row.USER_ID,
      userName:  row.USER_NAME,
      userGrade: row.USER_GRADE,
    };

    // Access Token: 짧은 TTL, Authorization 헤더로 전달
    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_ACCESS_EXPIRES_IN,
    });

    // Refresh Token: 긴 TTL, httpOnly 쿠키로 전달 (JS 접근 불가 → XSS 방지)
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });

    // 인메모리 저장소에 등록 (탈취 감지용 — 저장값과 다르면 무효화)
    refreshTokenStore.set(row.USER_ID, refreshToken);

    // SameSite=lax: CSRF 방지 / path=/api/auth: 인증 경로에만 쿠키 전송
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure:   false, // POC: HTTP 허용 (프로덕션에서는 true + HTTPS 필수)
      sameSite: "lax",
      maxAge:   7 * 24 * 60 * 60 * 1000, // 7일 (ms)
      path:     "/api/auth",
    });

    return res.json({
      success:   true,
      token:     accessToken, // 기존 키 유지 (프론트 AuthUser.token 호환)
      userId:    row.USER_ID,
      userName:  row.USER_NAME,
      userGrade: row.USER_GRADE,
    });
  } catch (err) {
    console.error("[POST /api/auth/login]", err);
    return res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다." });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh Token(httpOnly 쿠키)으로 새 Access Token 발급.
 * 저장된 토큰과 불일치 시 탈취로 간주하고 해당 유저의 토큰을 무효화한다.
 */
app.post("/api/auth/refresh", (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh Token이 없습니다." });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const stored  = refreshTokenStore.get(decoded.userId);

    // 저장된 토큰과 불일치 → 탈취된 토큰으로 간주, 즉시 무효화
    if (stored !== refreshToken) {
      refreshTokenStore.delete(decoded.userId);
      return res.status(401).json({ error: "유효하지 않은 Refresh Token입니다." });
    }

    const newAccessToken = jwt.sign(
      { userId: decoded.userId, userName: decoded.userName, userGrade: decoded.userGrade },
      JWT_SECRET,
      { expiresIn: JWT_ACCESS_EXPIRES_IN },
    );

    return res.json({ accessToken: newAccessToken });
  } catch {
    return res.status(401).json({ error: "Refresh Token이 만료되었거나 유효하지 않습니다." });
  }
});

/**
 * POST /api/auth/logout
 * Authorization: Bearer <accessToken>
 * 인메모리 Refresh Token 삭제 + 쿠키 만료 처리.
 */
app.post("/api/auth/logout", verifyToken, (req, res) => {
  // 인메모리 저장소에서 Refresh Token 제거
  refreshTokenStore.delete(req.user.userId);

  // 클라이언트 쿠키 만료 (maxAge=0)
  res.clearCookie("refreshToken", { path: "/api/auth" });

  return res.json({ success: true });
});

// ════════════════════════════════════════════════════════════════════════════
// Mapper: DB 로우(row) → 프론트 JSON
//
// Oracle 테이블 컬럼명과 React 타입 필드명이 다를 때
// 이 함수들이 그 간극을 메웁니다.
// DB 컬럼명이 바뀌어도 mapper 만 수정하면 프론트 인터페이스는 그대로 유지됩니다.
// ════════════════════════════════════════════════════════════════════════════

/**
 * TB_CARD_INFO 로우 → 프론트 Card 객체
 *
 * DB 컬럼 예시:
 *   CARD_ID       VARCHAR2(20)   PK
 *   CARD_NM       VARCHAR2(100)  카드 한글명
 *   CARD_EN_NM    VARCHAR2(100)  카드 영문명
 *   CARD_BRAND_CD VARCHAR2(10)   브랜드 코드 (VISA / MC)
 *   CARD_MASK_NO  VARCHAR2(30)   마스킹 카드번호
 *   ACNT_BAL_AMT  NUMBER(15)     연결계좌 잔액
 *   USE_YN        CHAR(1)        사용여부
 *
 * @param {object} row - oracledb OUT_FORMAT_OBJECT 로우
 * @returns {object} 프론트 Card 타입
 */
// POC_카드리스트 row → 프론트 CardItem
function mapCard(row) {
  const cardNo = String(row["카드번호"] ?? "");
  const limit = Number(row["한도금액"] ?? 0);
  const used = Number(row["사용금액"] ?? 0);
  return {
    id: cardNo,
    name: row["카드구분"] ?? "",
    brand: detectBrand(cardNo),
    maskedNumber: maskCardNumber(cardNo),
    balance: limit - used,
    // 카드 상세 정보
    expiry: row["유효기간"] ?? "",
    paymentBank: row["결제은행명"] ?? "",
    paymentAccount: String(row["결제계좌"] ?? ""),
    paymentDay: row["결제일"] ?? "",
    limitAmount: limit,
    usedAmount: used,
  };
}

/**
 * TB_CARD_TX 로우 → 프론트 Transaction 객체
 *
 * DB 컬럼 예시:
 *   TX_ID         VARCHAR2(30)   PK
 *   CARD_ID       VARCHAR2(20)   FK → TB_CARD_INFO
 *   CARD_NM       VARCHAR2(100)  카드명 (조인 또는 중복 보관)
 *   MERCHANT_NM   VARCHAR2(200)  가맹점명
 *   TX_AMT        NUMBER(15,2)   거래금액 (취소는 음수)
 *   TX_DT         VARCHAR2(10)   거래일 (YYYY.MM.DD)
 *   PAY_TYPE_CD   VARCHAR2(20)   결제유형 코드
 *   APRVL_NO      VARCHAR2(30)   승인번호
 *   TX_STAT_CD    VARCHAR2(10)   거래상태 코드
 *
 * @param {object} row
 * @returns {object} 프론트 Transaction 타입
 */
function mapTransaction(row) {
  return {
    id: row.TX_ID,
    merchant: row.MERCHANT_NM,
    amount: row.TX_AMT,
    date: row.TX_DT,
    // 코드값 → 화면 표시 레이블 변환
    type: mapPayTypeCode(row.PAY_TYPE_CD),
    approvalNumber: row.APRVL_NO,
    status: mapTxStatCode(row.TX_STAT_CD),
    cardName: row.CARD_NM,
  };
}

/** 결제유형 코드 → 표시 문자열 */
function mapPayTypeCode(code) {
  const map = {
    LUMP: "일시불",
    INSTALL_03: "할부(3개월)",
    INSTALL_06: "할부(6개월)",
    INSTALL_12: "할부(12개월)",
    CANCEL: "취소",
  };
  return map[code] ?? code;
}

/** 거래상태 코드 → 표시 문자열 */
function mapTxStatCode(code) {
  const map = {
    APPROVED: "승인",
    CONFIRMED: "결제확정",
    CANCELLED: "취소",
  };
  return map[code] ?? code;
}

/**
 * 날짜(YYYYMMDD) + 시각(HHmmss) → 'YYYY.MM.DD HH:mm'
 * @param {string|null} date
 * @param {string|null} time
 */
function formatDateTime(date, time) {
  const d = String(date ?? "").replace(/\D/g, "");
  const t = String(time ?? "").replace(/\D/g, "");
  // YYYYMMDD(8자리) 또는 YYMMDD(6자리) 모두 처리
  let datePart = d;
  if (d.length === 8)       // YYYYMMDD
    datePart = `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6, 8)}`;
  else if (d.length === 6)  // YYMMDD
    datePart = `20${d.slice(0, 2)}.${d.slice(2, 4)}.${d.slice(4, 6)}`;
  const timePart = t.length >= 4 ? `${t.slice(0, 2)}:${t.slice(2, 4)}` : "";
  return timePart ? `${datePart} ${timePart}` : datePart;
}

/**
 * 날짜 문자열(YYYYMMDD 또는 YYMMDD) → 'M월 D일' (paymentSummary.date 용)
 * @param {string|null} raw
 */
function formatDateKo(raw) {
  if (!raw) return "";
  const s = String(raw).replace(/\D/g, "");
  if (s.length === 8)  // YYYYMMDD
    return `${Number(s.slice(4, 6))}월 ${Number(s.slice(6, 8))}일`;
  if (s.length === 6)  // YYMMDD
    return `${Number(s.slice(2, 4))}월 ${Number(s.slice(4, 6))}일`;
  return String(raw);
}

/**
 * POC_카드사용내역 로우 → 프론트 Transaction 객체
 *
 * DB 컬럼:
 *   카드번호    VARCHAR2  카드번호 (ID 합성 키)
 *   이용일자    VARCHAR2  거래일 (YYYYMMDD)
 *   이용가맹점  VARCHAR2  가맹점명
 *   이용금액    NUMBER    결제금액
 *   할부개월    NUMBER    할부 개월 수 (0 또는 1 = 일시불)
 *   승인여부    CHAR      Y=승인, N=취소
 *   카드명      VARCHAR2  카드명
 *   승인시각    VARCHAR2  승인 시각 (HHmmss)
 *
 * @param {object} row
 * @param {number} idx  - 동일 카드+시각 중복 방지용 인덱스
 */
function mapUsageTransaction(row, idx) {
  const approved = row["승인여부"] === "Y";
  const installment = Number(row["할부개월"] ?? 0);
  const type = !approved
    ? "취소"
    : installment > 1
      ? `할부(${installment}개월)`
      : "일시불";

  return {
    id: `${row["카드번호"]}-${row["이용일자"]}-${row["승인시각"]}-${idx}`,
    merchant: row["이용가맹점"] ?? "",
    amount: approved
      ? Number(row["이용금액"] ?? 0)
      : -Number(row["이용금액"] ?? 0), // 취소는 음수
    date: formatDateTime(row["이용일자"], row["승인시각"]),
    type,
    approvalNumber: String(row["승인번호"] ?? ""),
    status: approved ? "승인" : "취소",
    cardName: row["카드명"] ?? "",
  };
}

// ════════════════════════════════════════════════════════════════════════════
// API 엔드포인트
// ════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/cards
 * 로그인 사용자가 보유한 카드 목록을 반환합니다.
 *
 * Query Params:
 *   userId  (선택) — 특정 사용자 카드만 조회. 없으면 전체 반환.
 *
 * Response 200:
 *   {
 *     cards: Array<{
 *       id: string, name: string, cardEnName: string,
 *       brand: 'VISA' | 'Mastercard', maskedNumber: string, balance: number
 *     }>
 *   }
 */
app.get("/api/cards", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId; // JWT에서 추출

    const result = await withConnection((conn) =>
      conn.execute(
        `SELECT "카드번호", "카드구분", "유효기간", "결제은행명", "결제계좌", "결제일", "한도금액", "사용금액"
           FROM D_SPIDERLINK.POC_카드리스트
          WHERE "사용자아이디" = :userId
          ORDER BY "결제순번" NULLS LAST`,
        { userId },
      ),
    );

    const cards = (result.rows || []).map(mapCard);
    res.json({ cards });
  } catch (err) {
    console.error("[GET /api/cards]", err);
    res.status(500).json({ error: "DB 조회 중 오류가 발생했습니다." });
  }
});

/**
 * 검색 기간(period) → { fromDate, toDate } YYYYMMDD 문자열 변환
 *
 * @param {string} period      - 'thisMonth' | '1month' | '3months' | 'custom'
 * @param {string} customMonth - 'YYYY-MM' (period === 'custom' 일 때만 사용)
 */
function getDateRange(period, customMonth) {
  const pad = (n) => String(n).padStart(2, "0");
  const ymd = (d) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const now = new Date();

  if (period === "thisMonth") {
    const y = now.getFullYear(),
      m = pad(now.getMonth() + 1);
    return { fromDate: `${y}${m}01`, toDate: `${y}${m}31` };
  }
  if (period === "1month") {
    const from = new Date(now);
    from.setMonth(from.getMonth() - 1);
    return { fromDate: ymd(from), toDate: ymd(now) };
  }
  if (period === "3months") {
    const from = new Date(now);
    from.setMonth(from.getMonth() - 3);
    return { fromDate: ymd(from), toDate: ymd(now) };
  }
  if (period === "custom" && customMonth) {
    const [y, m] = customMonth.split("-");
    return { fromDate: `${y}${m}01`, toDate: `${y}${m}31` };
  }
  return { fromDate: null, toDate: null };
}

/**
 * GET /api/transactions
 * 로그인 사용자의 카드 이용내역을 반환합니다. (POC_카드사용내역)
 *
 * Query Params (모두 선택):
 *   cardId      — 카드번호 필터. 없거나 'all' 이면 전체
 *   period      — 'thisMonth' | '1month' | '3months' | 'custom'
 *   customMonth — 'YYYY-MM' (period=custom 일 때)
 *   usageType   — 'lump' | 'installment' | 'cancel' (없거나 'all' 이면 전체)
 *
 * Response 200:
 *   { transactions, totalCount, paymentSummary: { date, totalAmount } }
 */
app.get("/api/transactions", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { cardId, period, customMonth, usageType, fromDate: qFromDate, toDate: qToDate } = req.query;

    // ── 날짜 범위 계산 ─────────────────────────────────────────────
    // fromDate/toDate 직접 전달 시 우선 사용, 없으면 period/customMonth로 계산
    const { fromDate: rangeFrom, toDate: rangeTo } = getDateRange(period, customMonth);
    const fromDate = qFromDate || rangeFrom;
    const toDate   = qToDate   || rangeTo;

    // ── 동적 WHERE 절 구성 ───────────────────────────────────────
    let sql = `
      SELECT "카드번호", "이용일자", "이용가맹점", "이용금액",
             "할부개월", "승인여부", "카드명", "승인시각", "결제예정일", "승인번호"
        FROM D_SPIDERLINK.POC_카드사용내역
       WHERE "이용자" = :userId`;
    const binds = { userId };

    if (cardId && cardId !== "all") {
      sql += ` AND "카드번호" = :cardId`;
      binds.cardId = cardId;
    }
    if (fromDate) {
      sql += ` AND "이용일자" >= :fromDate`;
      binds.fromDate = fromDate;
    }
    if (toDate) {
      sql += ` AND "이용일자" <= :toDate`;
      binds.toDate = toDate;
    }
    if (usageType === "lump") {
      sql += ` AND "할부개월" <= 1 AND "승인여부" = 'Y'`;
    } else if (usageType === "installment") {
      sql += ` AND "할부개월" > 1 AND "승인여부" = 'Y'`;
    } else if (usageType === "cancel") {
      sql += ` AND "승인여부" = 'N'`;
    }

    sql += ` ORDER BY "이용일자" DESC, "승인시각" DESC`;

    const result = await withConnection((conn) => conn.execute(sql, binds));
    const rows = result.rows || [];
    const transactions = rows.map(mapUsageTransaction);

    const upcomingDate = rows
      .map((r) => r["결제예정일"])
      .filter(Boolean)
      .sort()[0];
    const totalAmount = transactions
      .filter((t) => t.status === "승인")
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({
      transactions,
      totalCount: transactions.length,
      paymentSummary: { date: formatDateKo(upcomingDate), totalAmount },
    });
  } catch (err) {
    console.error("[GET /api/transactions]", err);
    res.status(500).json({ error: "DB 조회 중 오류가 발생했습니다." });
  }
});

/**
 * GET /api/payment-statement
 * 결제예정금액 / 이용대금명세서 탭 데이터를 반환합니다.
 *
 * Query Params (모두 선택):
 *   paymentDay — 카드 결제일(1~31). 공여기간 계산 기준. 미전달 시 DB 첫 카드 결제일 사용.
 *   yearMonth  — 'YYYY-MM'. 전달 시 결제예정일(YYMMDD) LIKE 필터로 전환 (공여기간 미적용).
 *
 * Response 200:
 *   {
 *     dueDate      : string,   // YYMMDD (결제예정일, 대표값)
 *     totalAmount  : number,
 *     items        : [{ cardNo, cardName, amount, dueDate }],
 *     cardInfo     : { paymentBank, paymentAccount, paymentDay } | null,
 *     billingPeriod: { usageStart, usageEnd, dueDate } | null  // 'YYYY.MM.DD' 형식
 *   }
 */
app.get("/api/payment-statement", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { yearMonth, paymentDay } = req.query;

    // ── 1. 카드 정보 조회 (결제은행·계좌·결제일) ───────────────────
    // 전체 카드를 조회하여 카드별 결제일(cardSettings)을 구성한다.
    // getBillingSummaryByMonth가 각 카드의 공여기간을 개별 적용하기 위해 필요.
    const cardResult = await withConnection((conn) =>
      conn.execute(
        `SELECT "카드번호", "결제은행명", "결제계좌", "결제일"
           FROM D_SPIDERLINK.POC_카드리스트
          WHERE "사용자아이디" = :userId
          ORDER BY "결제순번" NULLS LAST`,
        { userId },
      ),
    );
    const cardRows = cardResult.rows || [];

    // { 카드번호: 결제일(number) } — getBillingSummaryByMonth에 전달
    const cardSettings = {};
    cardRows.forEach((row) => {
      const no = String(row["카드번호"] ?? "").trim();
      if (no) cardSettings[no] = Number(row["결제일"] ?? 25);
    });

    const ci = cardRows[0] ?? null;
    const cardInfo = ci
      ? {
          paymentBank:    ci["결제은행명"] ?? "",
          paymentAccount: String(ci["결제계좌"] ?? ""),
          paymentDay:     String(ci["결제일"] ?? ""),
        }
      : null;

    // ── 2. 이용내역 조회 범위 결정 ──────────────────────────────────
    // 이용일자(useDate)를 포함해야 getBillingSummaryByMonth가 공여기간을 계산할 수 있다.
    let txSql = `SELECT "카드번호", "카드명", "이용금액", "결제예정일", "이용일자"
                   FROM D_SPIDERLINK.POC_카드사용내역
                  WHERE "이용자" = :userId AND "승인여부" = 'Y'`;
    const txBinds = { userId };
    let billingPeriodFormatted = null;

    if (yearMonth) {
      /* 카드별 공여기간 기반 필터:
       * 어떤 결제일(1~27)이든 선택 청구월의 이용 시작일은 최소 2개월 전 이후다.
       * 보수적 범위(targetMonth-2 ~ targetMonth 말일)로 DB를 조회하고,
       * 정밀 필터링은 getBillingSummaryByMonth가 카드별로 수행한다. */
      const [y, m] = yearMonth.split("-").map(Number);
      let fromYear = y, fromMonth = m - 2;
      if (fromMonth <= 0) { fromYear--; fromMonth += 12; }
      const toDay = new Date(y, m, 0).getDate(); // targetMonth 말일
      txBinds.fromDate = `${fromYear}${String(fromMonth).padStart(2, "0")}01`;
      txBinds.toDate   = `${y}${String(m).padStart(2, "0")}${String(toDay).padStart(2, "0")}`;
      txSql += ` AND "이용일자" >= :fromDate AND "이용일자" <= :toDate`;
    } else {
      /* 공여기간 필터: 전달받은 paymentDay 또는 DB 결제일 기준으로 이용일자 범위 산정 */
      const D = paymentDay ?? cardInfo?.paymentDay;
      if (D) {
        try {
          const bp = getBillingPeriod(new Date(), D);
          txSql += ` AND "이용일자" >= :fromDate AND "이용일자" <= :toDate`;
          txBinds.fromDate = bp.fromDate; // YYYYMMDD
          txBinds.toDate   = bp.toDate;   // YYYYMMDD
          billingPeriodFormatted = bp.formatted; // { usageStart, usageEnd, dueDate }
        } catch (e) {
          console.warn("[payment-statement] 공여기간 계산 실패:", e.message);
        }
      }
    }

    // ── 3. 이용내역 조회 ─────────────────────────────────────────────
    const txResult = await withConnection((conn) => conn.execute(txSql, txBinds));
    const txRows = txResult.rows || [];

    // ── 4. 집계 (yearMonth 유무에 따라 분기) ──────────────────────────
    let items, totalAmount, dueDate;

    if (yearMonth) {
      /* 카드별 결제일 공여기간을 개별 적용해 청구월을 정확히 판단 */
      const rawItems = txRows.map((r) => ({
        cardNo:   String(r["카드번호"] ?? ""),
        cardName: r["카드명"] ?? "",
        useDate:  String(r["이용일자"] ?? ""),
        amount:   Number(r["이용금액"] ?? 0),
        dueDate:  r["결제예정일"] ?? "",
      }));
      const summary = getBillingSummaryByMonth(rawItems, yearMonth, cardSettings);

      /* 카드+결제예정일 조합별 재집계 (응답 포맷을 기존과 동일하게 유지) */
      const cardMap = {};
      summary.items.forEach((item) => {
        const key = `${item.cardNo}_${item.dueDate}`;
        if (!cardMap[key]) cardMap[key] = { cardNo: item.cardNo, cardName: item.cardName, amount: 0, dueDate: item.dueDate };
        cardMap[key].amount += item.amount;
      });
      items       = Object.values(cardMap);
      totalAmount = summary.totalAmount;

      /* 대표 결제예정일 — 가장 많이 등장하는 값 */
      const cnt = {};
      summary.items.forEach((i) => { if (i.dueDate) cnt[i.dueDate] = (cnt[i.dueDate] || 0) + 1; });
      dueDate = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";

    } else {
      /* 공여기간 기반 조회 — 기존 집계 로직 유지 */
      const cardMap = {};
      txRows.forEach((r) => {
        const key = `${r["카드번호"]}_${r["결제예정일"] ?? ""}`;
        if (!cardMap[key]) cardMap[key] = { cardNo: r["카드번호"], cardName: r["카드명"] ?? "", amount: 0, dueDate: r["결제예정일"] ?? "" };
        cardMap[key].amount += Number(r["이용금액"] ?? 0);
      });
      items       = Object.values(cardMap);
      totalAmount = items.reduce((sum, i) => sum + i.amount, 0);

      const cnt = {};
      txRows.forEach((r) => { const d = r["결제예정일"]; if (d) cnt[d] = (cnt[d] || 0) + 1; });
      dueDate = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
    }

    res.json({
      dueDate,
      totalAmount,
      items,
      cardInfo,
      /** 공여기간 정보 — yearMonth 선택 시 null, 결제일 기반 조회 시 'YYYY.MM.DD' 형식 */
      billingPeriod: billingPeriodFormatted,
    });
  } catch (err) {
    console.error("[GET /api/payment-statement]", err);
    res.status(500).json({ error: "DB 조회 중 오류가 발생했습니다." });
  }
});

/**
 * GET /api/cards/:cardId/transactions
 * 특정 카드의 이용내역을 페이징하여 반환합니다.
 *
 * Path Params:
 *   cardId — 카드 ID
 *
 * Query Params:
 *   page     (기본 1)   — 페이지 번호 (1-based)
 *   pageSize (기본 20)  — 페이지 당 건수
 *   fromDate (선택)     — 조회 시작일 YYYYMMDD
 *   toDate   (선택)     — 조회 종료일 YYYYMMDD
 *
 * Response 200:
 *   {
 *     transactions: Transaction[],
 *     totalCount: number,
 *     page: number,
 *     pageSize: number
 *   }
 */
app.get("/api/cards/:cardId/transactions", verifyToken, async (req, res) => {
  try {
    const { cardId } = req.params;
    const page = Math.max(1, Number(req.query.page) || 1);
    const pageSize = Math.min(100, Number(req.query.pageSize) || 20);
    const { fromDate, toDate } = req.query;

    const offset = (page - 1) * pageSize;

    const result = await withConnection(async (conn) => {
      // ── 전체 건수 ──────────────────────────────────────────────────
      let countSql = `
        SELECT COUNT(*) AS TOTAL_CNT
        FROM TB_CARD_TX
        WHERE CARD_ID = :cardId
      `;
      const binds = { cardId };

      if (fromDate) {
        countSql += " AND TX_DT >= :fromDate";
        binds.fromDate = fromDate;
      }
      if (toDate) {
        countSql += " AND TX_DT <= :toDate";
        binds.toDate = toDate;
      }

      const countRes = await conn.execute(countSql, binds);
      const totalCount = countRes.rows[0]?.TOTAL_CNT ?? 0;

      // ── 페이징 데이터 ──────────────────────────────────────────────
      // Oracle 12c+ OFFSET/FETCH 문법 사용
      let dataSql = `
        SELECT
          TX_ID,
          CARD_NM,
          MERCHANT_NM,
          TX_AMT,
          TX_DT,
          PAY_TYPE_CD,
          APRVL_NO,
          TX_STAT_CD
        FROM TB_CARD_TX
        WHERE CARD_ID = :cardId
      `;

      if (fromDate) {
        dataSql += " AND TX_DT >= :fromDate";
      }
      if (toDate) {
        dataSql += " AND TX_DT <= :toDate";
      }

      dataSql += `
        ORDER BY TX_DT DESC, TX_ID DESC
        OFFSET :offset ROWS FETCH NEXT :pageSize ROWS ONLY
      `;
      binds.offset = offset;
      binds.pageSize = pageSize;

      const dataRes = await conn.execute(dataSql, binds);

      return { rows: dataRes.rows, totalCount };
    });

    res.json({
      transactions: (result.rows || []).map(mapTransaction),
      totalCount: result.totalCount,
      page,
      pageSize,
    });
  } catch (err) {
    console.error("[GET /api/cards/:cardId/transactions]", err);
    res.status(500).json({ error: "DB 조회 중 오류가 발생했습니다." });
  }
});

/**
 * GET /api/cards/:cardId/payable-amount
 * 즉시결제 가능금액 조회.
 *
 * POC_카드사용내역에서 로그인 사용자의 해당 카드번호 건 중
 * 누적결제금액 < 이용금액 인 레코드의 미결제 잔액(이용금액 - 누적결제금액) 합산을 반환한다.
 *
 * Response 200: { payableAmount: number }
 */
app.get("/api/cards/:cardId/payable-amount", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { cardId } = req.params;

    const result = await withConnection((conn) =>
      conn.execute(
        `SELECT NVL(SUM("이용금액" - "누적결제금액"), 0) AS PAYABLE_AMOUNT
           FROM D_SPIDERLINK.POC_카드사용내역
          WHERE "이용자"   = :userId
            AND "카드번호" = :cardId
            AND "누적결제금액" < "이용금액"
            AND "결제상태코드" <> '9'`,
            /* 결제상태코드 9(취소건)는 즉시결제 대상에서 제외.
             * 0:미결제, 1:완납, 2:부분결제, 9:취소 */
        { userId, cardId },
      ),
    );

    const payableAmount = Number(result.rows?.[0]?.PAYABLE_AMOUNT ?? 0);
    res.json({ payableAmount });
  } catch (err) {
    console.error("[GET /api/cards/:cardId/payable-amount]", err);
    res.status(500).json({ error: "DB 조회 중 오류가 발생했습니다." });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// 서버 기동 — DB 풀이 준비된 후에만 listen
// ════════════════════════════════════════════════════════════════════════════

async function start() {
  try {
    await initPool(); // ① 커넥션 풀 먼저 생성

    app.listen(PORT, () => {
      // ② 풀 준비 완료 후 서버 오픈
      console.log(`[Server] http://localhost:${PORT} 에서 실행 중`);
    });
  } catch (err) {
    console.error("[Server] 기동 실패:", err);
    process.exit(1);
  }
}

// ── 정상 종료 훅 ─────────────────────────────────────────────────────────────
async function shutdown(signal) {
  console.log(`\n[Server] ${signal} 수신 — 정상 종료 시작`);
  await closePool();
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

start();
