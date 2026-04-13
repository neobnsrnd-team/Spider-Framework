package com.example.admin_demo.domain.reactgenerate.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReactGenerateRequest {

    @NotBlank(message = "Figma URL을 입력해주세요.")
    private String figmaUrl;
}
