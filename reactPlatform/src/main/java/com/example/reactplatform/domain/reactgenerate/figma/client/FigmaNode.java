package com.example.reactplatform.domain.reactgenerate.figma.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;
import java.util.Map;
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

    /** 테두리(Stroke) 스타일 목록 */
    private List<Fill> strokes;

    /** 테두리 두께 (px) */
    private Double strokeWeight;

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

    /** 주축 방향 크기 결정 방식: FIXED, HUG, FILL */
    private String primaryAxisSizingMode;

    /** 교차축 방향 크기 결정 방식: FIXED, HUG, FILL */
    private String counterAxisSizingMode;

    /** 모서리 반경 (px). 네 모서리 동일값 */
    private Double cornerRadius;

    /** 콘텐츠 영역 밖 자식을 잘라내는지 여부 (overflow: hidden) */
    private Boolean clipsContent;

    /** 이펙트(그림자·블러) 목록 */
    private List<Effect> effects;

    /** TEXT 노드의 실제 텍스트 내용 */
    private String characters;

    /** TEXT 노드의 타이포그래피 스타일 정보 */
    private TypeStyle style;

    /**
     * INSTANCE 노드가 참조하는 마스터 컴포넌트 ID.
     * 컴포넌트 라이브러리 매핑 힌트로 활용한다.
     */
    private String componentId;

    /**
     * INSTANCE 노드의 컴포넌트 속성 맵 (속성명 → ComponentProperty).
     * VARIANT(변형 옵션), BOOLEAN(on/off 상태), TEXT(텍스트 오버라이드)를 포함한다.
     * INSTANCE_SWAP(중첩 컴포넌트 교체)은 ID 문자열이라 Claude에게 의미 없으므로 추출 시 제외한다.
     */
    private Map<String, ComponentProperty> componentProperties;

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

    /** 노드의 채우기(Fill) 및 테두리(Stroke) 스타일을 담는 중첩 클래스 */
    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Fill {

        /** 채우기 타입: SOLID, GRADIENT_LINEAR, GRADIENT_RADIAL, GRADIENT_ANGULAR, IMAGE 등 */
        private String type;

        /** SOLID 타입일 때의 RGBA 색상 (각 채널 0.0~1.0) */
        private Color color;

        /** 채우기 불투명도 (0.0~1.0, 없으면 1.0으로 간주) */
        private Double opacity;

        /** 그라디언트 색상 정지점 목록 (GRADIENT_* 타입에서 사용) */
        private List<GradientStop> gradientStops;
    }

    /** 그라디언트 정지점: 색상과 위치(0.0~1.0) */
    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GradientStop {
        private Color color;
        /** 그라디언트 위치 (0.0 = 시작, 1.0 = 끝) */
        private double position;
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

    /** DROP_SHADOW, INNER_SHADOW, LAYER_BLUR, BACKGROUND_BLUR 이펙트를 담는 중첩 클래스 */
    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Effect {
        /** 이펙트 타입: DROP_SHADOW, INNER_SHADOW, LAYER_BLUR, BACKGROUND_BLUR */
        private String type;
        /** 블러 반경 (px) */
        private Double radius;
        /** 그림자 색상 (DROP_SHADOW, INNER_SHADOW) */
        private Color color;
        /** 그림자 오프셋 (DROP_SHADOW, INNER_SHADOW) */
        private EffectOffset offset;
        /** 이펙트 적용 여부 */
        private Boolean visible;
    }

    /** 그림자 이펙트의 X·Y 오프셋을 담는 중첩 클래스 */
    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class EffectOffset {
        private Double x;
        private Double y;
    }

    /**
     * INSTANCE 노드의 컴포넌트 속성 항목.
     *
     * <p>Figma API 응답 예시:
     * <pre>
     * "prop1": { "type": "VARIANT", "value": "spending" }
     * "isExpanded": { "type": "BOOLEAN", "value": true }
     * "label": { "type": "TEXT", "value": "확인" }
     * </pre>
     *
     * <p>value는 타입에 따라 String 또는 Boolean이므로 Object로 선언하고
     * 추출 시 {@code String.valueOf(value)}로 변환한다.
     */
    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ComponentProperty {
        /** 속성 타입: VARIANT, BOOLEAN, TEXT, INSTANCE_SWAP */
        private String type;
        /** 속성값. VARIANT·TEXT는 String, BOOLEAN은 Boolean */
        private Object value;
    }

    /** TEXT 노드의 타이포그래피 속성을 담는 중첩 클래스 */
    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TypeStyle {
        /** 글꼴 패밀리 이름 (예: "Noto Sans KR") */
        private String fontFamily;
        /** 글꼴 굵기 (100~900, 400=Regular, 700=Bold) */
        private Integer fontWeight;
        /** 글자 크기 (px) */
        private Double fontSize;
        /** 줄 높이 (px). Figma API 필드명 lineHeightPx */
        private Double lineHeightPx;
        /** 자간 (px, 음수 가능) */
        private Double letterSpacing;
        /** 수평 정렬: LEFT, CENTER, RIGHT, JUSTIFIED */
        private String textAlignHorizontal;
    }
}
