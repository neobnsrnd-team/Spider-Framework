package com.example.admin_demo.domain.reactgenerate.figma;

import com.example.admin_demo.global.exception.NotFoundException;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Figma API 원시 응답({@link FigmaNodeResponse})을 Claude 프롬프트용 컨텍스트({@link FigmaDesignContext})로 변환하는 컴포넌트.
 *
 * <p>변환 시 다음을 수행한다:
 * <ul>
 *   <li>루트 노드의 크기·타입·레이아웃 정보 추출</li>
 *   <li>하위 노드를 {@code MAX_DEPTH}까지 재귀 탐색하여 {@link FigmaNodeSummary} 생성</li>
 *   <li>SOLID 채우기 색상을 HEX 문자열로 변환 (Figma RGBA 0.0~1.0 → #RRGGBB)</li>
 *   <li>TEXT 노드의 텍스트 내용 추출</li>
 * </ul>
 *
 * <p>깊이 제한은 토큰 비용을 줄이고 Claude에게 핵심 구조만 전달하기 위해 적용한다.
 */
@Slf4j
@Component
public class FigmaDesignExtractor {

    /** 노드 트리 탐색 최대 깊이. 루트는 0, 직계 자식은 1 */
    private static final int MAX_DEPTH = 4;

    /**
     * Figma API 응답에서 디자인 컨텍스트를 추출한다.
     *
     * @param response Figma API {@code /v1/files/{fileKey}/nodes} 응답
     * @param nodeId   요청한 노드 ID (API 형식: {@code pageId:nodeId})
     * @param figmaUrl 원본 Figma URL (참조용으로 컨텍스트에 포함)
     * @return Claude 프롬프트 생성에 사용할 디자인 컨텍스트
     * @throws NotFoundException 응답에서 해당 노드를 찾을 수 없을 때
     */
    public FigmaDesignContext extract(FigmaNodeResponse response, String nodeId, String figmaUrl) {
        FigmaNode root = findRootNode(response, nodeId);

        log.debug(
                "Figma 노드 추출 — name: {}, type: {}, children: {}개",
                root.getName(),
                root.getType(),
                root.getChildren() == null ? 0 : root.getChildren().size());

        return FigmaDesignContext.builder()
                .figmaUrl(figmaUrl)
                .componentName(root.getName())
                .componentType(root.getType())
                .width(toInt(
                        root.getAbsoluteBoundingBox() != null
                                ? root.getAbsoluteBoundingBox().getWidth()
                                : 0))
                .height(toInt(
                        root.getAbsoluteBoundingBox() != null
                                ? root.getAbsoluteBoundingBox().getHeight()
                                : 0))
                .layoutMode(root.getLayoutMode())
                .children(extractChildren(root.getChildren(), 1))
                .build();
    }

    /**
     * 응답의 nodes 맵에서 루트 노드를 찾는다.
     *
     * <p>요청한 nodeId로 직접 조회를 시도하고, 없으면 맵의 첫 번째 값을 폴백으로 사용한다.
     * API를 단일 nodeId로 요청했으므로 폴백 시에도 원하는 노드를 가져온다.
     */
    private FigmaNode findRootNode(FigmaNodeResponse response, String nodeId) {
        if (response.getNodes() == null || response.getNodes().isEmpty()) {
            throw new NotFoundException("Figma API 응답에 노드 데이터가 없습니다.");
        }

        FigmaNodeResponse.NodeWrapper wrapper = response.getNodes().get(nodeId);
        if (wrapper == null) {
            // 키 형식 불일치 대비 폴백: 단일 nodeId 요청이므로 첫 번째 값이 대상 노드
            wrapper = response.getNodes().values().stream()
                    .findFirst()
                    .orElseThrow(() -> new NotFoundException("Figma API 응답에서 노드를 찾을 수 없습니다: nodeId=" + nodeId));
            log.warn("nodeId 직접 조회 실패({}), 첫 번째 노드로 폴백합니다.", nodeId);
        }

        if (wrapper.getDocument() == null) {
            throw new NotFoundException("Figma 노드 document가 비어있습니다: nodeId=" + nodeId);
        }

        return wrapper.getDocument();
    }

    /**
     * 하위 노드 목록을 재귀적으로 탐색하여 {@link FigmaNodeSummary} 목록으로 변환한다.
     *
     * @param nodes 변환할 노드 목록
     * @param depth 현재 탐색 깊이 (MAX_DEPTH 초과 시 빈 목록 반환)
     */
    private List<FigmaNodeSummary> extractChildren(List<FigmaNode> nodes, int depth) {
        if (nodes == null || nodes.isEmpty() || depth > MAX_DEPTH) {
            return Collections.emptyList();
        }
        return nodes.stream().map(node -> toSummary(node, depth)).collect(Collectors.toList());
    }

    /** 단일 {@link FigmaNode}를 {@link FigmaNodeSummary}로 변환한다. */
    private FigmaNodeSummary toSummary(FigmaNode node, int depth) {
        return FigmaNodeSummary.builder()
                .name(node.getName())
                .type(node.getType())
                .text(node.getCharacters())
                .fillColor(extractFillColor(node.getFills()))
                .width(toInt(
                        node.getAbsoluteBoundingBox() != null
                                ? node.getAbsoluteBoundingBox().getWidth()
                                : 0))
                .height(toInt(
                        node.getAbsoluteBoundingBox() != null
                                ? node.getAbsoluteBoundingBox().getHeight()
                                : 0))
                .layoutMode(node.getLayoutMode())
                .paddingTop(toInt(node.getPaddingTop()))
                .paddingRight(toInt(node.getPaddingRight()))
                .paddingBottom(toInt(node.getPaddingBottom()))
                .paddingLeft(toInt(node.getPaddingLeft()))
                .gap(toInt(node.getItemSpacing()))
                .children(extractChildren(node.getChildren(), depth + 1))
                .build();
    }

    /**
     * 채우기 목록에서 첫 번째 SOLID 타입의 색상을 HEX 문자열로 반환한다.
     *
     * @param fills Figma 채우기 목록
     * @return HEX 색상 문자열 (예: {@code #1A2B3C}), SOLID 채우기가 없으면 null
     */
    private String extractFillColor(List<FigmaNode.Fill> fills) {
        if (fills == null || fills.isEmpty()) return null;
        return fills.stream()
                .filter(f -> "SOLID".equals(f.getType()) && f.getColor() != null)
                .findFirst()
                .map(f -> toHex(f.getColor()))
                .orElse(null);
    }

    /**
     * Figma RGBA 색상(각 채널 0.0~1.0)을 HEX 문자열(#RRGGBB)로 변환한다.
     *
     * @param color Figma Color 객체
     * @return HEX 색상 문자열 (예: {@code #FF5733})
     */
    private String toHex(FigmaNode.Color color) {
        int r = Math.min(255, (int) Math.round(color.getR() * 255));
        int g = Math.min(255, (int) Math.round(color.getG() * 255));
        int b = Math.min(255, (int) Math.round(color.getB() * 255));
        return String.format("#%02X%02X%02X", r, g, b);
    }

    /** Double 값을 int로 변환한다. null이면 0을 반환한다. */
    private int toInt(Double value) {
        return value == null ? 0 : (int) Math.round(value);
    }

    /** double 값을 int로 변환한다. */
    private int toInt(double value) {
        return (int) Math.round(value);
    }
}
