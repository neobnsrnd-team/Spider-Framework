package com.example.reactplatform.domain.reactgenerate.enums;

public enum ReactGenerateStatus {
    GENERATED, // 코드 생성 완료, 아직 승인 요청 전
    FAILED, // 코드 생성 실패 (Figma API 오류, Claude API 오류, 보안 검증 실패 등)
    PENDING_APPROVAL, // 승인 요청됨, 관리자 검토 대기
    APPROVED, // 승인 완료
    REJECTED // 반려
}
