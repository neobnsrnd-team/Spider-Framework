package com.example.reactplatform.domain.reactgenerate.validator;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

/**
 * {@link CodeValidator}가 반환하는 코드 검증 결과.
 *
 * <ul>
 *   <li>{@code passed} — ERROR 위반이 없으면 true</li>
 *   <li>{@code errors} — ERROR 레벨 위반 메시지 목록 (코드 반려 사유)</li>
 *   <li>{@code warnings} — WARN 레벨 위반 메시지 목록 (통과하되 응답에 포함)</li>
 * </ul>
 */
@Getter
@Builder
public class CodeValidationResult {

    /** ERROR 레벨 위반이 없으면 true — 코드 반려 여부 결정 */
    private final boolean passed;

    /** ERROR 레벨 위반 목록 — 코드 반려 사유로 사용 */
    private final List<String> errors;

    /** WARN 레벨 위반 목록 — 통과하되 응답에 포함 */
    private final List<String> warnings;
}
