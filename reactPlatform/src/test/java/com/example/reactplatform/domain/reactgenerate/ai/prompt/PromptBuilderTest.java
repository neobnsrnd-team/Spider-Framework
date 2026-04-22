package com.example.reactplatform.domain.reactgenerate.ai.prompt;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.example.reactplatform.domain.reactgenerate.enums.BrandType;
import com.example.reactplatform.domain.reactgenerate.enums.DomainType;
import com.example.reactplatform.domain.reactgenerate.figma.FigmaDesignContext;
import com.example.reactplatform.domain.reactgenerate.figma.FigmaNodeSummary;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

/**
 * @file PromptBuilderTest.java
 * @description PromptBuilder 단위 테스트.
 *     system/user prompt 조합 로직, 섹션 포함·제외 동작,
 *     Element Tree 렌더링, 텍스트 말줄임을 검증한다.
 * @see PromptBuilder
 */
@ExtendWith(MockitoExtension.class)
class PromptBuilderTest {

    @Mock
    private PromptLoader promptLoader;

    @InjectMocks
    private PromptBuilder promptBuilder;

    private static final String FIGMA_URL = "https://www.figma.com/design/ABC123/test?node-id=1-2";

    // ========== buildSystemPrompt ==========

    @Test
    @DisplayName("역할 정의 문구가 system prompt에 포함된다")
    void buildSystemPrompt_includesRoleDefinition() {
        stubAllPrompts();
        String result = promptBuilder.buildSystemPrompt();
        assertThat(result).contains("Figma 디자인을 React 컴포넌트로 변환하는 전문가");
    }

    @Test
    @DisplayName("비어있지 않은 섹션은 구분자·헤더와 함께 포함된다")
    void buildSystemPrompt_includesNonEmptySections() {
        stubAllPrompts();
        String result = promptBuilder.buildSystemPrompt();

        assertThat(result).contains("--- CLAUDE.md");
        assertThat(result).contains("CLAUDE_MD_CONTENT");
        assertThat(result).contains("--- Component Library");
        assertThat(result).contains("COMPONENT_TYPES_CONTENT");
        assertThat(result).contains("--- Design Tokens");
        assertThat(result).contains("DESIGN_TOKENS_CONTENT");
    }

    @Test
    @DisplayName("빈 문자열 섹션은 system prompt에서 제외된다")
    void buildSystemPrompt_skipsBlankSection() {
        when(promptLoader.loadClaudeMd()).thenReturn("CLAUDE_MD_CONTENT");
        when(promptLoader.loadComponentTypes()).thenReturn("COMPONENT_TYPES_CONTENT");
        when(promptLoader.loadDesignTokens()).thenReturn("");

        String result = promptBuilder.buildSystemPrompt();

        assertThat(result).doesNotContain("Design Tokens");
        assertThat(result).doesNotContain("DESIGN_TOKENS_CONTENT");
    }

    @Test
    @DisplayName("null 섹션은 system prompt에서 제외된다")
    void buildSystemPrompt_skipsNullSection() {
        when(promptLoader.loadClaudeMd()).thenReturn(null);
        when(promptLoader.loadComponentTypes()).thenReturn("COMPONENT_TYPES_CONTENT");
        when(promptLoader.loadDesignTokens()).thenReturn("DESIGN_TOKENS_CONTENT");

        String result = promptBuilder.buildSystemPrompt();

        assertThat(result).doesNotContain("CLAUDE.md");
    }

    // ========== buildUserPrompt — 브랜드·도메인 ==========

    @Test
    @DisplayName("user prompt에 brand 토큰 선택 지시가 포함된다")
    void buildUserPrompt_includesBrandToken() {
        String result = promptBuilder.buildUserPrompt(minimalContext(), BrandType.HANA, DomainType.BANKING);
        assertThat(result).contains("[data-brand=\"hana\"]");
    }

    @Test
    @DisplayName("user prompt에 domain 토큰 선택 지시가 포함된다")
    void buildUserPrompt_includesDomainToken() {
        String result = promptBuilder.buildUserPrompt(minimalContext(), BrandType.KB, DomainType.CARD);
        assertThat(result).contains("[data-domain=\"card\"]");
    }

    @Test
    @DisplayName("루트 래퍼에 data-brand·data-domain 속성 지시가 포함된다")
    void buildUserPrompt_includesRootWrapperRule() {
        String result = promptBuilder.buildUserPrompt(minimalContext(), BrandType.SHINHAN, DomainType.GIRO);
        assertThat(result).contains("data-brand=\"shinhan\"");
        assertThat(result).contains("data-domain=\"giro\"");
    }

    // ========== buildUserPrompt — Figma 디자인 컨텍스트 ==========

