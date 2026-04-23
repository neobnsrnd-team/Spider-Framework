package com.example.admin_demo.domain.cmsasset.service;

import com.example.admin_demo.domain.code.dto.CodeResponse;
import com.example.admin_demo.domain.code.service.CodeService;
import com.example.admin_demo.domain.cmsasset.client.CmsBuilderClient;
import com.example.admin_demo.domain.cmsasset.client.dto.CmsBuilderUploadApiResponse;
import com.example.admin_demo.domain.cmsasset.dto.CmsAssetApprovalListRequest;
import com.example.admin_demo.domain.cmsasset.dto.CmsAssetDetailResponse;
import com.example.admin_demo.domain.cmsasset.dto.CmsAssetListResponse;
import com.example.admin_demo.domain.cmsasset.dto.CmsAssetRequestListRequest;
import com.example.admin_demo.domain.cmsasset.dto.CmsAssetUploadResponse;
import com.example.admin_demo.domain.cmsasset.mapper.CmsAssetMapper;
import com.example.admin_demo.domain.cmsasset.validator.AssetUploadValidator;
import com.example.admin_demo.global.dto.PageRequest;
import com.example.admin_demo.global.dto.PageResponse;
import com.example.admin_demo.global.exception.ErrorType;
import com.example.admin_demo.global.exception.InvalidInputException;
import com.example.admin_demo.global.exception.InvalidStateException;
import com.example.admin_demo.global.exception.NotFoundException;
import com.example.admin_demo.global.exception.base.BaseException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@RequiredArgsConstructor
public class CmsAssetService {

    public static final String ASSET_CATEGORY_CODE_GROUP_ID = "CMS00001";
    public static final String DEFAULT_BUSINESS_CATEGORY = "COMMON";

    private static final String STATE_WORK = "WORK";
    private static final String STATE_PENDING = "PENDING";
    private static final String STATE_APPROVED = "APPROVED";
    private static final String STATE_REJECTED = "REJECTED";
    private static final String USE_Y = "Y";
    private static final String USE_N = "N";
    private static final int REJECTED_REASON_MAX_CHARS = 1000;
    private static final int REJECTED_REASON_MAX_BYTES = 1000;
    private static final Set<String> ALLOWED_ASSET_CATEGORIES = Set.of("COMMON", "CARD", "LOAN", "DEPOSIT");

    private final CmsAssetMapper cmsAssetMapper;
    private final CodeService codeService;
    private final CmsBuilderClient cmsBuilderClient;
    private final AssetUploadValidator assetUploadValidator;
    private final TransactionTemplate transactionTemplate;

    @Transactional(readOnly = true)
    public PageResponse<CmsAssetListResponse> findMyRequestList(
            String currentUserId, CmsAssetRequestListRequest req, PageRequest pageRequest) {

        req.setCreateUserId(currentUserId);

        long total = cmsAssetMapper.countMyList(req);
        List<CmsAssetListResponse> list =
                cmsAssetMapper.findMyList(req, pageRequest.getOffset(), pageRequest.getEndRow());

        return PageResponse.of(list, total, pageRequest.getPage(), pageRequest.getSize());
    }

    @Transactional(readOnly = true)
    public PageResponse<CmsAssetListResponse> findApprovalList(
            CmsAssetApprovalListRequest req, PageRequest pageRequest) {

        long total = cmsAssetMapper.countApprovalList(req);
        List<CmsAssetListResponse> list =
                cmsAssetMapper.findApprovalList(req, pageRequest.getOffset(), pageRequest.getEndRow());

        return PageResponse.of(list, total, pageRequest.getPage(), pageRequest.getSize());
    }

    @Transactional(readOnly = true)
    public List<CodeResponse> getAssetCategoryCodes() {
        return codeService.getCodesByCodeGroupId(ASSET_CATEGORY_CODE_GROUP_ID).stream()
                .filter(code -> USE_Y.equalsIgnoreCase(code.getUseYn()))
                .filter(code -> ALLOWED_ASSET_CATEGORIES.contains(code.getCode()))
                .toList();
    }

    @Transactional(readOnly = true)
    public CmsAssetDetailResponse findById(String assetId) {
        CmsAssetDetailResponse detail = cmsAssetMapper.findDetailById(assetId);
        if (detail == null) {
            throw new NotFoundException("이미지를 찾을 수 없습니다. assetId=" + assetId);
        }
        return detail;
    }

