/**
 * @file tcpClient.js
 * @description demo/backend → Admin TCP 서버 송신 클라이언트.
 *
 * 프로토콜: [4바이트 길이(int, big-endian)] + [UTF-8 JSON 바이트열]
 * spider-link의 TcpClient.sendJson() 및 tcpServer.js의 sendResponse()와 동일한 포맷을 사용한다.
 *
 * 소켓 옵션 (spider-link TcpClient.java 기준):
 *   - 연결 타임아웃: 2초
 *   - 읽기 타임아웃: 60초 (배치 실행 대기 포함)
 *   - setKeepAlive(true), setNoDelay(true)
 *
 * @param {string} command - 커맨드 이름 (예: "DEMO_AUTH_ME", "DEMO_AUTH_LOGIN")
 * @param {object} payload - 커맨드 페이로드 (JsonCommandRequest.payload)
 * @returns {Promise<{ command: string, success: boolean, message: string, error: string, payload: object }>}
 */

"use strict";

const net = require("net");
const crypto = require("crypto");

// Admin TCP 서버 접속 정보 — Admin의 tcp.server.port와 일치해야 한다
const ADMIN_HOST = process.env.ADMIN_TCP_HOST || "localhost";
const ADMIN_PORT = parseInt(process.env.ADMIN_TCP_PORT || "9999", 10);

/** 연결 타임아웃: 2초 (spider-link TcpClient.java CONNECT_TIMEOUT_MS 기준) */
const CONNECT_TIMEOUT_MS = 2_000;

/** 읽기 타임아웃: 60초 (spider-link TcpClient.java READ_TIMEOUT_MS 기준) */
const READ_TIMEOUT_MS = 60_000;

/** 수신 메시지 최대 허용 크기 (1 MB) — 초과 시 비정상 응답으로 간주 */
const MAX_MSG_LEN = 1024 * 1024;

/**
 * Admin TCP 서버에 JsonCommandRequest를 전송하고 JsonCommandResponse를 반환한다.
 *
 * @param {string} command 커맨드 이름
 * @param {object} [payload={}] 커맨드 페이로드
 * @returns {Promise<object>} JsonCommandResponse
 */
function sendToAdmin(command, payload) {
  return new Promise((resolve, reject) => {
    const requestBody = {
      command,
      requestId: crypto.randomUUID(),
      payload: payload || {},
    };

    const requestBytes = Buffer.from(JSON.stringify(requestBody), "utf8");
    const header = Buffer.alloc(4);
    header.writeInt32BE(requestBytes.length, 0);

    const socket = new net.Socket();
    socket.setKeepAlive(true);
    socket.setNoDelay(true);

    let resolved = false;
    let chunks = [];
    let totalLength = 0;
    let expectedLen = -1; // 4바이트 헤더에서 읽은 메시지 길이 (-1 = 아직 미수신)

    // 연결 타임아웃: connect 이벤트가 발생하기 전까지만 유효
    const connectTimer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        socket.destroy();
        reject(new Error(`Admin TCP 연결 타임아웃: ${ADMIN_HOST}:${ADMIN_PORT}`));
      }
    }, CONNECT_TIMEOUT_MS);

    socket.connect(ADMIN_PORT, ADMIN_HOST, () => {
      clearTimeout(connectTimer);
      // 연결 성공 후 읽기 비활성 타임아웃으로 전환
      socket.setTimeout(READ_TIMEOUT_MS);
      // [4바이트 길이] + [JSON 바이트열] 전송
      socket.write(Buffer.concat([header, requestBytes]));
    });

    socket.on("timeout", () => {
      if (!resolved) {
        resolved = true;
        socket.destroy();
        reject(new Error(`Admin TCP 읽기 타임아웃: ${ADMIN_HOST}:${ADMIN_PORT}`));
      }
    });

    socket.on("data", (chunk) => {
      chunks.push(chunk);
      totalLength += chunk.length;
      tryParse();
    });

    socket.on("error", (err) => {
      clearTimeout(connectTimer);
      if (!resolved) {
        resolved = true;
        reject(err);
      }
    });

    socket.on("close", () => {
      clearTimeout(connectTimer);
      if (!resolved) {
        resolved = true;
        reject(new Error("Admin TCP 연결이 응답 수신 전에 종료되었습니다."));
      }
    });

    /**
     * 누적된 chunks에서 응답을 파싱 시도한다.
     * 단일 요청-응답 구조이므로 첫 번째 완전한 메시지만 처리한다.
     */
    function tryParse() {
      // Step 1: 4바이트 길이 헤더 파싱 (아직 미수신 상태)
      if (expectedLen === -1) {
        if (totalLength < 4) return;
        const buf = Buffer.concat(chunks);
        expectedLen = buf.readInt32BE(0);

        if (expectedLen < 0 || expectedLen > MAX_MSG_LEN) {
          if (!resolved) {
            resolved = true;
            socket.destroy();
            reject(new Error(`수신된 메시지 길이가 허용 범위를 초과합니다: ${expectedLen}`));
          }
          return;
        }

        // 헤더(4바이트) 이후 나머지 바이트만 보존
        const remaining = buf.slice(4);
        chunks = remaining.length > 0 ? [remaining] : [];
        totalLength = remaining.length;
      }

      // Step 2: 메시지 바이트 완전 수신 확인 후 JSON 파싱
      if (totalLength >= expectedLen) {
        const buf = Buffer.concat(chunks);
        const msgBuf = buf.slice(0, expectedLen);

        if (!resolved) {
          resolved = true;
          socket.destroy();
          try {
            resolve(JSON.parse(msgBuf.toString("utf8")));
          } catch (err) {
            reject(new Error(`Admin TCP 응답 JSON 파싱 실패: ${err.message}`));
          }
        }
      }
    }
  });
}

module.exports = { sendToAdmin };
