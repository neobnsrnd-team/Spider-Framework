/**
 * @file ReactApprovalService.java
 * @description React 코드 승인 워크플로우를 전담하는 서비스.
 *     승인 대기 목록 조회, 승인, 반려 세 가지 오퍼레이션을 제공한다.
 *     승인 시 요청자 본인 여부를 서버에서 검증하여 클라이언트 우회를 방지한다.
 */
package com.example.admin_demo.domain.reactgenerate.service;

import com.example.admin_demo.domain.reactgenerate.dto.ReactApprovalResponse;
import com.example.admin_demo.domain.reactgenerate.dto.ReactGenerateApprovalResponse;
import com.example.admin_demo.domain.reactgenerate.dto.ReactGenerateHistoryResponse;
import com.example.admin_demo.domain.reactgenerate.dto.ReactGenerateResponse;
import com.example.admin_demo.domain.reactgenerate.enums.ReactGenerateStatus;
import com.example.admin_demo.domain.reactgenerate.mapper.ReactGenerateMapper;
import com.example.admin_demo.global.exception.InvalidInputException;
import com.example.admin_demo.global.exception.NotFoundException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReactApprovalService {

    private final ReactGenerateMapper reactGenerateMapper;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    /**
     * 승인 대기(PENDING_APPROVAL) 목록과 전체 건수를 조회한다.
     *
     * @param page 페이지 번호 (1-based)
     * @param size 페이지당 건수
     * @return list(목록), totalCount(전체 건수), page, size
     */
    public Map<String, Object> getPendingList(int page, int size) {
        int offset = (page - 1) * size;
        int endRow = offset + size;
        List<ReactApprovalResponse> list = reactGenerateMapper.selectPendingList(offset, endRow);
        int totalCount = reactGenerateMapper.selectPendingCount();
        return Map.of("list", list, "totalCount", totalCount, "page", page, "size", size);
    }

    /**
     * 코드를 승인한다.
     *
     * <p>승인 조건:
     * <ul>
     *   <li>STATUS가 PENDING_APPROVAL인 코드만 승인 가능</li>
     *   <li>코드 요청자 본인은 승인 불가 — 클라이언트 우회 방지를 위해 서버에서 재검증</li>
     * </ul>
     *
     * @param id            승인할 코드 ID
     * @param approverUserId 승인자 ID (로그인 사용자)
     * @throws NotFoundException      해당 codeId가 존재하지 않을 때
     * @throws InvalidInputException  PENDING_APPROVAL이 아닌 상태이거나 요청자 본인일 때
     */
    public ReactGenerateApprovalResponse approve(String id, String approverUserId) {
        ReactGenerateResponse existing = requirePendingApproval(id);

        // 코드 요청자와 승인자가 동일한 경우 거부 — 클라이언트 우회 방지
        if (approverUserId.equals(existing.getCreateUserId())) {
            throw new InvalidInputException("코드 요청자는 승인할 수 없습니다.");
        }

        String now = LocalDateTime.now().format(FORMATTER);
        reactGenerateMapper.updateStatus(id, ReactGenerateStatus.APPROVED.name(), approverUserId, now);
        log.info("승인 완료 — codeId: {}, approver: {}", id, approverUserId);

        return ReactGenerateApprovalResponse.builder()
                .codeId(id)
                .status(ReactGenerateStatus.APPROVED.name())
                .approvalUserId(approverUserId)
                .approvalDtime(now)
                .build();
    }

    /**
     * 코드를 반려한다.
     *
     * <p>반려는 상태에 관계없이 어느 단계에서든 가능하다.
     * (PENDING_APPROVAL, GENERATED, APPROVED 모두 반려 가능)
     *
     * @param id             반려할 코드 ID
     * @param rejectorUserId 반려자 ID (로그인 사용자)
     * @throws NotFoundException 해당 codeId가 존재하지 않을 때
     */
    public ReactGenerateApprovalResponse reject(String id, String rejectorUserId) {
        requireExists(id);

        String now = LocalDateTime.now().format(FORMATTER);
        reactGenerateMapper.updateStatus(id, ReactGenerateStatus.REJECTED.name(), rejectorUserId, now);
        log.info("반려 완료 — codeId: {}, rejector: {}", id, rejectorUserId);

        return ReactGenerateApprovalResponse.builder()
                .codeId(id)
                .status(ReactGenerateStatus.REJECTED.name())
                .approvalUserId(rejectorUserId)
                .approvalDtime(now)
                .build();
    }

    /**
     * 승인 이력(APPROVED / REJECTED) 목록과 전체 건수를 조회한다.
     *
     * @param page           페이지 번호 (1-based)
     * @param size           페이지당 건수
     * @param status         상태 필터 (null/빈 문자열이면 전체)
     * @param approvalUserId 처리자 ID 부분 일치 검색
     * @param createUserId   요청자 ID 부분 일치 검색
     * @param fromDate       처리일시 시작 (yyyyMMdd)
     * @param toDate         처리일시 종료 (yyyyMMdd)
     * @return list(목록), totalCount(전체 건수), page, size
     */
    public Map<String, Object> getHistory(
            int page,
            int size,
            String status,
            String approvalUserId,
            String createUserId,
            String fromDate,
            String toDate) {
        int offset = (page - 1) * size;
        int endRow = offset + size;
        // 빈 문자열은 null로 통일하여 mapper의 전체 조회 분기를 타도록 한다
        String s = nullIfBlank(status);
        String au = nullIfBlank(approvalUserId);
        String cu = nullIfBlank(createUserId);
        String fd = nullIfBlank(fromDate);
        String td = nullIfBlank(toDate);
        List<ReactGenerateHistoryResponse> list =
                reactGenerateMapper.selectApprovalHistory(offset, endRow, s, au, cu, fd, td);
        int totalCount = reactGenerateMapper.selectApprovalHistoryCount(s, au, cu, fd, td);
        return Map.of("list", list, "totalCount", totalCount, "page", page, "size", size);
    }

    /** null이거나 공백만 있으면 null, 아니면 원본 문자열 반환. */
    private static String nullIfBlank(String value) {
        return (value != null && !value.isBlank()) ? value : null;
    }

    /** CODE_ID로 이력을 조회하고, PENDING_APPROVAL 상태가 아니면 예외를 던진다. */
    private ReactGenerateResponse requirePendingApproval(String id) {
        ReactGenerateResponse response = reactGenerateMapper.selectById(id);
        if (response == null) {
            throw new NotFoundException("생성 결과를 찾을 수 없습니다. codeId=" + id);
        }
        if (!ReactGenerateStatus.PENDING_APPROVAL.name().equals(response.getStatus())) {
            throw new InvalidInputException("승인 대기 상태인 코드만 승인할 수 있습니다. 현재 상태: " + response.getStatus());
        }
        return response;
    }

    /** CODE_ID로 이력을 조회하고, 없으면 NotFoundException을 던진다. */
    private void requireExists(String id) {
        if (reactGenerateMapper.selectById(id) == null) {
            throw new NotFoundException("생성 결과를 찾을 수 없습니다. codeId=" + id);
        }
    }
}
