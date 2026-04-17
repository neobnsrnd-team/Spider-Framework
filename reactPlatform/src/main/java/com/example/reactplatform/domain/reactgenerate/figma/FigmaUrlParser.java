package com.example.reactplatform.domain.reactgenerate.figma;

import com.example.reactplatform.global.exception.InvalidInputException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Figma URL에서 fileKey와 nodeId를 추출하는 파서.
 *
 * <p>지원 URL 형식:
 * <ul>
 *   <li>{@code https://www.figma.com/file/{fileKey}/{title}?node-id={nodeId}}</li>
 *   <li>{@code https://www.figma.com/design/{fileKey}/{title}?node-id={nodeId}}</li>
 *   <li>{@code https://www.figma.com/proto/{fileKey}/{title}?node-id={nodeId}}</li>
 * </ul>
 *
 * <p>nodeId는 URL 형식에 따라 아래 두 가지로 인코딩될 수 있으며, 모두 API 형식({@code 1:2})으로 정규화한다:
 * <ul>
 *   <li>퍼센트 인코딩: {@code node-id=1%3A2} → {@code 1:2}</li>
 *   <li>대시 구분자: {@code node-id=1-2} → {@code 1:2}</li>
 * </ul>
 */
public final class FigmaUrlParser {

    /** /file/, /design/, /proto/ 다음 경로 세그먼트를 fileKey로 추출 */
    private static final Pattern FILE_KEY_PATTERN = Pattern.compile("/(?:file|design|proto)/([^/?#]+)");

    private FigmaUrlParser() {}

    /**
     * Figma URL을 파싱하여 fileKey와 nodeId를 추출한다.
     *
     * @param figmaUrl 파싱할 Figma URL
     * @return fileKey와 nodeId를 담은 파싱 결과
     * @throws InvalidInputException URL이 유효하지 않거나 nodeId가 없을 경우
     */
    public static ParsedFigmaUrl parse(String figmaUrl) {
        if (figmaUrl == null || figmaUrl.isBlank()) {
            throw new InvalidInputException("Figma URL이 비어있습니다.");
        }

        Matcher matcher = FILE_KEY_PATTERN.matcher(figmaUrl);
        if (!matcher.find()) {
            throw new InvalidInputException("유효하지 않은 Figma URL입니다. /file/ 또는 /design/ 경로를 포함해야 합니다: " + figmaUrl);
        }
        String fileKey = matcher.group(1);

        String rawNodeId = extractQueryParam(figmaUrl, "node-id");
        if (rawNodeId == null || rawNodeId.isBlank()) {
            throw new InvalidInputException("Figma URL에 node-id가 없습니다. 특정 프레임·컴포넌트를 선택한 공유 URL을 사용하세요.");
        }

        String nodeId = normalizeNodeId(rawNodeId);
        return new ParsedFigmaUrl(fileKey, nodeId);
    }

    /**
     * URL의 쿼리스트링에서 특정 파라미터 값을 추출한다.
     *
     * @param url   전체 URL 문자열
     * @param param 추출할 파라미터 이름
     * @return 파라미터 값, 없으면 null
     */
    private static String extractQueryParam(String url, String param) {
        int queryStart = url.indexOf('?');
        if (queryStart < 0) return null;

        String query = url.substring(queryStart + 1);
        // 프래그먼트(#) 이후 제거
        int fragmentStart = query.indexOf('#');
        if (fragmentStart >= 0) {
            query = query.substring(0, fragmentStart);
        }

        for (String kv : query.split("&")) {
            String[] parts = kv.split("=", 2);
            if (parts.length == 2 && param.equals(parts[0])) {
                return parts[1];
            }
        }
        return null;
    }

    /**
     * node-id 쿼리 파라미터 값을 Figma API 형식({@code 1:2})으로 정규화한다.
     *
     * <p>Figma 브라우저 URL은 nodeId 구분자로 '-'를 사용하지만,
     * Figma REST API는 ':'를 사용한다. 퍼센트 인코딩된 경우도 처리한다.
     *
     * @param raw URL에서 추출한 raw node-id 값
     * @return Figma API 호출에 사용할 nodeId (콜론 구분 형식)
     */
    private static String normalizeNodeId(String raw) {
        // %3A → ':' 변환 (URL 퍼센트 인코딩 해제)
        String decoded = URLDecoder.decode(raw, StandardCharsets.UTF_8);
        // 이미 콜론 구분 형식이면 그대로 사용
        if (decoded.contains(":")) {
            return decoded;
        }
        // 브라우저 URL의 대시 구분 형식을 API 콜론 형식으로 변환
        // nodeId는 항상 {정수}:{정수} 형태이므로 대시를 콜론으로 치환해도 안전
        return decoded.replace("-", ":");
    }

    /** Figma URL 파싱 결과를 담는 값 객체 */
    @Getter
    @AllArgsConstructor
    public static class ParsedFigmaUrl {

        /** Figma 파일 식별자 (URL 경로의 fileKey 세그먼트) */
        private final String fileKey;

        /** Figma 노드 식별자 (API 형식: {@code pageId:nodeId}) */
        private final String nodeId;
    }
}
