package com.example.admin_demo.domain.reactgenerate.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReactGenerateResponse {

    private String codeId;
    private String figmaUrl;
    private String reactCode;
    private String status;
    private String createDtime;

    /** WARN 레벨 보안 패턴 탐지 목록 — 코드는 통과하되 프론트엔드에 경고로 표시 */
    private List<String> validationWarnings;
}
