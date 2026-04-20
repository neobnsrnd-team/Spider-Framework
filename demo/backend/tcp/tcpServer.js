/**
 * @file tcpServer.js
 * @description Admin으로부터 긴급공지 TCP 커맨드를 수신하는 서버.
 *
 * 프로토콜: [4바이트 길이(int, big-endian)] + [UTF-8 JSON 바이트열]
 * Admin의 TcpClient.sendJson()과 동일한 포맷을 사용한다.
 *
 * 지원 커맨드:
 *   PING           — 연결 상태 확인
 *   NOTICE_SYNC    — 긴급공지 배포 동기화 (payload: { notices, displayType, closeableYn, hideTodayYn })
 *   NOTICE_END     — 긴급공지 배포 종료
 *
 * HTTP REST 경로(POST /api/notices/sync, POST /api/notices/end)와 병행 운영된다.
 */

"use strict";

const net = require("net");

/** 수신 메시지 최대 허용 크기 (1 MB) — 초과 시 비정상 요청으로 간주하여 연결 종료 */
const MAX_MSG_LEN = 1024 * 1024;

/**
 * TCP 서버를 생성하고 시작한다.
 *
 * @param {{ onSync: Function, onEnd: Function }} handlers - 커맨드 처리 핸들러
 * @param {number} port - 수신 포트
 * @returns {net.Server}
 */
function startTcpServer(handlers, port) {
  const server = net.createServer((socket) => {
    socket.setKeepAlive(true);
    socket.setNoDelay(true);
    socket.setTimeout(60000);

    // chunks 배열로 수신 데이터를 누적하여 data 이벤트마다 발생하는 불필요한 Buffer 복사 최소화
    let chunks = [];
    let totalLength = 0;

    socket.on("data", (chunk) => {
      chunks.push(chunk);
      totalLength += chunk.length;

      // 4바이트 길이 프리픽스 파싱 루프 (한 번에 여러 메시지 수신 가능)
      while (totalLength >= 4) {
        // 파싱이 필요한 시점에만 flatten — 불필요한 메모리 할당 방지
        const buffer = Buffer.concat(chunks);
        const msgLen = buffer.readInt32BE(0);

        // 음수 또는 허용 최대 크기 초과 시 비정상 요청으로 즉시 연결 종료
        if (msgLen < 0 || msgLen > MAX_MSG_LEN) {
          console.error(`[TcpServer] 허용 범위를 초과한 메시지 길이: ${msgLen}`);
          socket.destroy();
          return;
        }

        if (buffer.length < 4 + msgLen) break;

        const msgBuf = buffer.slice(4, 4 + msgLen);
        const remaining = buffer.slice(4 + msgLen);
        // 처리된 데이터를 제외한 나머지만 chunks에 보존
        chunks = remaining.length > 0 ? [remaining] : [];
        totalLength = remaining.length;

        let request;
        try {
          request = JSON.parse(msgBuf.toString("utf8"));
        } catch (err) {
          console.error("[TcpServer] JSON 파싱 실패:", err.message);
          sendResponse(socket, { command: "UNKNOWN", success: false, error: "JSON 파싱 실패" });
          continue;
        }

        console.log(`[TcpServer] 수신: command=${request.command}, requestId=${request.requestId}`);

        const response = processCommand(request, handlers);
        sendResponse(socket, response);
      }
    });

    socket.on("timeout", () => {
      console.warn("[TcpServer] 소켓 타임아웃 — 연결 종료");
      socket.end();
    });

    socket.on("error", (err) => {
      console.error("[TcpServer] 소켓 오류:", err.message);
    });
  });

  server.listen(port, () => {
    console.log(`[TcpServer] demo/backend TCP 서버 시작: port=${port}`);
  });

  server.on("error", (err) => {
    console.error("[TcpServer] 서버 오류:", err.message);
  });

  return server;
}

/**
 * 커맨드를 처리하고 응답 객체를 반환한다.
 *
 * @param {object} request - JsonCommandRequest
 * @param {object} handlers - 커맨드 핸들러 맵
 * @returns {object} JsonCommandResponse
 */
function processCommand(request, handlers) {
  const { command, requestId } = request;

  try {
    if (command === "PING") {
      return { command, requestId, success: true, message: "pong" };
    }

    if (command === "NOTICE_SYNC") {
      const payload = request.payload || {};
      handlers.onSync(payload);
      return { command, requestId, success: true, message: "SYNCED" };
    }

    if (command === "NOTICE_END") {
      handlers.onEnd();
      return { command, requestId, success: true, message: "ENDED" };
    }

    return { command, requestId, success: false, error: `지원하지 않는 커맨드: ${command}` };
  } catch (err) {
    console.error(`[TcpServer] 커맨드 처리 오류: command=${command},`, err.message);
    return { command, requestId, success: false, error: err.message };
  }
}

/**
 * 4바이트 길이 프리픽스 + UTF-8 JSON 형식으로 응답을 전송한다.
 *
 * @param {net.Socket} socket
 * @param {object} response
 */
function sendResponse(socket, response) {
  try {
    const responseBytes = Buffer.from(JSON.stringify(response), "utf8");
    const header = Buffer.alloc(4);
    header.writeInt32BE(responseBytes.length, 0);
    socket.write(Buffer.concat([header, responseBytes]));
    console.log(`[TcpServer] 응답 전송: command=${response.command}, success=${response.success}`);
  } catch (err) {
    console.error("[TcpServer] 응답 전송 실패:", err.message);
    socket.destroy();
  }
}

module.exports = { startTcpServer };
