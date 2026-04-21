package com.example.admin_demo.domain.reactcmsadmindeployment.mapper;

import com.example.admin_demo.domain.reactcmsadmindeployment.dto.ReactCmsAdminDeployHistoryRequest;
import com.example.admin_demo.domain.reactcmsadmindeployment.dto.ReactCmsAdminDeployHistoryResponse;
import com.example.admin_demo.domain.reactcmsadmindeployment.dto.ReactCmsAdminDeployPageRequest;
import com.example.admin_demo.domain.reactcmsadmindeployment.dto.ReactCmsAdminDeployPageResponse;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/** React CMS Admin 배포 관리 Mapper */
public interface ReactCmsAdminDeployMapper {

    // ── 배포 대상 페이지 목록 (PAGE_TYPE='REACT', APPROVED) ──────────────────────

    List<ReactCmsAdminDeployPageResponse> findApprovedPageList(
            @Param("req") ReactCmsAdminDeployPageRequest req,
            @Param("offset") long offset,
            @Param("endRow") long endRow);

    long countApprovedPageList(@Param("req") ReactCmsAdminDeployPageRequest req);

    // ── 배포 이력 ─────────────────────────────────────────────────────────────

    List<ReactCmsAdminDeployHistoryResponse> findHistoryList(
            @Param("req") ReactCmsAdminDeployHistoryRequest req,
            @Param("offset") long offset,
            @Param("endRow") long endRow);

    long countHistoryList(@Param("req") ReactCmsAdminDeployHistoryRequest req);

    // ── 배포 실행 지원 ────────────────────────────────────────────────────────

    /**
     * PAGE_TYPE='REACT', APPROVE_STATE='APPROVED' 인 페이지 HTML 조회.
     * CLOB을 String으로 직접 반환해 커넥션이 열린 상태에서 변환한다.
     * 페이지 미존재 시 null 반환.
     */
    String findApprovedPageHtml(@Param("pageId") String pageId);
}
