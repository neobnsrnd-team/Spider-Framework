package com.example.admin_demo.domain.bizgroup.service;

import com.example.admin_demo.domain.bizgroup.dto.BizGroupResponse;
import com.example.admin_demo.domain.bizgroup.mapper.BizGroupMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BizGroupService {

    private final BizGroupMapper bizGroupMapper;

    public List<BizGroupResponse> getAllBizGroups() {
        return bizGroupMapper.findAll();
    }
}
