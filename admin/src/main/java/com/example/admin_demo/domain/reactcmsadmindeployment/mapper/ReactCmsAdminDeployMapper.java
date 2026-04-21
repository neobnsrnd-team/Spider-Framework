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
     * PAGE_TYPE='REACT', APPROVE_STATE='APPROVED' 인 페이지 존재 여부 확인.
     * CLOB 전체 조회 대신 COUNT 쿼리를 사용해 대용량 데이터 로드를 방지한다.
     * 0이면 미존재, 1이면 존재.
     */
    int existsApprovedPage(@Param("pageId") String pageId);
}
