package com.example.spiderbatch.domain.batch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 배치 실행 결과 응답 DTO.
 *
 * <p>배치 Job 실행 완료 후 Admin에 반환하는 결과.</p>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchExecuteResponse {

    /** 배치 APP ID */
    private String batchAppId;

    /** 실행 회차 */
    private int batchExecuteSeq;

    /** 결과 코드 (1: SUCCESS, 9: ABNORMAL_TERMINATION) */
    private String resRtCode;

    /** 종료 일시 (yyyyMMddHHmmssSSS) */
    private String batchEndDtime;

    /** 오류 사유 (정상 종료 시 null) */
    private String errorReason;

    /** 처리 건수 */
    private long executeCount;
}
