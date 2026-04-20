package com.example.reactplatform.domain.reactgenerate.validator;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;

/**
 * Claude가 생성한 React 코드를 Java 정규표현식으로 보안 패턴 탐지하는 검증 컴포넌트.
 *
 * <p>Node.js/ESLint 없이 서버 사이드에서만 동작하며, 외부 의존성이 없다.
 * 탐지 룰은 {@link CodeValidationRule}에서 관리한다.
 *
 * <p>AST 분석이 아니므로 주석 내 패턴도 탐지될 수 있다.
 * 오탐률보다 미탐률을 낮추는 방향으로 운용한다.
 */
@Component
public class CodeValidator {

    /**
     * 생성된 React 코드에 대해 보안 위협 패턴을 검증한다.
     *
     * <p>모든 {@link CodeValidationRule}을 순회하며 패턴을 탐지한다.
     * ERROR 룰 위반이 1개라도 있으면 {@code passed = false}로 반환된다.
     *
     * @param code Claude가 생성한 React 코드
     * @return 검증 결과 (통과 여부, 오류 목록, 경고 목록)
     */
    public CodeValidationResult validate(String code) {
        List<String> errors = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        for (CodeValidationRule rule : CodeValidationRule.values()) {
            if (rule.getPattern().matcher(code).find()) {
                if (rule.getSeverity() == CodeValidationRule.Severity.ERROR) {
                    errors.add(rule.getMessage());
                } else {
                    warnings.add(rule.getMessage());
                }
            }
        }

        return CodeValidationResult.builder()
                .passed(errors.isEmpty())
                .errors(errors)
                .warnings(warnings)
                .build();
    }
}
