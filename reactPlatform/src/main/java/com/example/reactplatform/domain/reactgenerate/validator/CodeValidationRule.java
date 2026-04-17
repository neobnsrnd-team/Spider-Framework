package com.example.reactplatform.domain.reactgenerate.validator;

import java.util.regex.Pattern;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Claude가 생성한 React 코드에서 탐지할 보안 위협 패턴과 심각도를 한 곳에서 관리한다.
 *
 * <p>AST 분석이 아닌 정규표현식 기반이므로 주석 내 패턴도 탐지될 수 있다.
 * 오탐률보다 미탐률을 낮추는 방향으로 운용한다.
 *
 * <ul>
 *   <li>ERROR: 탐지 시 코드 반려 (생성 실패로 처리)</li>
 *   <li>WARN: 탐지 시 통과하되 응답에 경고 메시지 포함</li>
 * </ul>
 */
@Getter
@RequiredArgsConstructor
public enum CodeValidationRule {
    EVAL_USAGE(
            // \beval\( — eval 함수 호출 탐지 (변수명 일부로 사용하는 경우 제외)
            Pattern.compile("\\beval\\s*\\("), Severity.ERROR, "eval() 사용 금지: 임의 코드 실행 위험"),

    LOCAL_STORAGE(Pattern.compile("\\blocalStorage\\b"), Severity.ERROR, "localStorage 직접 접근 금지: 민감 정보 노출 위험"),

    SESSION_STORAGE(Pattern.compile("\\bsessionStorage\\b"), Severity.ERROR, "sessionStorage 직접 접근 금지: 민감 정보 노출 위험"),

    FETCH_EXTERNAL(
            // 허용 도메인(api.figma.com, api.anthropic.com) 외 외부 도메인으로의 fetch 탐지.
            // 1) 인용부호: 작은따옴표·큰따옴표·백틱(템플릿 리터럴) 모두 지원
            // 2) 도메인 섀도잉 방지: 허용 도메인 뒤에 반드시 경로 구분자(/:'"` 또는 공백)가 와야 통과.
            //    예) https://api.figma.com.attacker.com → '.' 뒤에 attacker가 오므로 탐지됨
            Pattern.compile("fetch\\s*\\(\\s*['\"`]https?://(?!(api\\.figma\\.com|api\\.anthropic\\.com)[:/'\"`\\s])"),
            Severity.ERROR,
            "알 수 없는 외부 도메인으로의 fetch 금지"),

    INNER_HTML(
            // .innerHTML = 패턴 — 우변에 값을 대입하는 경우만 탐지
            Pattern.compile("\\.innerHTML\\s*="),
            Severity.WARN,
            "innerHTML 직접 할당: XSS 위험 — dangerouslySetInnerHTML 또는 textContent 사용 권장"),

    DOCUMENT_WRITE(Pattern.compile("\\bdocument\\.write\\s*\\("), Severity.WARN, "document.write() 사용 지양");

    /** 탐지 심각도 */
    public enum Severity {
        /** 코드 반려 — 생성 실패로 처리 */
        ERROR,
        /** 경고만 기록 — 코드는 통과 */
        WARN
    }

    private final Pattern pattern;
    private final Severity severity;
    private final String message;
}
