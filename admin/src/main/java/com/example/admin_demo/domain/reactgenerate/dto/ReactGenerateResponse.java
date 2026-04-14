package com.example.admin_demo.domain.reactgenerate.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReactGenerateResponse {

    private String id;
    private String figmaUrl;
    private String reactCode;
    private String status;
    private String createdAt;
}
