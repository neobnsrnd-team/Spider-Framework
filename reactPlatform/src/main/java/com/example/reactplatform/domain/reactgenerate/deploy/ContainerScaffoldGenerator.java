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

    /** TSX 코드에서 default export 함수명을 추출하는 패턴 */
    private static final Pattern COMPONENT_NAME_PATTERN =
            Pattern.compile("export default function (\\w+)");

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
     * TSX 코드에서 {@code export default function ComponentName} 패턴으로 컴포넌트명을 추출한다.
     * 패턴이 없으면 fallback 이름을 반환한다.
     *
     * <p>deploy 전략에서 UI 컴포넌트 파일명({@code {ComponentName}.tsx})을 결정할 때도 사용된다.
     */
    public String extractComponentName(String reactCode) {
        if (reactCode == null || reactCode.isBlank()) {
            return FALLBACK_COMPONENT_NAME;
        }
        Matcher matcher = COMPONENT_NAME_PATTERN.matcher(reactCode);
        return matcher.find() ? matcher.group(1) : FALLBACK_COMPONENT_NAME;
    }
}
