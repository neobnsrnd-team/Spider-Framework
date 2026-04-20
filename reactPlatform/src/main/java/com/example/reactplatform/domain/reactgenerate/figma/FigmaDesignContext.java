package com.example.reactplatform.domain.reactgenerate.figma;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Figma 노드에서 추출한 디자인 컨텍스트.
 *
 * <p>Claude API user prompt 구성 시 Figma URL 텍스트 대신 이 클래스의 구조화된 정보를 사용한다.
 * {@link FigmaDesignExtractor}가 {@link FigmaNodeResponse}를 이 클래스로 변환한다.
 */
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FigmaDesignContext {

    /** 원본 Figma URL (참조용) */
    private String figmaUrl;

    /** 루트 노드의 Figma 레이어 이름 */
    private String componentName;

    /** 루트 노드 타입 (FRAME, COMPONENT 등) */
    private String componentType;

    /** 루트 노드 너비 (px) */
    private int width;

    /** 루트 노드 높이 (px) */
    private int height;

    /** 루트 노드의 Auto Layout 방향: NONE, HORIZONTAL, VERTICAL */
    private String layoutMode;

    /** 하위 노드 요약 목록 (깊이 제한 적용) */
    private List<FigmaNodeSummary> children;
}
