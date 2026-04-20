package com.example.batchwas.constant;

import java.time.format.DateTimeFormatter;

/**
 * 배치 공통 상수.
 *
 * <p>상태 코드는 Admin의 BatchResRtCode enum과 동일한 값을 사용한다.</p>
 */
public final class BatchConstants {

    private BatchConstants() {}

    /** 배치 시작 상태 코드 */
    public static final String RES_RT_STARTED = "0";

    /** 배치 정상 종료 상태 코드 */
    public static final String RES_RT_SUCCESS = "1";

    /** 배치 비정상 종료 상태 코드 */
    public static final String RES_RT_ABNORMAL = "9";

    /** FWK_BATCH_HIS LOG_DTIME 포맷 (yyyyMMddHHmmssSSS) */
    public static final DateTimeFormatter LOG_DATE_TIME_FORMATTER =
            DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");

    /** FWK_BATCH_HIS BATCH_END_DTIME 포맷 (yyyyMMddHHmmssSSS) */
    public static final DateTimeFormatter END_DATE_TIME_FORMATTER =
            DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");

    /** 시스템 실행자 ID (스케줄 자동 실행 시 사용) */
    public static final String SYSTEM_USER_ID = "SYSTEM";
}
