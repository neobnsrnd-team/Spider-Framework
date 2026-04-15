package com.example.admin_demo.domain.reactgenerate.figma;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Figma 노드에서 Claude 프롬프트 생성에 필요한 정보만 추출한 요약 클래스.
 *
 * <p>{@link FigmaDesignExtractor}가 원시 {@link FigmaNode}를 이 클래스로 변환한다.
 * 깊이 제한({@code MAX_DEPTH}) 이하의 노드만 포함하며,
 * 채우기 색상은 HEX 문자열로 변환하여 담는다.
 */
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FigmaNodeSummary {

    /** Figma 레이어 이름 */
    private String name;

    /** 노드 타입 (FRAME, TEXT, RECTANGLE, INSTANCE 등) */
    private String type;

    /** TEXT 노드의 텍스트 내용. 비(非) TEXT 노드는 null */
    private String text;

    /** SOLID 채우기의 HEX 색상 (예: {@code #1A1A1A}). 없으면 null */
    private String fillColor;

    /** 노드 너비 (px) */
    private int width;

    /** 노드 높이 (px) */
    private int height;

    /** Auto Layout 방향: NONE, HORIZONTAL, VERTICAL. null이면 고정 레이아웃 */
    private String layoutMode;

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

    /** 하위 노드 요약 목록 (깊이 제한 적용) */
    private List<FigmaNodeSummary> children;
}
