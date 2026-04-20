package com.example.reactplatform.domain.reactgenerate.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReactGenerateApprovalResponse {

    private String codeId;
    private String status;
    private String approvalUserId;
    private String approvalDtime;
}
