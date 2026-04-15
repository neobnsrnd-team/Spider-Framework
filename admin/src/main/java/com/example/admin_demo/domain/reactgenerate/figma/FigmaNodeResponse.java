package com.example.admin_demo.domain.reactgenerate.figma;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;

/**
 * Figma REST API {@code GET /v1/files/{fileKey}/nodes} 응답을 매핑하는 클래스.
 *
 * <p>응답 최상위 구조:
 * <pre>
 * {
 *   "name": "파일명",
 *   "nodes": {
 *     "{nodeId}": {
 *       "document": { ... }
 *     }
 *   }
 * }
 * </pre>
 *
 * <p>{@code nodes} 맵의 키는 요청한 nodeId와 동일한 형식({@code pageId:nodeId})을 사용한다.
 */
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class FigmaNodeResponse {

    /** 요청한 노드 ID → 노드 데이터 매핑 */
    private Map<String, NodeWrapper> nodes;

    /**
     * 단일 노드에 대한 래퍼 객체.
     * Figma API는 각 노드를 {@code document} 필드로 감싸서 반환한다.
     */
    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class NodeWrapper {

        /** 실제 노드 데이터 (재귀 트리 구조) */
        private FigmaNode document;
    }
}
