package com.example.admin_demo.domain.cmsabtest.mapper;

import com.example.admin_demo.domain.cmsabtest.dto.CmsAbGroupPageResponse;
import com.example.admin_demo.domain.cmsabtest.dto.CmsAbPageResponse;
import com.example.admin_demo.domain.cmsabtest.dto.CmsAbTestListRequest;
import java.math.BigDecimal;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CmsAbTestMapper {

    List<CmsAbPageResponse> findApprovedPages(
            @Param("req") CmsAbTestListRequest req, @Param("offset") int offset, @Param("endRow") int endRow);

    long countApprovedPages(@Param("req") CmsAbTestListRequest req);

    List<CmsAbPageResponse> findAbGroupPages(@Param("search") String search);

    List<CmsAbPageResponse> findApprovedPageOptions(@Param("search") String search);

    List<CmsAbGroupPageResponse> findGroupPages(@Param("groupId") String groupId);

    long countGroupPages(@Param("groupId") String groupId);

    long countApprovedPagesByIds(@Param("pageIds") List<String> pageIds);

    long countConflictingPages(@Param("groupId") String groupId, @Param("pageIds") List<String> pageIds);

    long countPageInGroup(@Param("groupId") String groupId, @Param("pageId") String pageId);

    int updateAbGroup(
            @Param("pageId") String pageId,
            @Param("groupId") String groupId,
            @Param("weight") BigDecimal weight,
            @Param("modifierId") String modifierId);

    int clearAbGroup(@Param("groupId") String groupId, @Param("modifierId") String modifierId);

    int clearPageAbGroup(@Param("pageId") String pageId, @Param("modifierId") String modifierId);

    int promoteLosers(
            @Param("groupId") String groupId,
            @Param("winnerPageId") String winnerPageId,
            @Param("modifierId") String modifierId);

    int setWinner(@Param("winnerPageId") String winnerPageId, @Param("modifierId") String modifierId);
}
