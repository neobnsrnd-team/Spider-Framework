package com.example.admin_demo.domain.reactgenerate.figma;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

/**
 * Figma REST API 응답의 노드(Node) 구조를 매핑하는 클래스.
 *
 * <p>Figma 노드는 재귀적 트리 구조를 가지며, children 필드를 통해 하위 노드를 포함한다.
 * 알 수 없는 필드는 무시하여 API 응답 변경에 유연하게 대응한다.
 *
 * <p>주요 타입: FRAME, GROUP, COMPONENT, INSTANCE, TEXT, RECTANGLE, ELLIPSE, VECTOR
 */
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class FigmaNode {

    /** 노드 고유 식별자 (예: "1:25") */
    private String id;

    /** Figma 레이어 패널에 표시되는 이름 */
    private String name;

    /** 노드 타입 (FRAME, TEXT, RECTANGLE, COMPONENT, INSTANCE 등) */
    private String type;

    /** 하위 노드 목록 (재귀 트리 구조) */
    private List<FigmaNode> children;

    /** 캔버스 기준 절대 좌표 및 크기 */
    private BoundingBox absoluteBoundingBox;

    /** 배경·채우기 스타일 목록 */
    private List<Fill> fills;

    /** Auto Layout 방향: NONE, HORIZONTAL, VERTICAL */
    private String layoutMode;

    /** Auto Layout 왼쪽 패딩 (px) */
    private Double paddingLeft;

    /** Auto Layout 오른쪽 패딩 (px) */
    private Double paddingRight;

    /** Auto Layout 위쪽 패딩 (px) */
    private Double paddingTop;

    /** Auto Layout 아래쪽 패딩 (px) */
    private Double paddingBottom;

    /** Auto Layout 자식 요소 간격 (gap, px) */
    private Double itemSpacing;

    /** 주축(Main Axis) 정렬: MIN, CENTER, MAX, SPACE_BETWEEN */
    private String primaryAxisAlignItems;

    /** 교차축(Cross Axis) 정렬: MIN, CENTER, MAX */
    private String counterAxisAlignItems;

    /** TEXT 노드의 실제 텍스트 내용 */
    private String characters;

    /** 노드의 절대 좌표 및 크기를 담는 중첩 클래스 */
    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class BoundingBox {
        private double x;
        private double y;
        private double width;
        private double height;
    }

    /** 노드의 채우기(Fill) 스타일을 담는 중첩 클래스 */
    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Fill {

        /** 채우기 타입: SOLID, GRADIENT_LINEAR, GRADIENT_RADIAL, IMAGE 등 */
        private String type;

        /** SOLID 타입일 때의 RGBA 색상 (각 채널 0.0~1.0) */
        private Color color;

        /** 채우기 불투명도 (0.0~1.0, 없으면 1.0으로 간주) */
        private Double opacity;
    }

    /** RGBA 색상 값을 담는 중첩 클래스 (각 채널 0.0~1.0) */
    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Color {
        private double r;
        private double g;
        private double b;
        private double a;
    }
}
