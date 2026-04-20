/**
 * @file server.js
 * @description Express 서버 진입점 + 카드 관련 API 엔드포인트
 *
 * API 목록
 *   GET    /api/auth/me                          로그인 사용자 프로필 + 최근 접속 일시
 *   POST   /api/auth/login                       로그인
 *   POST   /api/auth/refresh                     Access Token 재발급
 *   POST   /api/auth/logout                      로그아웃
 *   GET    /api/cards                            카드 목록 (슬라이더·드롭다운용)
 *   GET    /api/transactions                     카드 이용내역
 *   GET    /api/payment-statement                결제예정금액 / 이용대금명세서
 *   GET    /api/cards/:cardId/payable-amount     즉시결제 가능금액
 *   POST   /api/cards/:cardId/immediate-pay      즉시결제 처리
 *   DELETE /api/cards/:cardId/pin-attempts       PIN 실패 횟수 초기화
 *   GET    /api/notices/sse                      긴급공지 SSE 스트림 (Demo Frontend 구독)
 *   POST   /api/notices/sync                     긴급공지 배포 동기화 (Admin 호출)
 *   POST   /api/notices/end                      긴급공지 배포 종료 (Admin 호출)
 *   GET    /api/notices/preview                  긴급공지 미리보기 (Admin 호출)
 *
 * DB ↔ 프론트 매핑 규칙 (이 파일 하단 mapper 함수 참고)
 *   Oracle 컬럼명(UPPER_SNAKE)  →  React 프롭(camelCase)
 */

"use strict";

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { apiLogger } = require("./utils/logger");
const jwt = require("jsonwebtoken");
const { initPool, withConnection, closePool } = require("./db");
const { detectBrand, maskCardNumber } = require("./utils/cardBrand");
const {
  addClient,
  broadcastNotice,
  clientCount,
} = require("./utils/sseManager");
const { getBillingPeriod } = require("./utils/billingPeriod");
const { getBillingSummaryByMonth } = require("./utils/billingByMonth");
// Admin TCP 클라이언트로부터 긴급공지 커맨드를 수신하는 TCP 서버 모듈
const { startTcpServer } = require("./tcp/tcpServer");
// Admin TcpClient.sendJson 대상 포트 (기본 9997). Admin `tcp.demo-backend.port`와 일치해야 함.
const TCP_PORT = parseInt(process.env.TCP_PORT || "9997", 10);

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
// Access Token: 짧은 TTL — 만료 시 Refresh Token으로 재발급
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "30m";
// Refresh Token: 긴 TTL — httpOnly 쿠키로 관리 (JS 접근 불가)
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "dev-refresh-secret";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
/** Admin → Demo Backend 호출 시 사용하는 공유 비밀 키 */
const ADMIN_SECRET = process.env.ADMIN_SECRET || "admin-secret";

/**
 * 현재 배포 중인 긴급공지 인메모리 상태.
 * null이면 배포 중인 공지 없음.
 * Admin이 POST /api/notices/sync 호출 시 업데이트된다.
 * Demo Backend 재기동 시 restoreNoticeState()로 DB에서 복구된다.
 *
 * @type {{ notices: Array<{lang: string, title: string, content: string}>, displayType: string, closeableYn: string, hideTodayYn: string } | null}
 */
let currentNotice = null;

/**
 * POC용 인메모리 Refresh Token 저장소.
 * 프로덕션에서는 Redis 또는 DB 테이블로 교체해야 한다.
 * Map<userId, refreshToken>
 */
const refreshTokenStore = new Map();

/**
 * POC용 인메모리 PIN 시도 횟수 저장소.
 * 프로덕션에서는 Redis 또는 DB 테이블로 교체해야 한다.
 * Map<`${userId}:${cardId}`, number>  — 실패 횟수 카운트
 */
const pinAttemptStore = new Map();

/** PIN 최대 허용 실패 횟수 */
const PIN_MAX_ATTEMPTS = 3;

/** Admin 전용 엔드포인트 인증 미들웨어 — X-Admin-Secret 헤더 검증 */
function verifyAdminSecret(req, res, next) {
  const secret = req.headers["x-admin-secret"];
  if (!secret || secret !== ADMIN_SECRET) {
    return res.status(403).json({ error: "관리자 인증이 필요합니다." });
  }
  next();
}

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

// ── 인증 ─────────────────────────────────────────────────────────────────────

/**
 * GET /api/auth/me
 * Authorization: Bearer <accessToken>
 * 현재 로그인 사용자의 프로필과 최근 접속 일시를 반환한다.
 * Access Token이 아직 유효해 refresh가 발생하지 않은 경우에도
 * 프론트엔드가 lastLogin을 즉시 채울 수 있도록 제공한다.
 */
