package com.example.admin_demo.domain.reactgenerate.ai.prompt;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Claude API에 전달할 system prompt와 user prompt를 조립하는 컴포넌트.
 *
 * <p>PromptLoader에서 읽은 각 마크다운 섹션을 구분자(---)와 헤더로 연결하여
 * Claude가 컨텍스트를 명확히 구분할 수 있는 단일 문자열로 반환한다.
 *
 * <p>섹션 조립 순서: 역할 정의 → CLAUDE.md → component-types → design-tokens → component-map
 */
@Component
@RequiredArgsConstructor
public class PromptBuilder {

    private final PromptLoader promptLoader;

    /**
     * Claude API의 system 필드에 전달할 프롬프트를 생성한다.
     *
     * <p>비어있는 섹션은 건너뛰므로, prompts/ 파일 일부가 없어도 동작한다.
     *
     * @return 섹션이 조합된 system prompt 문자열
     */
    public String buildSystemPrompt() {
        StringBuilder sb = new StringBuilder();

        sb.append("당신은 Figma 디자인을 React 컴포넌트로 변환하는 전문가입니다.\n");
        sb.append("반드시 아래에 제공된 컴포넌트 라이브러리만 사용하여 코드를 생성하세요.\n");
        sb.append("목록에 없는 컴포넌트를 임의로 만들거나 외부 라이브러리를 추가하지 마세요.\n");

        appendSection(sb, "CLAUDE.md (컴포넌트 라이브러리 가이드)", promptLoader.loadClaudeMd());
        appendSection(sb, "Component Library (사용 가능한 컴포넌트 인터페이스)", promptLoader.loadComponentTypes());
        appendSection(sb, "Design Tokens (CSS 변수 레퍼런스 — 하드코딩 금지)", promptLoader.loadDesignTokens());
        appendSection(sb, "Component Map (Figma → React 매핑 전략)", promptLoader.loadComponentMap());

        return sb.toString();
    }

    /**
     * Claude API의 messages[0].content 필드에 전달할 user prompt를 생성한다.
     *
     * @param figmaUrl     생성 기준이 되는 Figma 화면 URL
     * @param requirements 추가 요구사항 (빈 문자열 허용)
     * @return user prompt 문자열
     */
    public String buildUserPrompt(String figmaUrl, String requirements) {
        StringBuilder sb = new StringBuilder();

        sb.append("Generate a React component from the following Figma design.\n\n");
        sb.append("Figma URL: ").append(figmaUrl).append("\n\n");

        if (requirements != null && !requirements.isBlank()) {
            sb.append("Requirements:\n").append(requirements).append("\n\n");
        }

        sb.append("Rules:\n");
        sb.append("- 반드시 위 컴포넌트 라이브러리의 컴포넌트만 사용할 것\n");
        sb.append("- 디자인 토큰(CSS 변수)을 활용하고 하드코딩 금지\n");
        sb.append("- TypeScript로 작성하고 props interface를 포함할 것\n");
        sb.append("- 접근성(aria 속성)을 고려할 것\n");
        sb.append("- 응답은 ```tsx ... ``` 코드 블록 하나로만 작성할 것\n");

        return sb.toString();
    }

    /**
     * 섹션 내용이 있을 때만 헤더와 구분자를 붙여 StringBuilder에 추가한다.
     * 빈 섹션은 system prompt에 불필요한 헤더가 노출되지 않도록 건너뜀.
     */
    private void appendSection(StringBuilder sb, String header, String content) {
        if (content == null || content.isBlank()) return;
        sb.append("\n\n--- ").append(header).append(" ---\n\n");
        sb.append(content);
    }
}
