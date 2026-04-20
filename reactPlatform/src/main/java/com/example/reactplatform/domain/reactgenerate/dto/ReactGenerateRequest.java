package com.example.reactplatform.domain.reactgenerate.dto;

import com.example.reactplatform.domain.reactgenerate.enums.BrandType;
import com.example.reactplatform.domain.reactgenerate.enums.DomainType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @file ReactGenerateRequest.java
 * @description React 코드 생성 API 요청 DTO.
 *     Figma URL과 브랜드·도메인 Enum으로 구성되며, 자유 텍스트 입력은 허용하지 않는다.
 *     brand·domain은 Claude가 globals.css의 올바른 디자인 토큰 블록을 선택하는 데 사용된다.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReactGenerateRequest {

    /** 유효한 Figma design/file URL. node-id 쿼리 파라미터를 포함해야 한다. */
    @NotBlank(message = "Figma URL을 입력해주세요.")
    @Pattern(
            regexp = "https://www\\.figma\\.com/(design|file)/[A-Za-z0-9]+/.+[?&]node-id=[^&]+.*",
            message = "유효하지 않은 Figma URL 형식입니다. (예: https://www.figma.com/design/...?node-id=1-2)")
    private String figmaUrl;

    /** 적용할 금융 브랜드. globals.css의 [data-brand] 토큰 블록 선택에 사용된다. */
    @NotNull(message = "brand를 선택해주세요.")
    private BrandType brand;

    /**
     * 적용할 금융 도메인. 미입력 시 서비스 레이어에서 BANKING을 기본값으로 적용한다.
     * globals.css의 [data-domain] 토큰 블록 선택에 사용된다.
     */
    private DomainType domain;
}
