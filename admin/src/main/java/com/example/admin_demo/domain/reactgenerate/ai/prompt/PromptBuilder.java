package com.example.admin_demo.domain.reactgenerate.ai.prompt;

import com.example.admin_demo.domain.reactgenerate.figma.FigmaDesignContext;
import com.example.admin_demo.domain.reactgenerate.figma.FigmaNodeSummary;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * Claude API에 전달할 system prompt와 user prompt를 조립하는 컴포넌트.
 *
 * <p>PromptLoader에서 읽은 각 마크다운 섹션을 구분자(---)와 헤더로 연결하여
 * Claude가 컨텍스트를 명확히 구분할 수 있는 단일 문자열로 반환한다.
 *
 * <p>섹션 조립 순서: 역할 정의 → CLAUDE.md → component-types → design-tokens → component-map
 *
 * <p>user prompt에는 Figma URL 텍스트 대신 {@link FigmaDesignContext}에서 추출한
 * 구조화된 레이아웃·색상·텍스트 정보를 포함한다.
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
     * <p>Figma URL 텍스트 대신 {@link FigmaDesignContext}의 구조화된 정보(크기, 레이아웃,
     * 색상, 텍스트)를 ASCII 트리 형태로 포함하여 Claude의 코드 생성 정확도를 높인다.
     *
     * @param context      Figma API에서 추출한 디자인 컨텍스트
     * @param requirements 추가 요구사항 (빈 문자열 허용)
     * @return user prompt 문자열
     */
    public String buildUserPrompt(FigmaDesignContext context, String requirements) {
        StringBuilder sb = new StringBuilder();

        sb.append("Generate a React component from the following Figma design.\n\n");

        // Figma 디자인 컨텍스트 섹션
        sb.append("## Figma Design Context\n");
        sb.append("Component: ")
                .append(context.getComponentName())
                .append(" (")
                .append(context.getComponentType())
                .append(")\n");
        sb.append("Canvas Size: ")
                .append(context.getWidth())
                .append(" × ")
                .append(context.getHeight())
                .append(" px\n");
        sb.append("Layout: ")
                .append(describeLayoutMode(context.getLayoutMode()))
                .append("\n");
        sb.append("Figma URL: ").append(context.getFigmaUrl()).append("\n");

        // 하위 노드 트리 섹션
        if (context.getChildren() != null && !context.getChildren().isEmpty()) {
            sb.append("\n## Element Tree\n");
            sb.append(formatNodeLine(
                            context.getComponentName(),
                            context.getComponentType(),
                            context.getWidth(),
                            context.getHeight(),
                            context.getLayoutMode(),
                            null,
                            null,
                            null))
                    .append("\n");
            formatNodes(sb, context.getChildren(), "");
        }

        // 추가 요구사항 섹션
        if (requirements != null && !requirements.isBlank()) {
            sb.append("\n## Additional Requirements\n").append(requirements).append("\n");
        }

        sb.append("\n## Rules\n");
        sb.append("- 반드시 위 컴포넌트 라이브러리의 컴포넌트만 사용할 것\n");
        sb.append("- 디자인 토큰(CSS 변수)을 활용하고 색상·크기 하드코딩 금지\n");
        sb.append("- TypeScript로 작성하고 props interface를 포함할 것\n");
        sb.append("- 접근성(aria 속성)을 고려할 것\n");
        sb.append("- 반드시 `export default function ComponentName()` 형식으로 컴포넌트를 내보낼 것\n");
        sb.append("- 응답은 ```tsx ... ``` 코드 블록 하나로만 작성할 것\n");

        return sb.toString();
    }

    /**
     * 하위 노드 목록을 ASCII 트리 형태로 재귀 출력한다.
     *
     * @param sb      결과를 추가할 StringBuilder
     * @param nodes   출력할 노드 목록
     * @param indent  현재 들여쓰기 문자열 (│ 또는 공백)
     */
    private void formatNodes(StringBuilder sb, List<FigmaNodeSummary> nodes, String indent) {
        if (nodes == null || nodes.isEmpty()) return;

        for (int i = 0; i < nodes.size(); i++) {
            boolean last = i == nodes.size() - 1;
            FigmaNodeSummary node = nodes.get(i);

            // 마지막 노드는 └─, 그 외는 ├─ 사용
            String connector = last ? "└─ " : "├─ ";
            // 자식 들여쓰기: 마지막이면 공백, 아니면 │로 연결
            String childIndent = indent + (last ? "   " : "│  ");

            sb.append(indent)
                    .append(connector)
                    .append(formatNodeLine(
                            node.getName(),
                            node.getType(),
                            node.getWidth(),
                            node.getHeight(),
                            node.getLayoutMode(),
                            node.getFillColor(),
                            node.getText(),
                            hasPadding(node) ? formatPadding(node) : null))
                    .append("\n");

            formatNodes(sb, node.getChildren(), childIndent);
        }
    }

    /**
     * 단일 노드를 한 줄 문자열로 표현한다.
     *
     * <p>출력 예시: {@code [FRAME] Card (360×120px, VERTICAL, gap:8px, padding:16/16/16/16) | fill: #FFFFFF}
     */
    private String formatNodeLine(
            String name,
            String type,
            int width,
            int height,
            String layoutMode,
            String fillColor,
            String text,
            String padding) {
        StringBuilder line = new StringBuilder();
        line.append("[").append(type).append("] ").append(name);

        // 크기 정보
        if (width > 0 || height > 0) {
            line.append(" (").append(width).append("×").append(height).append("px");

            // Auto Layout 정보
            if (layoutMode != null && !"NONE".equals(layoutMode)) {
                line.append(", ").append(layoutMode);
            }

            // 패딩·간격 정보 (있는 경우만)
            if (padding != null) {
                line.append(", ").append(padding);
            }

            line.append(")");
        }

        // 채우기 색상
        if (fillColor != null) {
            line.append(" | fill: ").append(fillColor);
        }

        // 텍스트 내용 (50자 초과 시 말줄임)
        if (text != null && !text.isBlank()) {
            String truncated = text.length() > 50 ? text.substring(0, 50) + "…" : text;
            line.append(" | text: \"").append(truncated).append("\"");
        }

        return line.toString();
    }

    /** 노드에 패딩 값이 하나라도 있는지 확인한다. */
    private boolean hasPadding(FigmaNodeSummary node) {
        return node.getPaddingTop() > 0
                || node.getPaddingRight() > 0
                || node.getPaddingBottom() > 0
                || node.getPaddingLeft() > 0
                || node.getGap() > 0;
    }

    /** 패딩·간격 정보를 {@code padding:top/right/bottom/left, gap:Npx} 형식으로 반환한다. */
    private String formatPadding(FigmaNodeSummary node) {
        StringBuilder sb = new StringBuilder();
        if (node.getPaddingTop() > 0
                || node.getPaddingRight() > 0
                || node.getPaddingBottom() > 0
                || node.getPaddingLeft() > 0) {
            sb.append("padding:")
                    .append(node.getPaddingTop())
                    .append("/")
                    .append(node.getPaddingRight())
                    .append("/")
                    .append(node.getPaddingBottom())
                    .append("/")
                    .append(node.getPaddingLeft());
        }
        if (node.getGap() > 0) {
            if (sb.length() > 0) sb.append(", ");
            sb.append("gap:").append(node.getGap()).append("px");
        }
        return sb.toString();
    }

    /**
     * Figma layoutMode 값을 사람이 읽기 쉬운 설명으로 변환한다.
     *
     * @param layoutMode Figma API의 layoutMode 값 (NONE, HORIZONTAL, VERTICAL 또는 null)
     * @return 설명 문자열
     */
    private String describeLayoutMode(String layoutMode) {
        if (layoutMode == null || "NONE".equals(layoutMode)) return "NONE (고정 레이아웃)";
        if ("HORIZONTAL".equals(layoutMode)) return "HORIZONTAL (Flex Row)";
        if ("VERTICAL".equals(layoutMode)) return "VERTICAL (Flex Column)";
        return layoutMode;
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