app.get("/api/auth/me", verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const result = await withConnection((conn) =>
      conn.execute(
        `SELECT USER_NAME, USER_GRADE,
                TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS') AS LAST_LOGIN_DTIME
           FROM D_SPIDERLINK.POC_USER
          WHERE USER_ID = :userId`,
        { userId },
      ),
    );

    const row = result.rows?.[0];
    if (!row) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }

    return res.json({
      userId,
      userName:  row.USER_NAME,
      userGrade: row.USER_GRADE,
      lastLogin: formatLoginDtime(row.LAST_LOGIN_DTIME),
    });
  } catch (err) {
    console.error("[GET /api/auth/me]", err);
    return res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

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
        `SELECT USER_ID, USER_NAME, USER_GRADE, LOG_YN,
                TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS') AS LAST_LOGIN_DTIME
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
      userId: row.USER_ID,
      userName: row.USER_NAME,
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
      secure: false, // POC: HTTP 허용 (프로덕션에서는 true + HTTPS 필수)
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일 (ms)
      path: "/api/auth",
    });

    return res.json({
      success: true,
      token: accessToken, // 기존 키 유지 (프론트 AuthUser.token 호환)
      userId: row.USER_ID,
      userName: row.USER_NAME,
      userGrade: row.USER_GRADE,
      // LAST_LOGIN_DTIME 업데이트 전 값 — 이전 접속 시각을 메뉴 화면에 표시하기 위해 반환
      lastLogin: formatLoginDtime(row.LAST_LOGIN_DTIME),
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
 * 세션 활동이 감지되는 시점마다 LAST_LOGIN_DTIME을 갱신한다.
 */
app.post("/api/auth/refresh", (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh Token이 없습니다." });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const stored = refreshTokenStore.get(decoded.userId);

    // 저장된 토큰과 불일치 → 탈취된 토큰으로 간주, 즉시 무효화
    if (stored !== refreshToken) {
      refreshTokenStore.delete(decoded.userId);
      return res
        .status(401)
        .json({ error: "유효하지 않은 Refresh Token입니다." });
    }

    const newAccessToken = jwt.sign(
      {
        userId: decoded.userId,
        userName: decoded.userName,
        userGrade: decoded.userGrade,
      },
      JWT_SECRET,
      { expiresIn: JWT_ACCESS_EXPIRES_IN },
    );

    // LAST_LOGIN_DTIME 갱신 — 실패해도 토큰 발급은 허용
    withConnection((conn) =>
      conn.execute(
        `UPDATE D_SPIDERLINK.POC_USER
            SET LAST_LOGIN_DTIME = TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')
          WHERE USER_ID = :userId`,
        { userId: decoded.userId },
        { autoCommit: true },
      ),
    ).catch((e) =>
      console.warn("[refresh] LAST_LOGIN_DTIME 업데이트 실패:", e.message),
    );

    // 갱신 시각을 프론트에 전달해 '최근 접속 일시' 표시를 즉시 반영한다.
    // DB 업데이트는 비동기이므로 SYSDATE 대신 JS 현재 시각을 동일 포맷으로 생성한다.
    const n = new Date();
    const refreshedAt = formatLoginDtime(
      `${n.getFullYear()}${String(n.getMonth() + 1).padStart(2, "0")}${String(n.getDate()).padStart(2, "0")}${String(n.getHours()).padStart(2, "0")}${String(n.getMinutes()).padStart(2, "0")}${String(n.getSeconds()).padStart(2, "0")}`,
    );

    return res.json({ accessToken: newAccessToken, lastLogin: refreshedAt });
  } catch {
    return res
      .status(401)
      .json({ error: "Refresh Token이 만료되었거나 유효하지 않습니다." });
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
 * LAST_LOGIN_DTIME(YYYYMMDDHH24MISS 14자리) → 'YYYY.MM.DD HH:MM:SS'
 * @param {string|null} raw
 */
function formatLoginDtime(raw) {
  const s = String(raw ?? "").replace(/\D/g, "");
  if (s.length !== 14) return raw ?? "";
  return `${s.slice(0, 4)}.${s.slice(4, 6)}.${s.slice(6, 8)} ${s.slice(8, 10)}:${s.slice(10, 12)}:${s.slice(12, 14)}`;
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
  if (d.length === 8)
    // YYYYMMDD
    datePart = `${d.slice(0, 4)}.${d.slice(4, 6)}.${d.slice(6, 8)}`;
  else if (d.length === 6)
    // YYMMDD
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
  if (s.length === 8)
    // YYYYMMDD
    return `${Number(s.slice(4, 6))}월 ${Number(s.slice(6, 8))}일`;
  if (s.length === 6)
    // YYMMDD
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
    const {
      cardId,
      period,
      customMonth,
      usageType,
      fromDate: qFromDate,
      toDate: qToDate,
    } = req.query;

    // ── 날짜 범위 계산 ─────────────────────────────────────────────
    // fromDate/toDate 직접 전달 시 우선 사용, 없으면 period/customMonth로 계산
    const { fromDate: rangeFrom, toDate: rangeTo } = getDateRange(
      period,
      customMonth,
    );
    const fromDate = qFromDate || rangeFrom;
    const toDate = qToDate || rangeTo;

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
          paymentBank: ci["결제은행명"] ?? "",
          paymentAccount: String(ci["결제계좌"] ?? ""),
          paymentDay: String(ci["결제일"] ?? ""),
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
      let fromYear = y,
        fromMonth = m - 2;
      if (fromMonth <= 0) {
        fromYear--;
        fromMonth += 12;
      }
      const toDay = new Date(y, m, 0).getDate(); // targetMonth 말일
      txBinds.fromDate = `${fromYear}${String(fromMonth).padStart(2, "0")}01`;
      txBinds.toDate = `${y}${String(m).padStart(2, "0")}${String(toDay).padStart(2, "0")}`;
      txSql += ` AND "이용일자" >= :fromDate AND "이용일자" <= :toDate`;
    } else {
      /* 공여기간 필터: 전달받은 paymentDay 또는 DB 결제일 기준으로 이용일자 범위 산정 */
      const D = paymentDay ?? cardInfo?.paymentDay;
      if (D) {
        try {
          const bp = getBillingPeriod(new Date(), D);
          txSql += ` AND "이용일자" >= :fromDate AND "이용일자" <= :toDate`;
          txBinds.fromDate = bp.fromDate; // YYYYMMDD
          txBinds.toDate = bp.toDate; // YYYYMMDD
          billingPeriodFormatted = bp.formatted; // { usageStart, usageEnd, dueDate }
        } catch (e) {
          // 공여기간 계산 실패 시 날짜 조건 없이 쿼리가 실행되면 전체 데이터가 조회되므로
          // 조용히 무시하지 않고 에러를 상위로 전파해 500 응답을 반환한다
          console.error("[payment-statement] 공여기간 계산 실패:", e.message);
          throw new Error(`공여기간 계산 실패 (결제일: ${D}): ${e.message}`);
        }
      }
    }

    // ── 3. 이용내역 조회 ─────────────────────────────────────────────
    const txResult = await withConnection((conn) =>
      conn.execute(txSql, txBinds),
    );
    const txRows = txResult.rows || [];

    // ── 4. 집계 (yearMonth 유무에 따라 분기) ──────────────────────────
    let items, totalAmount, dueDate;

    if (yearMonth) {
      /* 카드별 결제일 공여기간을 개별 적용해 청구월을 정확히 판단 */
      const rawItems = txRows.map((r) => ({
        cardNo: String(r["카드번호"] ?? ""),
        cardName: r["카드명"] ?? "",
        useDate: String(r["이용일자"] ?? ""),
        amount: Number(r["이용금액"] ?? 0),
        dueDate: r["결제예정일"] ?? "",
      }));
      const summary = getBillingSummaryByMonth(
        rawItems,
        yearMonth,
        cardSettings,
      );

      /* 카드+결제예정일 조합별 재집계 (응답 포맷을 기존과 동일하게 유지) */
      const cardMap = {};
      summary.items.forEach((item) => {
        const key = `${item.cardNo}_${item.dueDate}`;
        if (!cardMap[key])
          cardMap[key] = {
            cardNo: item.cardNo,
            cardName: item.cardName,
            amount: 0,
            dueDate: item.dueDate,
          };
        cardMap[key].amount += item.amount;
      });
      items = Object.values(cardMap);
      totalAmount = summary.totalAmount;

      /* 대표 결제예정일 — 가장 많이 등장하는 값 */
      const cnt = {};
      summary.items.forEach((i) => {
        if (i.dueDate) cnt[i.dueDate] = (cnt[i.dueDate] || 0) + 1;
      });
      dueDate = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
    } else {
      /* 공여기간 기반 조회 — 기존 집계 로직 유지 */
      const cardMap = {};
      txRows.forEach((r) => {
        const key = `${r["카드번호"]}_${r["결제예정일"] ?? ""}`;
        if (!cardMap[key])
          cardMap[key] = {
            cardNo: r["카드번호"],
            cardName: r["카드명"] ?? "",
            amount: 0,
            dueDate: r["결제예정일"] ?? "",
          };
        cardMap[key].amount += Number(r["이용금액"] ?? 0);
      });
      items = Object.values(cardMap);
      totalAmount = items.reduce((sum, i) => sum + i.amount, 0);

      const cnt = {};
      txRows.forEach((r) => {
        const d = r["결제예정일"];
        if (d) cnt[d] = (cnt[d] || 0) + 1;
      });
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
 * GET /api/cards/:cardId/payable-amount
 * 즉시결제 가능금액 및 한도금액 조회.
 *
 * - payableAmount : POC_카드사용내역에서 누적결제금액 < 이용금액(취소 제외) 건의 미결제 잔액 합산
 * - creditLimit   : POC_카드리스트의 한도금액 (결제 후 이용가능한도 계산에 사용)
 *
 * Response 200: { payableAmount: number, creditLimit: number }
 */
app.get("/api/cards/:cardId/payable-amount", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { cardId } = req.params;

    const [usageResult, cardResult] = await withConnection((conn) =>
      Promise.all([
        /* 미결제 잔액 합산 */
        conn.execute(
          `SELECT NVL(SUM("이용금액" - "누적결제금액"), 0) AS PAYABLE_AMOUNT
             FROM D_SPIDERLINK.POC_카드사용내역
            WHERE "이용자"       = :userId
              AND "카드번호"     = :cardId
              AND "누적결제금액" < "이용금액"
              AND "결제상태코드" <> '9'`,
          /* 결제상태코드 9(취소건)는 즉시결제 대상에서 제외.
           * 0:미결제, 1:완납, 2:부분결제, 9:취소 */
          { userId, cardId },
        ),
        /* 카드 한도금액 조회 */
        conn.execute(
          `SELECT NVL("한도금액", 0) AS CREDIT_LIMIT
             FROM D_SPIDERLINK.POC_카드리스트
            WHERE "사용자아이디" = :userId
              AND "카드번호"     = :cardId`,
          { userId, cardId },
        ),
      ]),
    );

    const payableAmount = Number(usageResult.rows?.[0]?.PAYABLE_AMOUNT ?? 0);
    const creditLimit = Number(cardResult.rows?.[0]?.CREDIT_LIMIT ?? 0);
    res.json({ payableAmount, creditLimit });
  } catch (err) {
    console.error("[GET /api/cards/:cardId/payable-amount]", err);
    res.status(500).json({ error: "DB 조회 중 오류가 발생했습니다." });
  }
});

/**
 * POST /api/cards/:cardId/immediate-pay
 * 즉시결제 DB 처리 — PIN 인증 성공 직후 호출된다.
 *
 * 처리 흐름:
 *   1) 미결제 내역 조회 (이용일자 오름차순, FOR UPDATE 행 잠금)
 *   2) 오래된 건부터 순차 차감
 *      - 결제요청금액 >= 결제잔액 → 완납(1), 남은 금액을 다음 건으로 이월
 *      - 결제요청금액 <  결제잔액 → 부분결제(2), 잔액에서 차감 후 종료
 *   3) 결제된 총합계만큼 카드 이용가능금액 복원
 *   4) 전 과정 단일 트랜잭션 — 오류 발생 시 롤백
 *
 * 응답 코드 설계:
 *   - 401: Access Token 만료·무효 (verifyToken 미들웨어가 선행 처리)
 *          → 프론트 인터셉터가 토큰 갱신 후 재시도
 *   - 403: PIN 오류 (틀린 PIN / 횟수 초과)
 *          → 인터셉터는 재시도하지 않으며, 사용자에게 에러 메시지 표시
 *          → 토큰 만료와 PIN 오류를 동일한 401로 처리하면 인터셉터 재시도 시
 *            PIN 실패 카운트가 중복 증가하는 문제가 발생하므로 반드시 403 사용
 *
 * @param {string} req.params.cardId   - 결제 대상 카드번호
 * @param {string} req.body.pin        - PIN 번호 (오늘 날짜 MMDD, 예: "0415")
 * @param {number} req.body.amount     - 결제요청금액
 * @returns {{ paidAmount: number, processedCount: number }}
 */
app.post("/api/cards/:cardId/immediate-pay", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { cardId } = req.params;
    const { pin, amount, accountNumber } = req.body;
    const requestAmount = Number(amount);

    // PIN 검증 — 오늘 날짜의 MMDD (월·일 각 2자리, 예: 4월 15일 → "0415")
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const validPin = `${mm}${dd}`;
    const pinKey = `${userId}:${cardId}`; // 사용자·카드 조합 단위로 횟수 관리
    const attempts = pinAttemptStore.get(pinKey) ?? 0;

    if (attempts >= PIN_MAX_ATTEMPTS) {
      // 이미 3회 초과 — 더 이상 시도 불가.
      // 401이 아닌 403으로 응답해야 인터셉터가 토큰 갱신 재시도를 하지 않는다.
      return res.status(403).json({
        error: "PIN 입력 횟수를 초과하였습니다.",
        attemptsLeft: 0,
      });
    }

    if (String(pin) !== validPin) {
      const next = attempts + 1;
      pinAttemptStore.set(pinKey, next);
      const attemptsLeft = PIN_MAX_ATTEMPTS - next;
      // 401이 아닌 403으로 응답해야 인터셉터 재시도가 발생하지 않아
      // PIN 실패 카운트가 한 번만 증가한다.
      return res.status(403).json({
        error: "PIN 번호가 올바르지 않습니다.",
        attemptsLeft, // 남은 시도 횟수를 프론트에 전달
      });
    }

    // PIN 인증 성공 — 실패 횟수 초기화
    pinAttemptStore.delete(pinKey);

    if (!requestAmount || requestAmount <= 0) {
      return res
        .status(400)
        .json({ error: "결제요청금액이 유효하지 않습니다." });
    }

    const result = await withConnection(async (conn) => {
      try {
        // ── 0. 트랜잭션 기준 시각 조회 ────────────────────────────────
        // SYSDATE를 트랜잭션 시작 시 한 번만 조회해 뱅킹 거래내역·카드 사용내역
        // 업데이트·응답 completedAt에 모두 동일한 시각을 사용한다.
        // 여러 번 호출하면 트랜잭션 도중 초·분이 바뀔 때 시각 불일치가 생긴다.
        const { rows: [txRow] } = await conn.execute(
          `SELECT TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')   AS TX_DATETIME,
                  TO_CHAR(SYSDATE, 'YYYYMMDD')            AS TX_DATE,
                  TO_CHAR(SYSDATE, 'YYYY.MM.DD HH24:MI') AS COMPLETED_AT
             FROM DUAL`,
        );
        const txDateTime  = txRow.TX_DATETIME;  // 뱅킹 거래내역 INSERT용
        const txDate      = txRow.TX_DATE;       // 카드 사용내역 최종결제일자용
        const completedAt = txRow.COMPLETED_AT;  // 응답 처리일시용 — commit 전에 확보해야
                                                 // 커밋 후 조회 실패 시 500 반환을 막을 수 있다

        // ── 1. 미결제 내역 조회 ─────────────────────────────────────────
        // 미결제 잔액 총합을 먼저 구해야 뱅킹 계좌에서 차감할 실제 금액을 산정할 수 있다.
        // FOR UPDATE로 행을 잠가 동시 결제 요청에 의한 이중 차감을 방지한다.
        const { rows } = await conn.execute(
          `SELECT ROWID,
                  "결제잔액",
                  "누적결제금액"
             FROM D_SPIDERLINK.POC_카드사용내역
            WHERE "이용자"       = :userId
              AND "카드번호"     = :cardId
              AND "결제잔액"     > 0
              AND "결제상태코드" <> '9'
            ORDER BY "이용일자" ASC
            FOR UPDATE`,
          { userId, cardId },
        );

        // requestAmount가 미결제 잔액 총합보다 크면 초과분은 차감하지 않는다.
        // 초과 차감 시 뱅킹 계좌에서 돈이 빠져나갔지만 카드 내역에 반영되지 않아 차액이 소실된다.
        const totalDebt = rows.reduce((sum, r) => sum + Number(r["결제잔액"]), 0);
        const actualDeductAmount = Math.min(requestAmount, totalDebt);

        // ── 2. 뱅킹 계좌 잔액 확인 ──────────────────────────────────────
        // FOR UPDATE로 동시 출금 요청에 의한 중복 차감을 방지한다.
        // 잔액 비교는 실제 차감할 금액(actualDeductAmount) 기준으로 수행한다.
        const { rows: acctRows } = await conn.execute(
          `SELECT "계좌잔액"
             FROM D_SPIDERLINK.POC_뱅킹계좌정보
            WHERE "계좌번호"    = :accountNumber
              AND "사용자아이디" = :userId
            FOR UPDATE`,
          { accountNumber, userId },
        );

        if (!acctRows || acctRows.length === 0) {
          // 계좌 미존재는 비즈니스 오류 — 시스템 오류 메시지로 감추지 않고 사용자에게 전달
          const err = new Error("출금 계좌를 찾을 수 없습니다.");
          err.code = "ACCOUNT_NOT_FOUND";
          throw err;
        }

        const currentBalance = Number(acctRows[0]["계좌잔액"]);
        if (currentBalance < actualDeductAmount) {
          // 잔액 부족은 서버 오류가 아니라 비즈니스 오류이므로 별도 에러 코드로 처리
          const err = new Error("잔액이 부족합니다.");
          err.code = "INSUFFICIENT_BALANCE";
          throw err;
        }

        // ── 3. POC_카드사용내역 UPDATE — 이용일자 오래된 순으로 순차 차감 ──
        let remaining = actualDeductAmount; // 아직 배분하지 못한 결제 잔여금
        let totalPaid = 0;                  // 이번 결제에서 실제 차감된 총합계
        let processedCount = 0;             // 업데이트된 내역 건수

        for (const row of rows) {
          if (remaining <= 0) break;

          const 결제잔액 = Number(row["결제잔액"]);
          const 누적결제금액 = Number(row["누적결제금액"]);

          let deducted, newBalance, newStatusCode;

          if (remaining >= 결제잔액) {
            // 완납: 이 내역의 잔액을 전부 결제하고 남은 금액을 다음 건으로 이월
            deducted = 결제잔액;
            newBalance = 0;
            newStatusCode = "1"; // 1: 완납
          } else {
            // 부분결제: 남은 요청금액만큼만 차감하고 루프 종료
            deducted = remaining;
            newBalance = 결제잔액 - remaining;
            newStatusCode = "2"; // 2: 부분결제
          }

          await conn.execute(
            `UPDATE D_SPIDERLINK.POC_카드사용내역
                SET "결제잔액"     = :newBalance,
                    "누적결제금액" = :newAccumulated,
                    "결제상태코드" = :newStatusCode,
                    "최종결제일자" = :txDate
              WHERE ROWID = :rid`,
            {
              newBalance,
              newAccumulated: 누적결제금액 + deducted,
              newStatusCode,
              txDate,       // 미리 조회한 날짜 변수 사용 — SYSDATE 재호출 불필요
              rid: row.ROWID, // ROWID는 Oracle 예약 의사컬럼이라 바인드 변수명으로 사용 불가 → rid로 대체
            },
          );

          remaining -= deducted;
          totalPaid += deducted;
          processedCount++;
        }

        // 실제 차감된 금액을 반영한 최종 계좌 잔액
        const finalBalance = currentBalance - totalPaid;

        // ── 4. 뱅킹 계좌 잔액 차감 ──────────────────────────────────────
        // requestAmount가 아닌 totalPaid(실제 차감된 금액)로 잔액을 갱신해
        // 미결제 잔액이 요청 금액보다 적을 때 초과 차감되지 않도록 한다.
        await conn.execute(
          `UPDATE D_SPIDERLINK.POC_뱅킹계좌정보
              SET "계좌잔액" = :finalBalance
            WHERE "계좌번호"    = :accountNumber
              AND "사용자아이디" = :userId`,
          { finalBalance, accountNumber, userId },
        );

        // ── 5. 뱅킹 거래내역 INSERT ──────────────────────────────────────
        // 미리 조회한 txDateTime 변수를 사용해 계좌 차감과 동일한 시각을 기록한다.
        await conn.execute(
          `INSERT INTO D_SPIDERLINK.POC_뱅킹거래내역
             ("계좌번호", "거래일시", "거래점", "출금액", "입금액", "잔액",
              "보낸분받는분", "적요", "송금메모", "입금계좌번호", "사용자아이디")
           VALUES
             (:accountNumber, :txDateTime, '하나카드',
              :totalPaid, 0, :finalBalance,
              '하나카드사', '카드즉시결제', NULL, :cardId, :userId)`,
          { accountNumber, txDateTime, totalPaid, finalBalance, cardId, userId },
        );

        // ── 6. POC_카드리스트 UPDATE — 한도 복원 ─────────────────────────
        // 결제된 총합계만큼 사용금액을 차감한다.
        // 이용가능금액 컬럼은 없음 — 한도금액 - 사용금액으로 계산되는 파생값
        if (totalPaid > 0) {
          await conn.execute(
            `UPDATE D_SPIDERLINK.POC_카드리스트
                SET "사용금액" = "사용금액" - :totalPaid
              WHERE "사용자아이디" = :userId
                AND "카드번호"     = :cardId`,
            { totalPaid, userId, cardId },
          );
        }

        // ── 7. 커밋 — 모든 UPDATE/INSERT가 성공해야 반영된다 ─────────────
        // completedAt은 커밋 전에 이미 확보했으므로 커밋 후 조회 실패로
        // 결제가 완료되었는데 500 응답이 반환되는 문제가 발생하지 않는다.
        await conn.commit();

        return { paidAmount: totalPaid, processedCount, completedAt };
      } catch (err) {
        // 어느 한 단계라도 실패하면 전체 롤백하여 데이터 무결성 보장
        await conn.rollback();
        // 잔액 부족은 비즈니스 오류이므로 code를 유지한 채 상위로 전파
        throw err;
      }
    });

    res.json(result);
  } catch (err) {
    // 비즈니스 오류는 사용자에게 구체적인 사유를 전달하기 위해 422로 응답한다.
    // 시스템 오류(DB 장애 등)는 내부 상세를 노출하지 않고 일반 메시지만 반환한다.
    const BUSINESS_ERROR_CODES = ["INSUFFICIENT_BALANCE", "ACCOUNT_NOT_FOUND"];
    if (BUSINESS_ERROR_CODES.includes(err.code)) {
      return res.status(422).json({ error: err.message });
    }
    console.error("[POST /api/cards/:cardId/immediate-pay]", err);
    res.status(500).json({ error: "즉시결제 처리 중 오류가 발생했습니다." });
  }
});

/**
 * DELETE /api/cards/:cardId/pin-attempts
 * PIN 실패 횟수 초기화.
 * 횟수 초과로 잠긴 사용자가 초기화 버튼을 클릭할 때 호출된다.
 */
app.delete("/api/cards/:cardId/pin-attempts", verifyToken, (req, res) => {
  const userId = req.user.userId;
  const { cardId } = req.params;
  pinAttemptStore.delete(`${userId}:${cardId}`);
  res.json({ ok: true });
});

// ════════════════════════════════════════════════════════════════════════════
// 긴급공지 SSE 엔드포인트
// ════════════════════════════════════════════════════════════════════════════

/**
 * GET /api/notices/sse
 * Demo Frontend가 연결하는 SSE 스트림.
 * 연결 즉시 현재 인메모리 공지 상태를 전송하고, 이후 변경 시마다 이벤트를 보낸다.
 */
app.get("/api/notices/sse", (req, res) => {
  // SSE 응답 헤더 설정
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // 연결 즉시 현재 공지 상태 전송 (재접속 시 최신 상태 즉시 반영)
  const initData = JSON.stringify(currentNotice);
  res.write(`event: notice\ndata: ${initData}\n\n`);

  // 연결 목록에 추가 (close 이벤트 시 자동 제거)
  addClient(res);

  console.log(`[SSE] 클라이언트 연결 (현재 ${clientCount()}명)`);
});

/**
 * POST /api/notices/sync
 * Admin이 긴급공지를 배포할 때 호출한다.
 * 인메모리 상태를 업데이트하고 연결된 모든 SSE 클라이언트에게 브로드캐스트한다.
 *
 * Request Body:
 *   {
 *     notices:     [{ lang: 'EMERGENCY_KO', title: '...', content: '...' }, ...],
 *     displayType: 'A' | 'B' | 'C' | 'N',
 *     closeableYn: 'Y' | 'N',   -- 닫기 버튼 노출 여부
 *     hideTodayYn: 'Y' | 'N'    -- 오늘 하루 보지 않기 체크박스 노출 여부
 *   }
 */
app.post("/api/notices/sync", verifyAdminSecret, (req, res) => {
  const { notices, displayType, closeableYn, hideTodayYn } = req.body;

  if (!notices || !Array.isArray(notices) || !displayType) {
    return res
      .status(400)
      .json({ error: "notices 배열과 displayType이 필요합니다." });
  }

  currentNotice = {
    notices,
    displayType,
    closeableYn: closeableYn ?? "Y",
    hideTodayYn: hideTodayYn ?? "Y",
  };
  broadcastNotice(currentNotice);

  console.log(
    `[SSE] 긴급공지 배포 동기화 완료: displayType=${displayType}, 클라이언트=${clientCount()}명`,
  );
  res.json({ success: true });
});

/**
 * POST /api/notices/end
 * Admin이 긴급공지 배포를 종료할 때 호출한다.
 * 인메모리 상태를 null로 초기화하고 연결된 모든 SSE 클라이언트에게 null을 브로드캐스트한다.
 */
app.post("/api/notices/end", verifyAdminSecret, (req, res) => {
  currentNotice = null;
  broadcastNotice(null);

  console.log(`[SSE] 긴급공지 배포 종료: 클라이언트=${clientCount()}명`);
  res.json({ success: true });
});

/**
 * GET /api/notices/preview
 * Admin 미리보기 전용 엔드포인트.
 * DEPLOY_STATUS에 관계없이 FWK_PROPERTY에서 최신 저장된 공지 내용을 반환한다.
 * 저장 후 배포 전 상태를 Admin에서 미리 확인하는 용도로 사용된다.
 */
app.get("/api/notices/preview", async (req, res) => {
  try {
    const result = await withConnection(async (conn) => {
      // USE_YN 행에서 현재 노출 타입 조회 (배포 상태 무관)
      const statusRes = await conn.execute(
        `SELECT DEFAULT_VALUE AS DISPLAY_TYPE
           FROM FWK_PROPERTY
          WHERE PROPERTY_GROUP_ID = 'notice'
            AND PROPERTY_ID = 'USE_YN'`,
      );
      const row = statusRes.rows?.[0];

      // 언어별 공지 내용 조회
      const noticeRes = await conn.execute(
        `SELECT PROPERTY_ID AS LANG, PROPERTY_DESC AS TITLE, DEFAULT_VALUE AS CONTENT
           FROM FWK_PROPERTY
          WHERE PROPERTY_GROUP_ID = 'notice'
            AND PROPERTY_ID IN ('EMERGENCY_KO', 'EMERGENCY_EN')
          ORDER BY PROPERTY_ID`,
      );

      return {
        notices: (noticeRes.rows || []).map((r) => ({
          lang: r.LANG,
          title: r.TITLE || "",
          content: r.CONTENT || "",
        })),
        displayType: row?.DISPLAY_TYPE || "N",
      };
    });

    res.json(result);
  } catch (err) {
    console.error("[Preview] 공지 데이터 조회 실패:", err);
    res.status(500).json({ error: "공지 데이터를 불러오지 못했습니다." });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// 서버 기동 — DB 풀이 준비된 후에만 listen
// ════════════════════════════════════════════════════════════════════════════

/**
 * 서버 재기동 시 FWK_PROPERTY에서 배포 상태를 복구한다.
 * DEPLOY_STATUS='DEPLOYED'인 경우 인메모리 공지를 채운다.
 * DB 조회 실패 시 경고 로그만 출력하고 공지 없이 기동한다.
 */
async function restoreNoticeState() {
  try {
    const result = await withConnection(async (conn) => {
      // USE_YN 행에서 배포 상태 확인
      // outFormat은 db.js에서 전역으로 OUT_FORMAT_OBJECT로 설정되어 있으므로 별도 지정 불필요
      const statusRes = await conn.execute(
        `SELECT DEFAULT_VALUE AS DISPLAY_TYPE, DEPLOY_STATUS
           FROM FWK_PROPERTY
          WHERE PROPERTY_GROUP_ID = 'notice'
            AND PROPERTY_ID = 'USE_YN'`,
      );
      const row = statusRes.rows?.[0];
      if (!row || row.DEPLOY_STATUS !== "DEPLOYED") return null;

      // DEPLOYED 상태면 공지 내용 조회
      const noticeRes = await conn.execute(
        `SELECT PROPERTY_ID AS LANG, PROPERTY_DESC AS TITLE, DEFAULT_VALUE AS CONTENT
           FROM FWK_PROPERTY
          WHERE PROPERTY_GROUP_ID = 'notice'
            AND PROPERTY_ID IN ('EMERGENCY_KO', 'EMERGENCY_EN')
          ORDER BY PROPERTY_ID`,
      );
      // 노출 설정(닫기 버튼, 오늘 하루 보지 않기) 조회
      const settingsRes = await conn.execute(
        `SELECT PROPERTY_ID, DEFAULT_VALUE
           FROM FWK_PROPERTY
          WHERE PROPERTY_GROUP_ID = 'notice'
            AND PROPERTY_ID IN ('CLOSEABLE_YN', 'HIDE_TODAY_YN')`,
      );
      const settingsMap = {};
      (settingsRes.rows || []).forEach((r) => {
        settingsMap[r.PROPERTY_ID] = r.DEFAULT_VALUE;
      });

      return {
        notices: (noticeRes.rows || []).map((r) => ({
          lang: r.LANG,
          title: r.TITLE || "",
          content: r.CONTENT || "",
        })),
        displayType: row.DISPLAY_TYPE || "N",
        closeableYn: settingsMap["CLOSEABLE_YN"] ?? "Y",
        hideTodayYn: settingsMap["HIDE_TODAY_YN"] ?? "Y",
      };
    });

    if (result) {
      currentNotice = result;
      console.log(
        `[Server] 긴급공지 상태 복구 완료: displayType=${result.displayType}`,
      );
    } else {
      console.log("[Server] 배포 중인 긴급공지 없음 — 초기 상태로 기동");
    }
  } catch (err) {
    console.warn("[Server] 긴급공지 상태 복구 실패 (비치명적):", err.message);
  }
}

async function start() {
  try {
    await initPool(); // ① 커넥션 풀 먼저 생성
    await restoreNoticeState(); // ② 재기동 시 배포 상태 복구

    // TCP 서버 기동 (HTTP REST 서버와 독립적으로 시작, 병행 운영)
    // Admin의 DemoBackendAdapter가 4바이트 길이 프리픽스 + UTF-8 JSON으로 커맨드를 전송한다.
    // onSync/onEnd는 기존 POST /api/notices/sync, /api/notices/end와 동일한 비즈니스 로직을 수행한다.
    startTcpServer(
      {
        onSync: (payload) => {
          currentNotice = {
            notices:     payload.notices     || [],
            displayType: payload.displayType || "N",
            closeableYn: payload.closeableYn ?? "Y",
            hideTodayYn: payload.hideTodayYn ?? "Y",
          };
          broadcastNotice(currentNotice);
          console.log(`[TcpServer] 긴급공지 TCP 동기화: displayType=${payload.displayType}`);
        },
        onEnd: () => {
          currentNotice = null;
          broadcastNotice(null);
          console.log("[TcpServer] 긴급공지 TCP 배포 종료");
        },
      },
      TCP_PORT,
    );

    app.listen(PORT, () => {
      // ③ 풀 준비 완료 후 서버 오픈
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
