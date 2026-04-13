package com.example.admin_demo.domain.reload.service;

import com.example.admin_demo.domain.property.dto.PropertyResponse;
import com.example.admin_demo.domain.property.mapper.PropertyMapper;
import com.example.admin_demo.domain.reload.dto.ReloadExecuteRequest;
import com.example.admin_demo.domain.reload.dto.ReloadResultResponse;
import com.example.admin_demo.domain.reload.dto.ReloadResultResponse.WasReloadResult;
import com.example.admin_demo.domain.reload.dto.ReloadTypeResponse;
import com.example.admin_demo.domain.reload.enums.ReloadType;
import com.example.admin_demo.domain.wasinstance.dto.WasInstanceResponse;
import com.example.admin_demo.domain.wasinstance.mapper.WasInstanceMapper;
import com.example.admin_demo.global.exception.InternalException;
import java.util.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

/**
 * 운영정보 Reload Service 구현체
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReloadService {

    private final WasInstanceMapper wasInstanceMapper;
    private final PropertyMapper propertyMapper;
    private final RestTemplate restTemplate;

    @Value("${reload.management.default-port:50005}")
    private int defaultManagementPort;

    @Value("${reload.management.default-ip:localhost}")
    private String defaultManagementIp;

    @Value("${reload.management.endpoint:/api/management/reload}")
    private String managementEndpoint;

    @Value("${reload.management.property-group:was_config}")
    private String propertyGroup;

    public List<ReloadTypeResponse> getReloadTypes() {
        return Arrays.stream(ReloadType.values())
                .filter(ReloadType::isVisible)
                .map(type -> ReloadTypeResponse.builder()
                        .code(type.getCode())
                        .label(type.getDescription())
                        .description(type.getDetail())
                        .build())
                .toList();
    }

    public ReloadResultResponse executeReload(ReloadExecuteRequest request) {
        ReloadType reloadType = ReloadType.fromCode(request.getReloadType());
        if (reloadType == null) {
            throw new InternalException("reloadType: " + request.getReloadType());
        }

        Map<String, String> additionalParams =
                request.getAdditionalParams() != null ? request.getAdditionalParams() : Collections.emptyMap();

        List<WasReloadResult> results = request.getInstanceIds().stream()
                .map(instanceId -> executeReloadForInstance(instanceId, reloadType, additionalParams))
                .toList();

        return ReloadResultResponse.builder()
                .reloadType(request.getReloadType())
                .results(results)
                .build();
    }

    private WasReloadResult executeReloadForInstance(
            String instanceId, ReloadType reloadType, Map<String, String> additionalParams) {
        WasInstanceResponse instance = wasInstanceMapper.selectResponseById(instanceId);
        if (instance == null) {
            return WasReloadResult.builder()
                    .instanceId(instanceId)
                    .success(false)
                    .errorMessage(instanceId + " 인스턴스를 찾을 수 없습니다.")
                    .build();
        }

        String managementIp = resolveManagementProperty(instanceId, "MANAGEMENT_SERVER_IP", defaultManagementIp);
        int managementPort = resolveManagementPort(instanceId);
        String url = String.format("http://%s:%d%s", managementIp, managementPort, managementEndpoint);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> body = new HashMap<>();
            body.put("gubun", reloadType.getCode());
            if (additionalParams != null && !additionalParams.isEmpty()) {
                body.putAll(additionalParams);
            }

            HttpEntity<Map<String, String>> httpEntity = new HttpEntity<>(body, headers);

            log.info(
                    "Reload 요청: instanceId={}, url={}, gubun={}, params={}",
                    instanceId,
                    url,
                    reloadType.getCode(),
                    additionalParams);

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url, HttpMethod.POST, httpEntity, new ParameterizedTypeReference<Map<String, Object>>() {});

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                Object successObj = responseBody.get("success");
                boolean success = successObj instanceof Boolean b && b;
                String message =
                        responseBody.get("message") != null ? String.valueOf(responseBody.get("message")) : null;

                if (success) {
                    log.info("Reload 성공: instanceId={}", instanceId);
                    return WasReloadResult.builder()
                            .instanceId(instanceId)
                            .instanceName(instance.getInstanceName())
                            .success(true)
                            .build();
                } else {
                    log.warn("Reload 실패 응답: instanceId={}, message={}", instanceId, message);
                    return WasReloadResult.builder()
                            .instanceId(instanceId)
                            .instanceName(instance.getInstanceName())
                            .success(false)
                            .errorMessage(message)
                            .build();
                }
            }

            return WasReloadResult.builder()
                    .instanceId(instanceId)
                    .instanceName(instance.getInstanceName())
                    .success(false)
                    .errorMessage("응답 상태: " + response.getStatusCode())
                    .build();

        } catch (RestClientException e) {
            String errorMsg = String.format(
                    "%s 서버에 연결 중 오류가 발생하였습니다.[host=%s,port=%d]", instanceId, managementIp, managementPort);
            log.error("Reload 통신 오류: {}", errorMsg, e);

            return WasReloadResult.builder()
                    .instanceId(instanceId)
                    .instanceName(instance.getInstanceName())
                    .success(false)
                    .errorMessage(errorMsg)
                    .build();
        }
    }

    private int resolveManagementPort(String instanceId) {
        String value = resolveManagementProperty(instanceId, "MANAGEMENT_SERVER_PORT", null);
        if (value != null) {
            try {
                return Integer.parseInt(value);
            } catch (NumberFormatException e) {
                log.debug("Management port 파싱 실패, 기본값 사용: instanceId={}", instanceId, e);
            }
        }
        return defaultManagementPort;
    }

    /**
     * FWK_PROPERTY 테이블에서 management 통신 설정 조회
     * key: (was_config, {instanceId}.{suffix})
     */
    private String resolveManagementProperty(String instanceId, String suffix, String defaultValue) {
        try {
            String propertyId = instanceId + "." + suffix;
            PropertyResponse property = propertyMapper.selectResponseById(propertyGroup, propertyId);
            if (property != null
                    && property.getDefaultValue() != null
                    && !property.getDefaultValue().isBlank()) {
                return property.getDefaultValue();
            }
        } catch (Exception e) {
            log.warn("Management property 조회 실패, 기본값 사용: instanceId={}, suffix={}", instanceId, suffix, e);
        }
        return defaultValue;
    }
}
