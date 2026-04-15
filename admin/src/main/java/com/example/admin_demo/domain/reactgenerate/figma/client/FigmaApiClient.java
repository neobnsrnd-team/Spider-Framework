package com.example.admin_demo.domain.reactgenerate.figma.client;

import com.example.admin_demo.global.exception.InternalException;
import com.example.admin_demo.global.exception.NotFoundException;
import java.time.Duration;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

/**
 * Figma REST API를 호출하여 노드 디자인 정보를 가져오는 클라이언트.
 *
 * <p>호출 엔드포인트: {@code GET /v1/files/{fileKey}/nodes?ids={nodeId}}
 *
 * <p>인증은 {@code X-Figma-Token} 헤더로 Personal Access Token을 전달한다.
 * 토큰은 {@link FigmaApiProperties}를 통해 환경변수({@code FIGMA_ACCESS_TOKEN})에서 주입된다.
 *
 * <p>HTTP 오류 처리:
 * <ul>
 *   <li>401/403: 인증 실패 → {@link InternalException}</li>
 *   <li>404: 파일·노드 없음 또는 접근 권한 없음 → {@link NotFoundException}</li>
 *   <li>기타: {@link InternalException}</li>
 * </ul>
 */
@Slf4j
@Component
@EnableConfigurationProperties(FigmaApiProperties.class)
public class FigmaApiClient {

    /** Figma 노드 조회 URL 경로 템플릿. props.getUrl()과 연결하여 사용한다.
     * base URL을 URI 템플릿 변수로 전달하면 RestTemplate이 URL-인코딩하여 무효한 URL이 생성되므로,
     * 문자열 연결로 처리하고 path/query 변수만 URI 템플릿으로 사용한다. */
    private static final String NODES_PATH = "/v1/files/{fileKey}/nodes?ids={nodeId}";

    private final RestTemplate restTemplate;
    private final FigmaApiProperties props;

    public FigmaApiClient(RestTemplateBuilder builder, FigmaApiProperties props) {
        this.props = props;
        // Figma API 전용 타임아웃 설정 (전역 RestTemplate과 독립적으로 구성)
        this.restTemplate = builder.connectTimeout(Duration.ofSeconds(props.getConnectTimeoutSeconds()))
                .readTimeout(Duration.ofSeconds(props.getReadTimeoutSeconds()))
                .build();
    }

    /**
     * 지정한 fileKey와 nodeId에 해당하는 Figma 노드 데이터를 조회한다.
     *
     * @param fileKey Figma 파일 식별자 (URL 경로 세그먼트)
     * @param nodeId  조회할 노드 ID (Figma API 형식: {@code pageId:nodeId})
     * @return Figma API 응답 (노드 트리 포함)
     * @throws NotFoundException  파일 또는 노드를 찾을 수 없거나 접근 권한이 없을 때
     * @throws InternalException  인증 실패 또는 네트워크 오류 등 내부 오류 시
     */
    public FigmaNodeResponse getNode(String fileKey, String nodeId) {
        log.info("Figma API 호출 — fileKey: {}, nodeId: {}", fileKey, nodeId);

        // base URL을 URI 템플릿 변수로 넘기면 RestTemplate이 URL-인코딩하므로 문자열 연결로 처리
        String url = props.getUrl() + NODES_PATH;

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Figma-Token", props.getToken());

        try {
            ResponseEntity<FigmaNodeResponse> response = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(headers), FigmaNodeResponse.class, fileKey, nodeId);

            FigmaNodeResponse body = response.getBody();
            log.info(
                    "Figma API 응답 수신 — 노드 수: {}",
                    body != null && body.getNodes() != null ? body.getNodes().size() : 0);
            return body;

        } catch (HttpClientErrorException e) {
            int status = e.getStatusCode().value();
            if (status == 401 || status == 403) {
                log.error("Figma API 인증 실패 — status: {}", status);
                throw new InternalException("Figma API 인증에 실패했습니다. FIGMA_ACCESS_TOKEN을 확인하세요.");
            }
            if (status == 404) {
                log.warn("Figma 파일·노드 없음 — fileKey: {}, nodeId: {}", fileKey, nodeId);
                // 404는 파일이 없거나 토큰 권한이 해당 파일에 없을 때도 발생
                throw new NotFoundException("Figma 파일 또는 노드를 찾을 수 없습니다. URL과 접근 권한을 확인하세요. (fileKey=" + fileKey + ")");
            }
            log.error("Figma API 오류 — status: {}", status, e);
            throw new InternalException("Figma API 호출 중 오류가 발생했습니다. (HTTP " + status + ")");

        } catch (RestClientException e) {
            log.error("Figma API 네트워크 오류", e);
            throw new InternalException("Figma API에 연결할 수 없습니다. 네트워크 상태를 확인하세요.");
        }
    }
}