    @Test
    @DisplayName("컴포넌트 이름·타입·크기가 포함된다")
    void buildUserPrompt_includesComponentNameTypeAndSize() {
        FigmaDesignContext context = FigmaDesignContext.builder()
                .figmaUrl(FIGMA_URL)
                .componentName("LoginCard")
                .componentType("FRAME")
                .width(360)
                .height(240)
                .layoutMode("VERTICAL")
                .children(List.of())
                .build();

        String result = promptBuilder.buildUserPrompt(context, BrandType.HANA, DomainType.BANKING);

        assertThat(result).contains("LoginCard");
        assertThat(result).contains("FRAME");
        assertThat(result).contains("360 × 240 px");
    }

    @Test
    @DisplayName("VERTICAL layoutMode는 'VERTICAL (Flex Column)'으로 표시된다")
    void buildUserPrompt_describesVerticalLayout() {
        FigmaDesignContext context = FigmaDesignContext.builder()
                .figmaUrl(FIGMA_URL)
                .componentName("Container")
                .componentType("FRAME")
                .width(360)
                .height(200)
                .layoutMode("VERTICAL")
                .children(List.of())
                .build();

        assertThat(promptBuilder.buildUserPrompt(context, BrandType.HANA, DomainType.BANKING))
                .contains("VERTICAL (Flex Column)");
    }

    @Test
    @DisplayName("HORIZONTAL layoutMode는 'HORIZONTAL (Flex Row)'으로 표시된다")
    void buildUserPrompt_describesHorizontalLayout() {
        FigmaDesignContext context = FigmaDesignContext.builder()
                .figmaUrl(FIGMA_URL)
                .componentName("Row")
                .componentType("FRAME")
                .width(360)
                .height(50)
                .layoutMode("HORIZONTAL")
                .children(List.of())
                .build();

        assertThat(promptBuilder.buildUserPrompt(context, BrandType.HANA, DomainType.BANKING))
                .contains("HORIZONTAL (Flex Row)");
    }

    // ========== buildUserPrompt — Element Tree ==========

    @Test
    @DisplayName("자식 노드가 있으면 Element Tree 섹션이 포함된다")
    void buildUserPrompt_includesElementTreeWhenChildrenExist() {
        FigmaNodeSummary child = FigmaNodeSummary.builder()
                .name("Button")
                .type("INSTANCE")
                .width(120)
                .height(40)
                .build();
        FigmaDesignContext context = FigmaDesignContext.builder()
                .figmaUrl(FIGMA_URL)
                .componentName("Card")
                .componentType("FRAME")
                .width(360)
                .height(120)
                .children(List.of(child))
                .build();

        String result = promptBuilder.buildUserPrompt(context, BrandType.HANA, DomainType.BANKING);

        assertThat(result).contains("## Element Tree");
        assertThat(result).contains("[INSTANCE] Button");
    }

    @Test
    @DisplayName("자식 노드가 없으면 Element Tree 섹션이 포함되지 않는다")
    void buildUserPrompt_omitsElementTreeWhenNoChildren() {
        FigmaDesignContext context = FigmaDesignContext.builder()
                .figmaUrl(FIGMA_URL)
                .componentName("Empty")
                .componentType("FRAME")
                .width(100)
                .height(100)
                .children(List.of())
                .build();

        assertThat(promptBuilder.buildUserPrompt(context, BrandType.HANA, DomainType.BANKING))
                .doesNotContain("## Element Tree");
    }

    @Test
    @DisplayName("마지막 자식 노드 앞에는 └─, 그 외에는 ├─ 가 붙는다")
    void buildUserPrompt_rendersAsciiTreeConnectors() {
        FigmaNodeSummary first = FigmaNodeSummary.builder().name("First").type("FRAME").width(100).height(50).build();
        FigmaNodeSummary last = FigmaNodeSummary.builder().name("Last").type("TEXT").width(100).height(20).build();
        FigmaDesignContext context = FigmaDesignContext.builder()
                .figmaUrl(FIGMA_URL)
                .componentName("Parent")
                .componentType("FRAME")
                .width(360)
                .height(200)
                .children(List.of(first, last))
                .build();

        String result = promptBuilder.buildUserPrompt(context, BrandType.HANA, DomainType.BANKING);

        assertThat(result).contains("├─");
        assertThat(result).contains("└─");
    }

    // ========== buildUserPrompt — 텍스트 말줄임 ==========

