package com.example.admin_demo.domain.cmsdeployment.mapper;

import com.example.admin_demo.domain.cmsdeployment.dto.CmsDeployHistoryRequest;
import com.example.admin_demo.domain.cmsdeployment.dto.CmsDeployHistoryResponse;
import com.example.admin_demo.domain.cmsdeployment.dto.CmsDeployPageRequest;
import com.example.admin_demo.domain.cmsdeployment.dto.CmsDeployPageResponse;
import java.util.List;
import org.apache.ibatis.annotations.Param;

/** CMS 배포 관리 Mapper */
public interface CmsDeployMapper {

    // ── 배포 대상 페이지 목록 (APPROVED) ──────────────────────────────────────

    List<CmsDeployPageResponse> findApprovedPageList(
            @Param("req") CmsDeployPageRequest req, @Param("offset") long offset, @Param("endRow") long endRow);

    long countApprovedPageList(@Param("req") CmsDeployPageRequest req);

    // ── 배포 이력 ─────────────────────────────────────────────────────────────

    List<CmsDeployHistoryResponse> findHistoryList(
            @Param("req") CmsDeployHistoryRequest req, @Param("offset") long offset, @Param("endRow") long endRow);

    long countHistoryList(@Param("req") CmsDeployHistoryRequest req);

    // ── 배포 실행 지원 ────────────────────────────────────────────────────────

    /**
     * APPROVE_STATE = 'APPROVED' 인 페이지 HTML 조회.
     * CLOB을 String으로 직접 반환해 커넥션이 열린 상태에서 변환한다.
     * 페이지 미존재 시 null 반환.
     */
    String findApprovedPageHtml(@Param("pageId") String pageId);

    /** FWK_CMS_SERVER_INSTANCE에서 첫 번째 인스턴스 ID 조회 */
    String findFirstInstanceId();

    /** 특정 pageId의 다음 배포 버전 번호 조회 */
    int findNextFileVersion(@Param("pageId") String pageId);

    void insertSendHistory(
            @Param("instanceId") String instanceId,
            @Param("fileId") String fileId,
            @Param("fileSize") long fileSize,
            @Param("fileCrcValue") String fileCrcValue,
            @Param("userId") String userId);
}
