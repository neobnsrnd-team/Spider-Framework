package com.example.admin_demo.domain.cmsasset.service;

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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.multipart.MultipartFile;

/**
 * CMS 이미지(에셋) 승인 관리 서비스.
 *
 * <p>상태 전이(WORK → PENDING → APPROVED / REJECTED)는 두 단계로 방어한다.
 * <ol>
 *   <li>선검증 — 현재 상태가 {@code expectedFrom}인지 확인하고 아니면 {@link InvalidStateException}</li>
 *   <li>WHERE 가드 — UPDATE 문에 {@code ASSET_STATE = expectedFrom}을 포함하여 동시 실행 레이스 차단.
 *       0행이 갱신되면 {@link InvalidStateException}</li>
 * </ol>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CmsAssetService {

    private static final String STATE_WORK = "WORK";
    private static final String STATE_PENDING = "PENDING";
    private static final String STATE_APPROVED = "APPROVED";
    private static final String STATE_REJECTED = "REJECTED";

    /** REJECTED_REASON 컬럼의 최대 문자 수. 운영 DDL 변경 시 동기화 필요. */
    private static final int REJECTED_REASON_MAX_CHARS = 1000;

    /**
     * REJECTED_REASON 컬럼의 최대 바이트 수 (UTF-8 기준).
     * DB가 {@code VARCHAR2(1000 BYTE)} 로 생성된 환경에서도 ORA-12899 방지를 위해 바이트 상한을 함께 검증.
     */
    private static final int REJECTED_REASON_MAX_BYTES = 1000;

    private final CmsAssetMapper cmsAssetMapper;
    private final CmsBuilderClient cmsBuilderClient;
    private final AssetUploadValidator assetUploadValidator;

    /**
     * 승인 saga 용 — 상태 UPDATE 를 CMS 호출 전에 독립적으로 커밋하기 위한 TransactionTemplate.
     * CMS 가 DB 의 {@code APPROVED} 상태를 읽어 검증하므로 Admin 의 UPDATE 가 READ_COMMITTED 관점에서
     * CMS 에 가시화되어야 한다.
     */
    private final TransactionTemplate transactionTemplate;

    /**
     * 현업 본인 업로드 이미지 목록 조회.
     *
     * <p>클라이언트가 보낸 {@code createUserId}는 신뢰하지 않고 인증 주체의 ID로 덮어쓴다.
     */
    @Transactional(readOnly = true)
    public PageResponse<CmsAssetListResponse> findMyRequestList(
            String currentUserId, CmsAssetRequestListRequest req, PageRequest pageRequest) {

        req.setCreateUserId(currentUserId);

        long total = cmsAssetMapper.countMyList(req);
        List<CmsAssetListResponse> list =
                cmsAssetMapper.findMyList(req, pageRequest.getOffset(), pageRequest.getEndRow());

        return PageResponse.of(list, total, pageRequest.getPage(), pageRequest.getSize());
    }

    /** 결재자 승인 관리 목록 조회 (기본 PENDING 필터는 Mapper XML에서 처리) */
    @Transactional(readOnly = true)
    public PageResponse<CmsAssetListResponse> findApprovalList(
            CmsAssetApprovalListRequest req, PageRequest pageRequest) {

        long total = cmsAssetMapper.countApprovalList(req);
        List<CmsAssetListResponse> list =
                cmsAssetMapper.findApprovalList(req, pageRequest.getOffset(), pageRequest.getEndRow());

        return PageResponse.of(list, total, pageRequest.getPage(), pageRequest.getSize());
    }

    /** 이미지 상세 조회 (모달 프리뷰) */
    @Transactional(readOnly = true)
    public CmsAssetDetailResponse findById(String assetId) {
        CmsAssetDetailResponse detail = cmsAssetMapper.findDetailById(assetId);
        if (detail == null) {
            throw new NotFoundException("이미지를 찾을 수 없습니다. assetId=" + assetId);
        }
        return detail;
    }

    /** 승인 요청 — WORK → PENDING (현업이 본인 이미지에 대해 수행) */
    @Transactional
    public void requestApproval(String assetId, String modifierId, String modifierName) {
        assertTransition(assetId, STATE_WORK, STATE_PENDING);
        int updated = cmsAssetMapper.updateState(assetId, STATE_WORK, STATE_PENDING, null, modifierId, modifierName);
        if (updated != 1) {
            // 선검증 통과 후에도 race 실패 가능 — UPDATE 가드 미커밋 동시 실행 방지
            throw new InvalidStateException("이미 처리된 이미지입니다. assetId=" + assetId);
        }
        log.info("CMS 이미지 승인 요청: assetId={}, modifierId={}", assetId, modifierId);
    }

    /**
     * 승인 — PENDING → APPROVED (결재자) + CMS 파일 배포 (Issue #55).
     *
     * <p>Saga 패턴으로 DB 와 CMS 를 조율한다. CMS 배포 API 가 호출 시점에 DB 의 {@code ASSET_STATE}
     * 가 이미 {@code APPROVED} 여야 하므로, 단일 {@code @Transactional} 로 감싸면 CMS 가 커밋 전
     * PENDING 만 보게 되어 항상 거절된다.
     *
     * <h4>흐름</h4>
     * <ol>
     *   <li>선검증 + UPDATE(PENDING→APPROVED) — {@code TransactionTemplate} 으로 독립 TX 커밋.</li>
     *   <li>{@link CmsBuilderClient#deployAsset(String)} 호출.</li>
     *   <li>성공 → 정상 종료.</li>
     *   <li>실패 → 보상 UPDATE(APPROVED→PENDING) 을 또 다른 독립 TX 로 커밋 후, 원 {@link BaseException}
     *       을 그대로 재던져 502 를 전파. 사용자 관점에서는 "둘 다 실패" 로 보인다.</li>
     * </ol>
     *
     * <h4>한계</h4>
     * <ul>
     *   <li>메인 TX 커밋과 CMS 호출 사이의 짧은 윈도우에 다른 결재자 화면은 {@code APPROVED} 를 볼 수 있다.</li>
     *   <li>보상 UPDATE 자체가 실패하는 초희귀 케이스는 error 로그만 남기고 수동 복구 대상으로 삼는다.</li>
     * </ul>
     */
    public void approve(String assetId, String modifierId, String modifierName) {
        // Step 1: 선검증 + 상태 UPDATE 를 독립 TX 로 커밋. CMS 가 APPROVED 를 읽어야 deploy 가 성공한다.
        transactionTemplate.executeWithoutResult(status -> {
            assertTransition(assetId, STATE_PENDING, STATE_APPROVED);
            int updated =
                    cmsAssetMapper.updateState(assetId, STATE_PENDING, STATE_APPROVED, null, modifierId, modifierName);
            if (updated != 1) {
                // 선검증 통과 후 race 실패 — 예외 던지면 TransactionTemplate 이 롤백.
                throw new InvalidStateException("이미 처리된 이미지입니다. assetId=" + assetId);
            }
        });

        // Step 2: CMS 파일 배포 시도.
        try {
            cmsBuilderClient.deployAsset(assetId);
            log.info("CMS 이미지 승인 + 파일 배포 완료: assetId={}, modifierId={}", assetId, modifierId);
        } catch (BaseException deployEx) {
            // Step 3: 배포 실패 — 승인 상태를 PENDING 으로 보상 롤백.
            log.error("CMS 배포 실패 — 승인 상태 보상 롤백 시도. assetId={}, modifierId={}", assetId, modifierId, deployEx);
            try {
                transactionTemplate.executeWithoutResult(status -> cmsAssetMapper.updateState(
                        assetId, STATE_APPROVED, STATE_PENDING, null, modifierId, modifierName));
            } catch (RuntimeException revertEx) {
                // 보상 실패는 데이터-파일 불일치 상태를 남기므로 수동 복구 알림 차원의 error 로깅.
                log.error("보상 롤백 실패 — 수동 확인 필요. assetId={}", assetId, revertEx);
            }
            throw deployEx;
        }
    }

    /**
     * 이미지 업로드 — Issue #65.
     *
     * <p>Admin 은 파일을 저장하지 않고 CMS Builder 로 포워딩한다.
     * CMS 가 파일 저장 + {@code SPW_CMS_ASSET} INSERT (ASSET_STATE='WORK') 까지 수행하며,
     * Admin 은 응답만 그대로 전달한다.
     *
     * <p>업로더 정보({@code uploaderId/Name})는 {@code @AuthenticationPrincipal} 에서 추출된 값이어야 하며,
     * 클라이언트가 보낸 값은 신뢰하지 않는다 (컨트롤러에서 강제).
     */
    public CmsAssetUploadResponse uploadAsset(
            MultipartFile file, String businessCategory, String assetDesc, String uploaderId, String uploaderName) {

        assetUploadValidator.validate(file);
        CmsBuilderUploadApiResponse cmsResponse =
                cmsBuilderClient.upload(file, uploaderId, uploaderName, businessCategory, assetDesc);
        return CmsAssetUploadResponse.builder()
                .assetId(cmsResponse.getAssetId())
                .url(cmsResponse.getUrl())
                .build();
    }

    /**
     * 이미지 자산 삭제 — Issue #88.
     *
     * <p>다음 3단계 검증을 수행한다:
     * <ol>
     *   <li>존재 확인 — 미존재 시 {@link NotFoundException}</li>
     *   <li>소유자 확인 — 업로더가 아닌 경우 {@link BaseException} (HTTP 403 FORBIDDEN).
     *       악의적 직접 호출로 타인 자산을 삭제하는 IDOR 공격 차단.</li>
     *   <li>상태 가드 — {@code WORK}/{@code REJECTED} 만 허용, 그 외는 {@link InvalidStateException}</li>
     * </ol>
     *
     * <p>Admin 은 DB 를 직접 건드리지 않고 CMS 의 DELETE API 로 위임한다.
     * CMS 가 물리 파일과 {@code SPW_CMS_ASSET} 행을 모두 제거하므로 Admin 측 DB 조작은 없다.
     *
     * <p>관리자(결재자) 우회 삭제 권한은 본 이슈 범위 외 (후속 이슈). 현재 권한 체계상
     * {@code CMS:W} 만으로는 현업·결재자를 구분할 수 없어, 별도 권한 체계 도입과 함께 다룬다.
     *
     * @param assetId 삭제 대상 자산 ID
     * @param userId  삭제 수행자 ID (로그용 + 소유자 검증용)
     * @throws NotFoundException     존재하지 않는 자산
     * @throws BaseException         소유자가 아닌 경우 (FORBIDDEN → 403)
     * @throws InvalidStateException 삭제 불가 상태 (PENDING/APPROVED → 409)
     */
    public void deleteMyAsset(String assetId, String userId) {
        String createUserId = cmsAssetMapper.findCreateUserIdByAssetId(assetId);
        if (createUserId == null) {
            throw new NotFoundException("이미지를 찾을 수 없습니다. assetId=" + assetId);
        }
        if (!createUserId.equals(userId)) {
            // 로그에는 실제 시도자 ID 를 남기되, 예외 메시지에는 소유자 정보를 노출하지 않는다 (정보 누출 방지).
            log.warn("CMS 이미지 삭제 권한 없음 — 소유자 불일치. assetId={}, owner={}, requester={}", assetId, createUserId, userId);
            throw new BaseException(ErrorType.FORBIDDEN, "본인이 업로드한 이미지만 삭제할 수 있습니다.");
        }

        String currentState = cmsAssetMapper.findAssetStateById(assetId);
        if (!STATE_WORK.equals(currentState) && !STATE_REJECTED.equals(currentState)) {
            throw new InvalidStateException(
                    String.format("현재 상태(%s)에서는 삭제할 수 없습니다. 허용 상태=WORK 또는 REJECTED", currentState));
        }

        cmsBuilderClient.delete(assetId, userId);
        log.info("CMS 이미지 삭제 요청 완료: assetId={}, prevState={}, userId={}", assetId, currentState, userId);
    }

    /** 반려 — PENDING → REJECTED (결재자). 반려 사유는 선택 */
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

    /**
     * 현재 상태가 {@code expectedFrom}과 일치하는지 선검증.
     * 존재하지 않으면 {@link NotFoundException}, 상태 불일치이면 {@link InvalidStateException}.
     */
    private void assertTransition(String assetId, String expectedFrom, String target) {
        String current = cmsAssetMapper.findAssetStateById(assetId);
        if (current == null) {
            throw new NotFoundException("이미지를 찾을 수 없습니다. assetId=" + assetId);
        }
        if (!expectedFrom.equals(current)) {
            throw new InvalidStateException(
                    String.format("현재 상태(%s)에서 %s 전이를 수행할 수 없습니다. 필요 상태=%s", current, target, expectedFrom));
        }
    }

    /**
     * 반려 사유 정규화.
     *
     * <p>공백만 있는 문자열은 {@code null}로 취급하고, 문자 수·바이트 수 두 축으로 상한을 검증한다.
     * 바이트 검증은 DB 컬럼이 {@code VARCHAR2(1000 BYTE)} 로 생성된 환경에서도 ORA-12899 를 사전 차단하기 위함.
     */
    private String normalizeReason(String rejectedReason) {
        if (rejectedReason == null) {
            return null;
        }
        String trimmed = rejectedReason.trim();
        if (trimmed.isEmpty()) {
            return null;
        }
        if (trimmed.length() > REJECTED_REASON_MAX_CHARS) {
            throw new InvalidInputException("반려 사유는 " + REJECTED_REASON_MAX_CHARS + "자 이하로 입력하세요.");
        }
        if (trimmed.getBytes(StandardCharsets.UTF_8).length > REJECTED_REASON_MAX_BYTES) {
            throw new InvalidInputException("반려 사유는 UTF-8 기준 " + REJECTED_REASON_MAX_BYTES + "바이트 이하로 입력하세요.");
        }
        return trimmed;
    }
}
