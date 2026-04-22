/**
 * @file adminTcpProxy.js
 * @description Demo Backend → Admin TCP 프록시 미들웨어 (POC 테스트용)
 *
 * Demo 앱 프론트엔드 요청을 Admin TCP 서버로 포워딩하여
 * FWK_TRX 검증 및 FWK_MESSAGE_INSTANCE 로그를 기록한다.
 *
 * X-Admin-Secret 헤더가 있으면 Admin의 역방향 호출로 판단하여 건너뛴다.
 * (Admin이 실제 처리를 위해 Demo 백엔드를 직접 호출할 때 순환 방지)
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
"use strict";

const net = require("net");

const ADMIN_HOST = process.env.ADMIN_HOST || "localhost";
const ADMIN_TCP_PORT = parseInt(process.env.ADMIN_TCP_PORT || "9090", 10);

// HTTP 요청 → Admin 전문 ID 매핑
const ROUTE_MAP = [
  {
    method: "POST",
    pattern: /^\/api\/auth\/login$/,
    messageId: "DEMO_AUTH_LOGIN",
  },
  {
    method: "GET",
    pattern: /^\/api\/auth\/me$/,
    messageId: "DEMO_AUTH_ME",
  },
  {
    method: "GET",
    // cardId 캡처 그룹
    pattern: /^\/api\/cards\/([^/]+)\/payable-amount$/,
    messageId: "DEMO_PAYABLE_AMT",
  },
];

/**
 * JSON 객체를 OLI 포맷으로 직렬화한다.
 * 포맷: [8byte 바이트 길이 헤더][JSON 문자열][@@]
 *
 * @param {object} payload
 * @returns {string}
 */
function encodeOli(payload) {
  const json = JSON.stringify(payload);
  const byteLen = Buffer.byteLength(json, "utf8");
  const header = String(byteLen).padStart(8, "0");
  return header + json + "@@";
}

/**
 * OLI 포맷 버퍼에서 JSON 객체를 파싱한다.
 * Buffer 기반 슬라이싱으로 멀티바이트 문자의 바이트/문자 불일치를 방지한다.
 *
 * @param {string} raw
 * @returns {object}
 */
function decodeOli(raw) {
  const buf = Buffer.from(raw, "utf8");
  const bodyLen = parseInt(buf.subarray(0, 8).toString("utf8"), 10);
  const json = buf.subarray(8, 8 + bodyLen).toString("utf8");
  return JSON.parse(json);
}

/**
 * Admin TCP 서버에 전문을 송신하고 응답을 반환한다.
 *
 * @param {object} payload - { messageId, orgId, data }
 * @returns {Promise<object>} - { messageId, resultCode, data }
 */
function sendTcp(payload) {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    let buf = "";

    client.setTimeout(10000);

    client.connect(ADMIN_TCP_PORT, ADMIN_HOST, () => {
      client.write(encodeOli(payload), "utf8");
    });

    client.on("data", (chunk) => {
      buf += chunk.toString("utf8");
      if (buf.includes("@@")) {
        try {
          resolve(decodeOli(buf));
        } catch (e) {
          reject(new Error("Admin TCP 응답 파싱 실패: " + buf));
        }
        client.destroy();
      }
    });

    client.on("timeout", () => {
      client.destroy();
      reject(new Error("Admin TCP 타임아웃 (10초)"));
    });

    client.on("error", reject);
  });
}

module.exports = function adminTcpProxy(req, res, next) {
  // Admin이 역방향 호출할 때는 순환 방지를 위해 건너뜀
  if (req.headers["x-admin-secret"]) {
    return next();
  }

  const matched = ROUTE_MAP.find(
    (r) => r.method === req.method && r.pattern.test(req.path)
  );
  if (!matched) {
    return next();
  }

  // Authorization 헤더에서 JWT 토큰 추출
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : undefined;

  // messageId별 전문 데이터 구성
  let data = {};
  if (matched.messageId === "DEMO_AUTH_LOGIN") {
    data = req.body || {};
  } else if (matched.messageId === "DEMO_AUTH_ME") {
    data = { token };
  } else if (matched.messageId === "DEMO_PAYABLE_AMT") {
    const m = req.path.match(matched.pattern);
    data = { cardId: m[1], token };
  }

  sendTcp({ messageId: matched.messageId, orgId: "DEMO", data })
    .then((result) => {
      if (result.resultCode === "0000") {
        res.json(result.data);
      } else {
        res.status(400).json({
          error: result.resultMessage || "거래 처리 실패",
          resultCode: result.resultCode,
        });
      }
    })
    .catch((err) => {
      // Admin TCP 장애 시 기존 라우트로 폴백하여 서비스 연속성 보장
      console.warn("[AdminTcpProxy] Admin TCP 호출 실패, 기존 라우트로 폴백:", err.message);
      next();
    });
};
