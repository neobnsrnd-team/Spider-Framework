/**
 * @file ContainerScaffoldGenerator.java
 * @description AI가 생성한 React TSX 코드에서 컴포넌트명을 추출하여
 *     비즈니스 로직 주입용 Container scaffold 코드를 생성한다.
 *
 * <p>생성된 컴포넌트는 모든 동작을 props로 받는 순수 UI 구조이므로,
 * Container는 상태·API 호출·이벤트 핸들러를 구현하고 해당 props에 연결하는 역할을 한다.
 *
 * @example
 * 입력 TSX에 {@code export default function LoginPage} 가 있으면
 * {@code LoginPageContainer.tsx} scaffold를 생성한다.
 */
package com.example.reactplatform.domain.reactgenerate.deploy;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

@Component
public class ContainerScaffoldGenerator {

    /**
     * 패턴 1: {@code export default function ComponentName}
     * AI가 생성하는 가장 일반적인 형태.
     */
    private static final Pattern PATTERN_DEFAULT_FUNCTION =
            Pattern.compile("export\\s+default\\s+function\\s+(\\w+)");

    /**
     * 패턴 2: {@code export default ComponentName;} (named → default export 패턴)
     * 화살표 함수 또는 별도 선언 후 마지막에 default export하는 형태.
     * 오탐 방지를 위해 식별자 뒤에 세미콜론 또는 줄 끝이 오는 경우만 매칭한다.
     */
    private static final Pattern PATTERN_NAMED_DEFAULT_EXPORT =
            Pattern.compile("export\\s+default\\s+(\\w+)\\s*;?\\s*$", Pattern.MULTILINE);

    /** 컴포넌트명 추출 실패 시 사용하는 fallback 이름 */
    private static final String FALLBACK_COMPONENT_NAME = "GeneratedComponent";

    /**
     * TSX 코드를 받아 Container scaffold 코드를 생성한다.
     *
     * <p>UI 컴포넌트 파일명은 추출된 컴포넌트명을 사용한다 ({@code {ComponentName}.tsx}).
     *
     * @param reactCode    AI가 생성한 TSX 코드 (컴포넌트명 추출에 사용)
     * @param importPrefix UI 컴포넌트의 import 기준 경로 (예: {@code ../generated} 또는 {@code ./generated})
     * @return Container scaffold TSX 코드 문자열
     */
    public String generate(String reactCode, String importPrefix) {
        String componentName = extractComponentName(reactCode);
        String containerName = componentName + "Container";

        return String.format(
                """
                /**
                 * @file %s.tsx
                 * @description %s의 비즈니스 로직 컨테이너.
                 *   UI 컴포넌트(%s/%s.tsx)에 상태·API 호출·이벤트 핸들러를 주입한다.
                 * @returns {JSX.Element}
                 */
                import %s from '%s/%s';

                export default function %s() {
                  // TODO: 상태 관리 (useState, useReducer 등)

                  // TODO: API 호출 (useEffect, react-query 등)

                  // TODO: 이벤트 핸들러 구현

                  return (
                    <%s
                      // TODO: props 연결
                    />
                  );
                }
                """,
                containerName,
                componentName,
                importPrefix,
                componentName,
                componentName,
                importPrefix,
                componentName,
                containerName,
                componentName);
    }

    /**
     * Container scaffold 파일명을 반환한다.
     *
     * @param reactCode 컴포넌트명 추출에 사용할 TSX 코드
     * @return 예: {@code LoginPageContainer.tsx}
     */
    public String resolveFileName(String reactCode) {
        return extractComponentName(reactCode) + "Container.tsx";
    }

    /**
     * TSX 코드에서 컴포넌트명을 추출한다.
     * 다음 순서로 패턴을 시도하며, 모두 실패하면 fallback 이름을 반환한다.
     * <ol>
     *   <li>{@code export default function ComponentName}</li>
     *   <li>{@code export default ComponentName;} (화살표 함수·named export 패턴)</li>
     * </ol>
     *
     * <p>deploy 전략에서 UI 컴포넌트 파일명({@code {ComponentName}.tsx})을 결정할 때도 사용된다.
     */
    public String extractComponentName(String reactCode) {
        if (reactCode == null || reactCode.isBlank()) {
            return FALLBACK_COMPONENT_NAME;
        }
        Matcher m1 = PATTERN_DEFAULT_FUNCTION.matcher(reactCode);
        if (m1.find()) return m1.group(1);

        Matcher m2 = PATTERN_NAMED_DEFAULT_EXPORT.matcher(reactCode);
        if (m2.find()) return m2.group(1);

        return FALLBACK_COMPONENT_NAME;
    }
}
