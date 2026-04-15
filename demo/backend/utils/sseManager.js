/**
 * @file sseManager.js
 * @description Server-Sent Events(SSE) 클라이언트 연결 관리 유틸리티
 *
 * 역할:
 *   - 연결된 SSE 클라이언트(Demo Frontend) 목록을 관리한다.
 *   - 긴급공지 이벤트를 모든 연결된 클라이언트에게 브로드캐스트한다.
 *
 * 사용 예시:
 * @example
 *   const { addClient, removeClient, broadcastNotice } = require('./utils/sseManager');
 *
 *   // SSE 연결 등록
 *   app.get('/api/notices/sse', (req, res) => {
 *     addClient(res);
 *   });
 *
 *   // 공지 브로드캐스트
 *   broadcastNotice({ notices: [...], displayType: 'A' });
 */

"use strict";

/** @type {Set<import('express').Response>} 현재 연결된 SSE 클라이언트 응답 객체 목록 */
const clients = new Set();

/**
 * SSE 클라이언트를 등록하고 연결 종료 시 자동 제거한다.
 *
 * @param {import('express').Response} res - Express 응답 객체 (SSE 헤더가 이미 설정된 상태)
 */
function addClient(res) {
    clients.add(res);
    // 클라이언트가 연결을 끊으면 목록에서 제거
    res.on("close", () => {
        clients.delete(res);
    });
}

/**
 * 특정 클라이언트를 목록에서 제거한다.
 *
 * @param {import('express').Response} res
 */
function removeClient(res) {
    clients.delete(res);
}

/**
 * 현재 연결된 클라이언트 수를 반환한다.
 *
 * @returns {number}
 */
function clientCount() {
    return clients.size;
}

/**
 * 긴급공지 데이터를 모든 연결된 SSE 클라이언트에게 브로드캐스트한다.
 *
 * SSE 이벤트 형식:
 *   event: notice
 *   data: { notices: [...], displayType: 'A' }
 *
 * @param {object|null} payload - 공지 데이터 (null이면 공지 종료 신호)
 */
function broadcastNotice(payload) {
    const data    = JSON.stringify(payload);
    const message = `event: notice\ndata: ${data}\n\n`;

    clients.forEach((res) => {
        try {
            const ok = res.write(message);
            // write()가 false를 반환하면 쓰기 버퍼 포화(Backpressure) 상태.
            // 데이터 유실 및 메모리 부하를 방지하기 위해 해당 연결을 종료한다.
            if (!ok) {
                clients.delete(res);
                res.end();
            }
        } catch (err) {
            // 이미 닫힌 연결 또는 쓰기 오류 — 스트림을 명확히 닫고 목록에서 제거
            clients.delete(res);
            res.end();
        }
    });
}

module.exports = { addClient, removeClient, clientCount, broadcastNotice };
