package com.example.spiderlink.domain.meta.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * FWK_RELATION_PARAM + FWK_COMPONENT_PARAM 조인 결과 — SQL 파라미터 바인딩 정보 1건.
 *
 * <p>paramKey   = SQL에서 #{} 안에 사용하는 파라미터 이름 (FWK_COMPONENT_PARAM.PARAM_KEY)</p>
 * <p>paramValue = 요청 payload에서 꺼낼 키 이름 (FWK_RELATION_PARAM.PARAM_VALUE)</p>
 */
@Data
@NoArgsConstructor
public class RelationParam {

    private String paramKey;
    private String paramValue;
}
