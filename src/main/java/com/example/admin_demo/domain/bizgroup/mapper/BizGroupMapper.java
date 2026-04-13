package com.example.admin_demo.domain.bizgroup.mapper;

import com.example.admin_demo.domain.bizgroup.dto.BizGroupResponse;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BizGroupMapper {

    List<BizGroupResponse> findAll();
}