    @Transactional
    public void requestApproval(String assetId, String modifierId, String modifierName) {
        assertTransition(assetId, STATE_WORK, STATE_PENDING);
        int updated = cmsAssetMapper.updateState(assetId, STATE_WORK, STATE_PENDING, null, modifierId, modifierName);
        if (updated != 1) {
            throw new InvalidStateException("이미 처리된 이미지입니다. assetId=" + assetId);
        }
        log.info("CMS 이미지 승인 요청: assetId={}, modifierId={}", assetId, modifierId);
    }

    public void approve(String assetId, String modifierId, String modifierName) {
        transactionTemplate.executeWithoutResult(status -> {
            assertTransition(assetId, STATE_PENDING, STATE_APPROVED);
            int updated =
                    cmsAssetMapper.updateState(assetId, STATE_PENDING, STATE_APPROVED, null, modifierId, modifierName);
            if (updated != 1) {
                throw new InvalidStateException("이미 처리된 이미지입니다. assetId=" + assetId);
            }
        });

        try {
            cmsBuilderClient.deployAsset(assetId);
            log.info("CMS 이미지 승인 및 배포 완료: assetId={}, modifierId={}", assetId, modifierId);
        } catch (BaseException deployEx) {
            log.error("CMS 이미지 배포 실패로 승인 상태 롤백 시도: assetId={}, modifierId={}", assetId, modifierId, deployEx);
            try {
                transactionTemplate.executeWithoutResult(status -> cmsAssetMapper.updateState(
                        assetId, STATE_APPROVED, STATE_PENDING, null, modifierId, modifierName));
            } catch (RuntimeException revertEx) {
                log.error("승인 롤백 실패. 수동 확인 필요: assetId={}", assetId, revertEx);
            }
            throw deployEx;
        }
    }

    public CmsAssetUploadResponse uploadAsset(
            MultipartFile file, String businessCategory, String assetDesc, String uploaderId, String uploaderName) {

        assetUploadValidator.validate(file);
        String normalizedCategory = normalizeBusinessCategory(businessCategory);
        CmsBuilderUploadApiResponse cmsResponse =
                cmsBuilderClient.upload(file, uploaderId, uploaderName, normalizedCategory, assetDesc);
        return CmsAssetUploadResponse.builder()
                .assetId(cmsResponse.getAssetId())
                .url(cmsResponse.getUrl())
                .build();
    }

    public CmsAssetUploadResponse uploadApprovedAsset(
            MultipartFile file, String businessCategory, String assetDesc, String uploaderId, String uploaderName) {

        CmsAssetUploadResponse response = uploadAsset(file, businessCategory, assetDesc, uploaderId, uploaderName);

        transactionTemplate.executeWithoutResult(status -> {
            assertTransition(response.getAssetId(), STATE_WORK, STATE_APPROVED);
            int updated = cmsAssetMapper.updateState(
                    response.getAssetId(), STATE_WORK, STATE_APPROVED, null, uploaderId, uploaderName);
            if (updated != 1) {
                throw new InvalidStateException("이미 처리된 이미지입니다. assetId=" + response.getAssetId());
            }
        });

        try {
            cmsBuilderClient.deployAsset(response.getAssetId());
            log.info("CMS 관리자 이미지 즉시 승인 업로드 완료: assetId={}, uploaderId={}", response.getAssetId(), uploaderId);
            return response;
        } catch (BaseException deployEx) {
            log.error("CMS 관리자 이미지 즉시 승인 배포 실패. WORK 복구 시도: assetId={}, uploaderId={}",
                    response.getAssetId(), uploaderId, deployEx);
            try {
                transactionTemplate.executeWithoutResult(status -> cmsAssetMapper.updateState(
                        response.getAssetId(), STATE_APPROVED, STATE_WORK, null, uploaderId, uploaderName));
            } catch (RuntimeException revertEx) {
                log.error("관리자 업로드 롤백 실패. 수동 확인 필요: assetId={}", response.getAssetId(), revertEx);
            }
            throw deployEx;
        }
    }