    @Test
    @DisplayName("50자 초과 텍스트는 50자에서 말줄임 처리된다")
    void buildUserPrompt_truncatesTextExceeding50Chars() {
        String longText = "A".repeat(60);
        FigmaNodeSummary textNode = FigmaNodeSummary.builder()
                .name("Label")
                .type("TEXT")
                .text(longText)
                .width(200)
                .height(20)
                .build();
        FigmaDesignContext context = FigmaDesignContext.builder()
                .figmaUrl(FIGMA_URL)
                .componentName("Card")
                .componentType("FRAME")
                .width(360)
                .height(120)
                .children(List.of(textNode))
                .build();

        String result = promptBuilder.buildUserPrompt(context, BrandType.HANA, DomainType.BANKING);

        assertThat(result).contains("A".repeat(50) + "…");
        assertThat(result).doesNotContain("A".repeat(51));
    }

    @Test
    @DisplayName("50자 이하 텍스트는 그대로 출력된다")
    void buildUserPrompt_doesNotTruncateShortText() {
        String shortText = "짧은 텍스트";
        FigmaNodeSummary textNode = FigmaNodeSummary.builder()
                .name("Label")
                .type("TEXT")
                .text(shortText)
                .width(200)
                .height(20)
                .build();
        FigmaDesignContext context = FigmaDesignContext.builder()
                .figmaUrl(FIGMA_URL)
                .componentName("Card")
                .componentType("FRAME")
                .width(360)
                .height(120)
                .children(List.of(textNode))
                .build();

        assertThat(promptBuilder.buildUserPrompt(context, BrandType.HANA, DomainType.BANKING))
                .contains(shortText)
                .doesNotContain("…");
    }

    // ========== buildUserPrompt — 패딩·간격 ==========

    @Test
    @DisplayName("패딩 값이 있는 노드는 padding: 형식으로 표시된다")
    void buildUserPrompt_formatsPadding() {
        FigmaNodeSummary paddedNode = FigmaNodeSummary.builder()
                .name("Container")
                .type("FRAME")
                .width(360)
                .height(120)
                .paddingTop(16)
                .paddingRight(24)
                .paddingBottom(16)
                .paddingLeft(24)
                .build();
        FigmaDesignContext context = contextWithChild(paddedNode);

        assertThat(promptBuilder.buildUserPrompt(context, BrandType.HANA, DomainType.BANKING))
                .contains("padding:16/24/16/24");
    }

    @Test
    @DisplayName("gap 값이 있는 노드는 gap:Npx 형식으로 표시된다")
    void buildUserPrompt_formatsGap() {
        FigmaNodeSummary gappedNode = FigmaNodeSummary.builder()
                .name("Row")
                .type("FRAME")
                .width(360)
                .height(60)
                .gap(8)
                .build();
        FigmaDesignContext context = contextWithChild(gappedNode);

        assertThat(promptBuilder.buildUserPrompt(context, BrandType.HANA, DomainType.BANKING))
                .contains("gap:8px");
    }

    @Test
    @DisplayName("패딩과 gap이 모두 있으면 쉼표로 구분하여 표시된다")
    void buildUserPrompt_formatsPaddingAndGapTogether() {
        FigmaNodeSummary node = FigmaNodeSummary.builder()
                .name("Box")
                .type("FRAME")
                .width(360)
                .height(120)
                .paddingTop(16)
                .paddingRight(16)
                .paddingBottom(16)
                .paddingLeft(16)
                .gap(8)
                .build();
        FigmaDesignContext context = contextWithChild(node);

        String result = promptBuilder.buildUserPrompt(context, BrandType.HANA, DomainType.BANKING);
        assertThat(result).contains("padding:16/16/16/16");
        assertThat(result).contains("gap:8px");
    }

    // ========== helpers ==========

    /** buildSystemPrompt 테스트에서 공통으로 사용하는 프롬프트 파일 스텁 */
    private void stubAllPrompts() {
        when(promptLoader.loadClaudeMd()).thenReturn("CLAUDE_MD_CONTENT");
        when(promptLoader.loadComponentTypes()).thenReturn("COMPONENT_TYPES_CONTENT");
        when(promptLoader.loadDesignTokens()).thenReturn("DESIGN_TOKENS_CONTENT");
    }

    /** 최소 필드만 채운 FigmaDesignContext 생성 헬퍼 */
    private FigmaDesignContext minimalContext() {
        return FigmaDesignContext.builder()
                .figmaUrl(FIGMA_URL)
                .componentName("TestComponent")
                .componentType("FRAME")
                .width(100)
                .height(100)
                .children(List.of())
                .build();
    }

    /** 단일 자식 노드를 가진 FigmaDesignContext 생성 헬퍼 */
    private FigmaDesignContext contextWithChild(FigmaNodeSummary child) {
        return FigmaDesignContext.builder()
                .figmaUrl(FIGMA_URL)
                .componentName("Parent")
                .componentType("FRAME")
                .width(400)
                .height(300)
                .children(List.of(child))
                .build();
    }
}
