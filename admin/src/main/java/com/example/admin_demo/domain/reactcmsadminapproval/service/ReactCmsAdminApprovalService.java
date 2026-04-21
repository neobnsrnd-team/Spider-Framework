package com.example.admin_demo.domain.reactcmsadminapproval.service;

import com.example.admin_demo.domain.reactcmsadminapproval.dto.ReactCmsAdminApprovalListRequest;
import com.example.admin_demo.domain.reactcmsadminapproval.dto.ReactCmsAdminApprovalListResponse;
import com.example.admin_demo.domain.reactcmsadminapproval.mapper.ReactCmsAdminApprovalMapper;
import com.example.admin_demo.global.dto.PageRequest;
import com.example.admin_demo.global.dto.PageResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * React CMS Admin 승인 관리 서비스
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReactCmsAdminApprovalService {

    private final ReactCmsAdminApprovalMapper reactCmsAdminApprovalMapper;

    /** 승인 관리 목록 조회 */
    public PageResponse<ReactCmsAdminApprovalListResponse> findPageList(
            ReactCmsAdminApprovalListRequest req, PageRequest pageRequest) {

        long total = reactCmsAdminApprovalMapper.countPageList(req);
        List<ReactCmsAdminApprovalListResponse> list =
                reactCmsAdminApprovalMapper.findPageList(req, pageRequest.getOffset(), pageRequest.getEndRow());

        return PageResponse.of(list, total, pageRequest.getPage(), pageRequest.getSize());
    }
}
