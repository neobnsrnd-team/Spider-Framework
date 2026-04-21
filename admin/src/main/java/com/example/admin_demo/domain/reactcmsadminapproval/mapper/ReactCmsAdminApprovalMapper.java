package com.example.admin_demo.domain.reactcmsadminapproval.mapper;

import com.example.admin_demo.domain.reactcmsadminapproval.dto.ReactCmsAdminApprovalListRequest;
import com.example.admin_demo.domain.reactcmsadminapproval.dto.ReactCmsAdminApprovalListResponse;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * React CMS Admin 승인 관리 Mapper
 */
@Mapper
public interface ReactCmsAdminApprovalMapper {

    /** 승인 관리 목록 페이징 조회 */
    List<ReactCmsAdminApprovalListResponse> findPageList(
            @Param("req") ReactCmsAdminApprovalListRequest req,
            @Param("offset") int offset,
            @Param("endRow") int endRow);

    /** 승인 관리 목록 건수 */
    long countPageList(@Param("req") ReactCmsAdminApprovalListRequest req);
}
