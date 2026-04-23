/**
 * @file tcpClient.js
 * @description Admin TCP 서버(9999)로 전문을 송신하는 클라이언트.
 *
 * 프로토콜: [4바이트 길이(int, big-endian)] + [UTF-8 JSON 바이트열]
 * Admin의 TcpServer / TcpClientHandler와 동일한 포맷을 사용한다.
 *
 * @param {string} command  - 전문 커맨드명 (예: DEMO_AUTH_LOGIN)
 * @param {object} payload  - 전문 페이로드
 * @returns {Promise<object>} Admin 응답 객체 { command, success, message, error, payload }
 */

"use strict";

const net = require("net");
const { randomUUID } = require("crypto");

const ADMIN_TCP_HOST = process.env.ADMIN_TCP_HOST || "localhost";
const ADMIN_TCP_PORT = parseInt(process.env.ADMIN_TCP_PORT || "9999", 10);
// 응답 대기 타임아웃 (ms)
const TIMEOUT_MS = 10000;

/**
 * Admin TCP 서버로 커맨드를 전송하고 응답을 반환한다.
 *
 * @param {string} command  전문 커맨드명
 * @param {object} payload  전문 페이로드
 * @returns {Promise<object>} Admin 응답 객체
 */
function sendToAdmin(command, payload) {
  return new Promise((resolve, reject) => {
    const request = {
      command,
      requestId: randomUUID(),
      payload,
    };

    const requestBytes = Buffer.from(JSON.stringify(request), "utf8");
    const header = Buffer.alloc(4);
    header.writeInt32BE(requestBytes.length, 0);
    const packet = Buffer.concat([header, requestBytes]);

    const socket = new net.Socket();
    socket.setTimeout(TIMEOUT_MS);

    let chunks = [];
    let totalLength = 0;
    let settled = false;

    function done(err, result) {
      if (settled) return;
      settled = true;
      socket.destroy();
      if (err) reject(err);
      else resolve(result);
    }

    socket.connect(ADMIN_TCP_PORT, ADMIN_TCP_HOST, () => {
      socket.write(packet);
    });

    socket.on("data", (chunk) => {
      chunks.push(chunk);
      totalLength += chunk.length;

      if (totalLength < 4) return;

      const buffer = Buffer.concat(chunks);
      const msgLen = buffer.readInt32BE(0);

      if (buffer.length < 4 + msgLen) return;

      const msgBuf = buffer.slice(4, 4 + msgLen);
      try {
        const response = JSON.parse(msgBuf.toString("utf8"));
        done(null, response);
      } catch (e) {
        done(new Error("Admin TCP 응답 파싱 실패: " + e.message));
      }
    });

    socket.on("timeout", () => {
      done(new Error("Admin TCP 응답 타임아웃"));
    });

    socket.on("error", (err) => {
      done(new Error("Admin TCP 연결 오류: " + err.message));
    });
  });
}

module.exports = { sendToAdmin };