    public void deleteMyAsset(String assetId, String userId) {
        String createUserId = cmsAssetMapper.findCreateUserIdByAssetId(assetId);
        if (createUserId == null) {
            throw new NotFoundException("이미지를 찾을 수 없습니다. assetId=" + assetId);
        }
        if (!createUserId.equals(userId)) {
            log.warn("CMS 이미지 삭제 권한 없음. assetId={}, owner={}, requester={}", assetId, createUserId, userId);
            throw new BaseException(ErrorType.FORBIDDEN, "본인이 업로드한 이미지만 삭제할 수 있습니다.");
        }

        String currentState = cmsAssetMapper.findAssetStateById(assetId);
        if (!STATE_WORK.equals(currentState) && !STATE_REJECTED.equals(currentState)) {
            throw new InvalidStateException(
                    String.format("현재 상태(%s)에서는 삭제할 수 없습니다. 허용 상태는 WORK 또는 REJECTED 입니다.", currentState));
        }

        cmsBuilderClient.delete(assetId, userId);
        log.info("CMS 이미지 삭제 요청 완료: assetId={}, prevState={}, userId={}", assetId, currentState, userId);
    }

    @Transactional
    public void reject(String assetId, String rejectedReason, String modifierId, String modifierName) {
        assertTransition(assetId, STATE_PENDING, STATE_REJECTED);
        String reason = normalizeReason(rejectedReason);
        int updated =
                cmsAssetMapper.updateState(assetId, STATE_PENDING, STATE_REJECTED, reason, modifierId, modifierName);
        if (updated != 1) {
            throw new InvalidStateException("이미 처리된 이미지입니다. assetId=" + assetId);
        }
        log.info("CMS 이미지 반려 완료: assetId={}, modifierId={}", assetId, modifierId);
    }

    @Transactional
    public void updateVisibility(String assetId, String useYn, String modifierId, String modifierName) {
        ensureAssetExists(assetId);
        String normalizedUseYn = normalizeUseYn(useYn);
        int updated = cmsAssetMapper.updateUseYn(assetId, normalizedUseYn, modifierId, modifierName);
        if (updated != 1) {
            throw new InvalidStateException("이미 처리된 이미지입니다. assetId=" + assetId);
        }
        log.info("CMS 이미지 노출 여부 변경: assetId={}, useYn={}, modifierId={}", assetId, normalizedUseYn, modifierId);
    }

    private void assertTransition(String assetId, String expectedFrom, String target) {
        String current = cmsAssetMapper.findAssetStateById(assetId);
        if (current == null) {
            throw new NotFoundException("이미지를 찾을 수 없습니다. assetId=" + assetId);
        }
        if (!expectedFrom.equals(current)) {
            throw new InvalidStateException(
                    String.format("현재 상태(%s)에서는 %s 전이를 수행할 수 없습니다. 필요 상태=%s", current, target, expectedFrom));
        }
    }

    private void ensureAssetExists(String assetId) {
        if (cmsAssetMapper.existsByAssetId(assetId) != 1) {
            throw new NotFoundException("이미지를 찾을 수 없습니다. assetId=" + assetId);
        }
    }

    private String normalizeReason(String rejectedReason) {
        if (rejectedReason == null) {
            return null;
        }
        String trimmed = rejectedReason.trim();
        if (trimmed.isEmpty()) {
            return null;
        }
        if (trimmed.length() > REJECTED_REASON_MAX_CHARS) {
            throw new InvalidInputException("반려 사유는 " + REJECTED_REASON_MAX_CHARS + "자 이하로 입력해 주세요.");
        }
        if (trimmed.getBytes(StandardCharsets.UTF_8).length > REJECTED_REASON_MAX_BYTES) {
            throw new InvalidInputException("반려 사유는 UTF-8 기준 " + REJECTED_REASON_MAX_BYTES + "바이트 이하로 입력해 주세요.");
        }
        return trimmed;
    }

    private String normalizeBusinessCategory(String businessCategory) {
        String normalized = (businessCategory == null || businessCategory.isBlank())
                ? DEFAULT_BUSINESS_CATEGORY
                : businessCategory.trim();

        boolean exists = getAssetCategoryCodes().stream().anyMatch(code -> normalized.equals(code.getCode()));
        if (!exists) {
            throw new InvalidInputException("유효하지 않은 이미지 카테고리입니다.");
        }
        return normalized;
    }

    private String normalizeUseYn(String useYn) {
        if (useYn == null || useYn.isBlank()) {
            throw new InvalidInputException("노출 여부 값이 필요합니다.");
        }
        String normalized = useYn.trim().toUpperCase();
        if (!USE_Y.equals(normalized) && !USE_N.equals(normalized)) {
            throw new InvalidInputException("유효하지 않은 노출 여부 값입니다.");
        }
        return normalized;
    }
}
