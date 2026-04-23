package com.example.reactplatform.domain.reactgenerate.figma;

import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Figma 노드에서 Claude 프롬프트 생성에 필요한 정보만 추출한 요약 클래스.
 *
 * <p>{@link FigmaDesignExtractor}가 원시 {@link FigmaNode}를 이 클래스로 변환한다.
 * 깊이 제한({@code MAX_DEPTH}) 이하의 노드만 포함하며,
 * 채우기 색상은 HEX/rgba 문자열로, 그라디언트는 정지점 색상 목록으로 변환하여 담는다.
 */
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FigmaNodeSummary {

    // ── 식별 ──────────────────────────────────────────────

    /** Figma 레이어 이름 */
    private String name;

    /** 노드 타입 (FRAME, TEXT, RECTANGLE, INSTANCE 등) */
    private String type;

    // ── 크기 ──────────────────────────────────────────────

    /** 노드 너비 (px) */
    private int width;

    /** 노드 높이 (px) */
    private int height;

    // ── Auto Layout ────────────────────────────────────────

    /** Auto Layout 방향: NONE, HORIZONTAL, VERTICAL. null이면 고정 레이아웃 */
    private String layoutMode;

    /** 주축 정렬: MIN(flex-start), CENTER, MAX(flex-end), SPACE_BETWEEN */
    private String mainAxisAlign;

    /** 교차축 정렬: MIN(flex-start), CENTER, MAX(flex-end) */
    private String crossAxisAlign;

    /** 주축 크기 결정 방식: FIXED, HUG(내용 맞춤), FILL(부모 채우기) */
    private String sizingH;

    /** 교차축 크기 결정 방식: FIXED, HUG(내용 맞춤), FILL(부모 채우기) */
    private String sizingV;

    /** 위쪽 패딩 (px) */
    private int paddingTop;

    /** 오른쪽 패딩 (px) */
    private int paddingRight;

    /** 아래쪽 패딩 (px) */
    private int paddingBottom;

    /** 왼쪽 패딩 (px) */
    private int paddingLeft;

    /** 자식 요소 간격 (gap, px) */
    private int gap;

    // ── 시각 스타일 ────────────────────────────────────────

    /** SOLID 채우기의 HEX(#RRGGBB) 또는 rgba(r,g,b,a) 문자열. 없으면 null */
    private String fillColor;

    /** 그라디언트 채우기 설명. 예: "GRADIENT_LINEAR: #0D9488 → #115E59". 없으면 null */
    private String gradientFill;

    /** 모서리 반경 (px). 0이면 직각 */
    private int cornerRadius;

    /** SOLID 테두리 색상 (HEX 또는 rgba). 없으면 null */
    private String strokeColor;

    /** 테두리 두께 (px). 0이면 테두리 없음 */
    private int strokeWeight;

    /**
     * DROP_SHADOW 요약 문자열. 예: "0px/8px/24px rgba(0,132,133,0.06)".
     * 없으면 null
     */
    private String shadow;

    // ── 타이포그래피 (TEXT 노드 전용) ──────────────────────

    /** TEXT 노드의 텍스트 내용. 비(非) TEXT 노드는 null */
    private String text;

    /** 글자 크기 (px). TEXT 노드에만 설정 */
    private int fontSize;

    /** 글꼴 굵기 (100~900). 400=Regular, 700=Bold */
    private int fontWeight;

    /** 줄 높이 (px). 0이면 정보 없음 */
    private int lineHeight;

    /** 자간 (px, 음수 가능). 0이면 기본값 */
    private double letterSpacing;

    /** 글꼴 패밀리 이름. 예: "Noto Sans KR" */
    private String fontFamily;

    // ── INSTANCE 컴포넌트 속성 ────────────────────────────

    /**
     * INSTANCE 노드의 컴포넌트 속성 맵 (속성명 → 값 문자열).
     * VARIANT, BOOLEAN, TEXT 타입만 포함하며, INSTANCE_SWAP은 제외한다.
     * 예: {"prop1": "spending", "isExpanded": "true"}
     */
    private Map<String, String> componentProps;

    // ── 트리 ──────────────────────────────────────────────

    /** 하위 노드 요약 목록 (깊이 제한 적용) */
    private List<FigmaNodeSummary> children;
}
