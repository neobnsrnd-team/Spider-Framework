package com.example.reactplatform.domain.reactgenerate.enums;

/**
 * @file DomainType.java
 * @description React 코드 생성 시 적용할 금융 도메인 Enum.
 *     globals.css의 [data-domain="..."] 블록과 1:1 대응한다.
 *     미입력 시 서비스 레이어에서 BANKING을 기본값으로 적용한다.
 */
public enum DomainType {
    BANKING,
    CARD,
    GIRO,
    INSURANCE
}
