package com.example.spiderlink.domain.meta.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * FWK_COMPONENT 조회 결과 — 실행할 컴포넌트 메타데이터.
 *
 * <p>componentClassName = MyBatis mapper namespace,
 * componentMethodName = SQL ID 로 사용한다.</p>
 */
@Data
@NoArgsConstructor
public class ComponentInfo {

    private String componentId;
    /** MyBatis mapper 인터페이스 fully-qualified name (namespace) */
    private String componentClassName;
    /** 실행할 SQL ID */
    private String componentMethodName;
    /** S=SELECT, U=UPDATE/INSERT/DELETE */
    private String componentType;
}
