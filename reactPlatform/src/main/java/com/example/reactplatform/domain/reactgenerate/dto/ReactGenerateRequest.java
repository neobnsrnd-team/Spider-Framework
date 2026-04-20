package com.example.reactplatform.domain.reactgenerate.dto;

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

    /** 추가 요구사항. 생략 가능하며 미입력 시 기본 규칙만 적용. */
    private String requirements;
}
