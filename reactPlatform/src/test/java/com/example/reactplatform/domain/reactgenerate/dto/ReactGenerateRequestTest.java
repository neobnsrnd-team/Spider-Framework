package com.example.reactplatform.domain.reactgenerate.dto;

import com.example.reactplatform.domain.reactgenerate.enums.BrandType;
import com.example.reactplatform.domain.reactgenerate.enums.DomainType;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.Set;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * @file ReactGenerateRequestTest.java
 * @description ReactGenerateRequest DTO 입력 검증 단위 테스트.
 *     figmaUrl 패턴 검증, brand 필수 검증, domain 선택 검증을 확인한다.
 */
class ReactGenerateRequestTest {

    private static Validator validator;

    @BeforeAll
    static void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    @DisplayName("유효한 요청은 검증을 통과한다")
    void validRequest_passes() {
        ReactGenerateRequest request = ReactGenerateRequest.builder()
                .figmaUrl("https://www.figma.com/design/AbcDef123/MyDesign?node-id=1-2")
                .brand(BrandType.HANA)
                .domain(DomainType.CARD)
                .build();

        Set<ConstraintViolation<ReactGenerateRequest>> violations = validator.validate(request);
        assertThat(violations).isEmpty();
    }

    @Test
    @DisplayName("domain 미입력 시 검증을 통과한다 (서비스에서 BANKING 기본값 적용)")
    void nullDomain_passes() {
        ReactGenerateRequest request = ReactGenerateRequest.builder()
                .figmaUrl("https://www.figma.com/design/AbcDef123/MyDesign?node-id=1-2")
                .brand(BrandType.KB)
                .domain(null)
                .build();

        Set<ConstraintViolation<ReactGenerateRequest>> violations = validator.validate(request);
        assertThat(violations).isEmpty();
    }

    @Test
    @DisplayName("figmaUrl이 비어있으면 검증 실패")
    void blankFigmaUrl_fails() {
        ReactGenerateRequest request = ReactGenerateRequest.builder()
                .figmaUrl("")
                .brand(BrandType.HANA)
                .build();

        Set<ConstraintViolation<ReactGenerateRequest>> violations = validator.validate(request);
        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("figmaUrl"));
    }

    @Test
    @DisplayName("figmaUrl이 허용 패턴에 맞지 않으면 검증 실패")
    void invalidFigmaUrlPattern_fails() {
        ReactGenerateRequest request = ReactGenerateRequest.builder()
                .figmaUrl("https://www.figma.com/proto/AbcDef123/MyDesign?node-id=1-2")
                .brand(BrandType.HANA)
                .build();

        Set<ConstraintViolation<ReactGenerateRequest>> violations = validator.validate(request);
        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("figmaUrl"));
    }

    @Test
    @DisplayName("figmaUrl이 Figma 도메인이 아니면 검증 실패")
    void nonFigmaUrl_fails() {
        ReactGenerateRequest request = ReactGenerateRequest.builder()
                .figmaUrl("https://www.example.com/design/AbcDef123/MyDesign")
                .brand(BrandType.HANA)
                .build();

        Set<ConstraintViolation<ReactGenerateRequest>> violations = validator.validate(request);
        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("figmaUrl"));
    }

    @Test
    @DisplayName("brand가 null이면 검증 실패")
    void nullBrand_fails() {
        ReactGenerateRequest request = ReactGenerateRequest.builder()
                .figmaUrl("https://www.figma.com/design/AbcDef123/MyDesign?node-id=1-2")
                .brand(null)
                .build();

        Set<ConstraintViolation<ReactGenerateRequest>> violations = validator.validate(request);
        assertThat(violations).isNotEmpty();
        assertThat(violations).anyMatch(v -> v.getPropertyPath().toString().equals("brand"));
    }
}
