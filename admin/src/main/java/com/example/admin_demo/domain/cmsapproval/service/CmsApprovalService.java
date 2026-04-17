package com.example.admin_demo.domain.cmsapproval.service;

import com.example.admin_demo.domain.cmsapproval.dto.CmsApprovalHistoryResponse;
import com.example.admin_demo.domain.cmsapproval.dto.CmsApprovalListRequest;
import com.example.admin_demo.domain.cmsapproval.dto.CmsApprovalPageResponse;
import com.example.admin_demo.domain.cmsapproval.dto.CmsApproveRequest;
import com.example.admin_demo.domain.cmsapproval.dto.CmsDisplayPeriodRequest;
import com.example.admin_demo.domain.cmsapproval.dto.CmsPublicStateRequest;
import com.example.admin_demo.domain.cmsapproval.dto.CmsRejectRequest;
import com.example.admin_demo.domain.cmsapproval.dto.CmsRollbackRequest;
import com.example.admin_demo.domain.cmsapproval.mapper.CmsApprovalMapper;
import com.example.admin_demo.global.dto.PageRequest;
import com.example.admin_demo.global.dto.PageResponse;
import com.example.admin_demo.global.exception.InvalidInputException;
import com.example.admin_demo.global.exception.NotFoundException;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * CMS 승인 관리 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CmsApprovalService {

    private final CmsApprovalMapper cmsApprovalMapper;

    /** 승인 관리 목록 조회 */
    public PageResponse<CmsApprovalPageResponse> findPageList(CmsApprovalListRequest req, PageRequest pageRequest) {

        long total = cmsApprovalMapper.countPageList(req);
        List<CmsApprovalPageResponse> list =
                cmsApprovalMapper.findPageList(req, pageRequest.getOffset(), pageRequest.getEndRow());

        return PageResponse.of(list, total, pageRequest.getPage(), pageRequest.getSize());
    }

    /**
     * 승인 확정 — APPROVE_STATE: PENDING → APPROVED
     * 상태를 먼저 변경한 뒤 변경 후 상태를 이력 스냅샷으로 저장한다.
     */
    @Transactional
    public void approve(String pageId, CmsApproveRequest req, String modifierId) {
        checkPageExists(pageId);
        validateDisplayPeriod(req.getBeginningDate(), req.getExpiredDate());
        cmsApprovalMapper.approve(pageId, req.getBeginningDate(), req.getExpiredDate(), modifierId);
        int version = cmsApprovalMapper.getNextVersion(pageId);
        cmsApprovalMapper.insertHistory(pageId, version);
        log.info("CMS 페이지 승인 완료: pageId={}, version={}, modifierId={}", pageId, version, modifierId);
    }

    /**
     * 반려 — APPROVE_STATE: PENDING → REJECTED
     * 상태를 먼저 변경한 뒤 변경 후 상태를 이력 스냅샷으로 저장한다.
     */
    @Transactional
    public void reject(String pageId, CmsRejectRequest req, String modifierId) {
        checkPageExists(pageId);
        cmsApprovalMapper.reject(pageId, req.getRejectedReason(), modifierId);
        int version = cmsApprovalMapper.getNextVersion(pageId);
        cmsApprovalMapper.insertHistory(pageId, version);
        log.info("CMS 페이지 반려 완료: pageId={}, version={}, modifierId={}", pageId, version, modifierId);
    }

    /** 공개 상태 변경 */
    @Transactional
    public void updatePublicState(String pageId, CmsPublicStateRequest req, String modifierId) {
        checkPageExists(pageId);
        cmsApprovalMapper.updatePublicState(pageId, req.getIsPublic(), modifierId);
    }

    /** 노출 기간 수정 */
    @Transactional
    public void updateDisplayPeriod(String pageId, CmsDisplayPeriodRequest req, String modifierId) {
        checkPageExists(pageId);
        cmsApprovalMapper.updateDisplayPeriod(pageId, req.getBeginningDate(), req.getExpiredDate(), modifierId);
    }

    /** 승인 이력 목록 조회 */
    public List<CmsApprovalHistoryResponse> findHistoryList(String pageId) {
        checkPageExists(pageId);
        return cmsApprovalMapper.findHistoryList(pageId);
    }

    /**
     * 롤백 — 지정 버전 이력으로 SPW_CMS_PAGE 복원, APPROVE_STATE → WORK
     */
    @Transactional
    public void rollback(String pageId, CmsRollbackRequest req, String modifierId) {
        checkPageExists(pageId);
        Map<String, Object> history = cmsApprovalMapper.findHistoryByVersion(pageId, req.getVersion());
        if (history == null) {
            throw new NotFoundException("해당 버전의 이력을 찾을 수 없습니다. pageId=" + pageId + ", version=" + req.getVersion());
        }
        String pageHtml = (String) history.get("PAGE_HTML");
        String filePath = (String) history.get("FILE_PATH");
        cmsApprovalMapper.rollback(pageId, pageHtml, filePath, modifierId);
        log.info("CMS 페이지 롤백 완료: pageId={}, version={}, modifierId={}", pageId, req.getVersion(), modifierId);
    }

    private void checkPageExists(String pageId) {
        if (cmsApprovalMapper.existsByPageId(pageId) == 0) {
            throw new NotFoundException("페이지를 찾을 수 없습니다. pageId=" + pageId);
        }
    }

    private void validateDisplayPeriod(String beginningDate, String expiredDate) {
        if (beginningDate == null || beginningDate.isBlank()) {
            throw new InvalidInputException("노출 시작일을 입력하세요.");
        }
        if (expiredDate == null || expiredDate.isBlank()) {
            throw new InvalidInputException("노출 종료일을 입력하세요.");
        }

        LocalDate beginning = parseDate(beginningDate, "노출 시작일");
        LocalDate expired = parseDate(expiredDate, "노출 종료일");
        if (expired.isBefore(beginning)) {
            throw new InvalidInputException("노출 종료일은 시작일보다 빠를 수 없습니다.");
        }
    }

    private LocalDate parseDate(String value, String label) {
        try {
            return LocalDate.parse(value);
        } catch (DateTimeParseException ex) {
            throw new InvalidInputException(label + "은 YYYY-MM-DD 형식이어야 합니다.");
        }
    }
}
