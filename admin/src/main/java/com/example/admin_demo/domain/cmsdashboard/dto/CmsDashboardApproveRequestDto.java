package com.example.admin_demo.domain.cmsdashboard.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * CMS 페이지 승인 요청 DTO — APPROVE_STATE: WORK / REJECTED / APPROVED → PENDING
 */
@Getter
@Setter
@NoArgsConstructor
public class CmsDashboardApproveRequestDto {

    /** 승인자 ID (APPROVER_ID) */
    private String approverId;

    /** 승인자명 (APPROVER_NAME) */
    private String approverName;

    /** 노출 시작일 (YYYY-MM-DD, 선택) */
    private String beginningDate;

    /** 노출 종료일 (YYYY-MM-DD, 선택) */
    private String expiredDate;
}
