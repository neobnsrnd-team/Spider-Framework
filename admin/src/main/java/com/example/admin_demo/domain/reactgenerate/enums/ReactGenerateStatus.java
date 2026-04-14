package com.example.admin_demo.domain.reactgenerate.enums;

public enum ReactGenerateStatus {
    GENERATED, // 코드 생성 완료, 아직 승인 요청 전
    PENDING_APPROVAL, // 승인 요청됨, 관리자 검토 대기
    APPROVED, // 승인 완료
    REJECTED // 반려
}
