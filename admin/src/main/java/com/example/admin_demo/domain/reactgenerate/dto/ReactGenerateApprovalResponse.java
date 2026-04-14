package com.example.admin_demo.domain.reactgenerate.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReactGenerateApprovalResponse {

    private String id;
    private String status;
    private String approvedBy;
    private String approvedAt;
}
