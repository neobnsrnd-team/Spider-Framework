package com.example.spiderlink.domain.meta.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * FWK_SERVICE_RELATION 조회 결과 — 서비스 내 컴포넌트 실행 단계 1건.
 */
@Data
@NoArgsConstructor
public class ServiceStep {

    private String serviceId;
    /** 실행 순서 (오름차순) */
    private int serviceSeqNo;
    private String componentId;
}
