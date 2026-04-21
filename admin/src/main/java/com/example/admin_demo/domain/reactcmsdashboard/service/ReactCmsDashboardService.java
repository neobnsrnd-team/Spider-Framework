package com.example.admin_demo.domain.reactcmsdashboard.service;

import com.example.admin_demo.domain.reactcmsdashboard.dto.ReactCmsApprovalStatusResponse;
import com.example.admin_demo.domain.reactcmsdashboard.dto.ReactCmsDashboardApproveRequestDto;
import com.example.admin_demo.domain.reactcmsdashboard.dto.ReactCmsDashboardListRequest;
import com.example.admin_demo.domain.reactcmsdashboard.dto.ReactCmsDashboardPageResponse;
import com.example.admin_demo.domain.reactcmsdashboard.mapper.ReactCmsDashboardMapper;
import com.example.admin_demo.global.dto.PageRequest;
import com.example.admin_demo.global.dto.PageResponse;
import com.example.admin_demo.global.exception.InvalidInputException;
import com.example.admin_demo.global.exception.NotFoundException;
import java.util.List;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * React CMS 사용자 대시보드 서비스
 *
 * <p>로그인한 사용자가 본인이 생성한 React CMS 페이지(PAGE_TYPE='REACT')를 조회·삭제·승인 요청할 수 있다.
 * 새 페이지 생성은 react-cms 빌더(/react-cms/builder)에서 직접 수행한다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReactCmsDashboardService {

    private final ReactCmsDashboardMapper reactCmsDashboardMapper;

    /** 내 페이지 목록 조회 */
    public PageResponse<ReactCmsDashboardPageResponse> findMyPageList(
            ReactCmsDashboardListRequest req, String userId, PageRequest pageRequest) {

        long total = reactCmsDashboardMapper.countMyPageList(req, userId);
        List<ReactCmsDashboardPageResponse> list =
                reactCmsDashboardMapper.findMyPageList(req, userId, pageRequest.getOffset(), pageRequest.getEndRow());

        return PageResponse.of(list, total, pageRequest.getPage(), pageRequest.getSize());
    }

    /**
     * 페이지 삭제
     *
     * <p>이력이 있으면 소프트 삭제(USE_YN='N'), 없으면 하드 삭제(물리 행 삭제).
     * DELETE/UPDATE 쿼리에 소유권 조건(CREATE_USER_ID)을 포함하여 결과를 검증함으로써
     * checkPageOwner와 실제 삭제 사이의 Race Condition을 방지한다.
     */
    @Transactional
    public void deletePage(String pageId, String userId) {
        int historyCount = reactCmsDashboardMapper.hasHistory(pageId);
        int affected;
        if (historyCount > 0) {
            affected = reactCmsDashboardMapper.deleteSoft(pageId, userId);
            log.info("React CMS 페이지 소프트 삭제 (이력 존재): pageId={}, userId={}", pageId, userId);
        } else {
            affected = reactCmsDashboardMapper.deleteHard(pageId, userId);
            log.info("React CMS 페이지 하드 삭제 (이력 없음): pageId={}, userId={}", pageId, userId);
        }
        // 소유권 불일치 또는 이미 삭제된 경우 0 반환 → 404
        if (affected == 0) {
            throw new NotFoundException("페이지를 찾을 수 없습니다.");
        }
    }

    /** 페이지 승인 상태 조회 — react-cms 빌더가 편집 모드 진입 시 호출 */
    public ReactCmsApprovalStatusResponse findApprovalStatus(String pageId) {
        ReactCmsApprovalStatusResponse status = reactCmsDashboardMapper.findApprovalStatus(pageId);
        if (status == null) {
            log.debug("페이지를 찾을 수 없습니다. pageId={}", pageId);
            throw new NotFoundException("페이지를 찾을 수 없습니다.");
        }
        return status;
    }

    /** 승인 요청 — APPROVE_STATE: WORK / REJECTED / APPROVED → PENDING */
    @Transactional
    public void requestApproval(String pageId, ReactCmsDashboardApproveRequestDto req, String userId) {
        checkPageOwner(pageId, userId);

        // 시작일·종료일 대소 검증 — Jackson이 형식 오류를 400으로 처리하므로 여기서는 논리 검증만
        LocalDate beginning = req.getBeginningDate();
        LocalDate expired   = req.getExpiredDate();
        if (beginning != null && expired != null && expired.isBefore(beginning)) {
            throw new InvalidInputException("종료일은 시작일 이후여야 합니다.");
        }

        // 클라이언트 전달값 대신 DB에서 직접 승인자 이름 조회 — 위변조 방지
        String approverName = reactCmsDashboardMapper.findApproverNameById(req.getApproverId());
        if (approverName == null) {
            log.debug("유효하지 않은 승인자입니다. approverId={}", req.getApproverId());
            throw new InvalidInputException("유효하지 않은 승인자입니다.");
        }

        reactCmsDashboardMapper.requestApproval(
                pageId, req.getApproverId(), approverName, beginning, expired, userId);
        log.info("React CMS 페이지 승인 요청: pageId={}, approverId={}, userId={}", pageId, req.getApproverId(), userId);
    }

    /** 페이지 소유권 확인 — 존재하지 않거나 본인 REACT 페이지가 아니면 예외 */
    private void checkPageOwner(String pageId, String userId) {
        if (reactCmsDashboardMapper.existsByPageIdAndUserId(pageId, userId) == 0) {
            log.debug("페이지를 찾을 수 없습니다. pageId={}, userId={}", pageId, userId);
            throw new NotFoundException("페이지를 찾을 수 없습니다.");
        }
    }
}
