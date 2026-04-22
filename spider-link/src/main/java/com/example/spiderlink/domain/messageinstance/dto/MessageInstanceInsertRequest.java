package com.example.spiderlink.domain.messageinstance.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * FWK_MESSAGE_INSTANCE INSERT 요청 DTO.
 *
 * <p>Demo TCP 전문 요청·응답 각 1건을 기록한다.</p>
 */
@Getter
@Builder
public class MessageInstanceInsertRequest {

    /** PK — UUID 하이픈 제거 후 30자 (VARCHAR2(30) 제약) */
    private String messageSno;

    /** 거래 ID (예: DEMO_AUTH_LOGIN) */
    private String trxId;

    /** 기관 ID */
    private String orgId;

    /** 입출력 구분 — I: 입력(REQ), O: 출력(RES) */
    private String ioType;

    /** 요청/응답 구분 — Q: 요청, S: 응답 */
    private String reqResType;

    /** 전문 ID (예: DEMO_AUTH_LOGIN_REQ) */
    private String messageId;

    /** 거래 추적 번호 — REQ/RES 쌍 연결 키 (requestId 하이픈 제거 후 30자) */
    private String trxTrackingNo;

    /** 사용자 ID */
    private String userId;

    /** 로그 일시 (yyyyMMddHHmmssSSS) */
    private String logDtime;

    /** 최종 로그 일시 */
    private String lastLogDtime;

    /** 최종 결과 코드 */
    private String lastRtCode;

    /** 인스턴스 ID — 처리 주체 식별자 (spider-link: MDW) */
    private String instanceId;

    /** 재처리 여부 */
    private String retryTrxYn;

    /** 전문 데이터 요약 (CLOB, 최대 4000자) */
    private String messageData;

    /** 거래 일시 (yyyyMMddHHmmss) */
    private String trxDtime;

    /** 채널 유형 (TCP) */
    private String channelType;

    /** URI — 거래 ID와 동일 */
    private String uri;

    /** 성공 여부 (Y/N) */
    private String successYn;
}
