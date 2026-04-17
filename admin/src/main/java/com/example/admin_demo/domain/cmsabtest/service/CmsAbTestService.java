package com.example.admin_demo.domain.cmsabtest.service;

import com.example.admin_demo.domain.cmsabtest.dto.CmsAbGroupPageResponse;
import com.example.admin_demo.domain.cmsabtest.dto.CmsAbGroupResponse;
import com.example.admin_demo.domain.cmsabtest.dto.CmsAbGroupSaveRequest;
import com.example.admin_demo.domain.cmsabtest.dto.CmsAbPageResponse;
import com.example.admin_demo.domain.cmsabtest.dto.CmsAbPageWeightRequest;
import com.example.admin_demo.domain.cmsabtest.dto.CmsAbTestDashboardResponse;
import com.example.admin_demo.domain.cmsabtest.dto.CmsAbTestListRequest;
import com.example.admin_demo.domain.cmsabtest.dto.CmsAbWeightUpdateRequest;
import com.example.admin_demo.domain.cmsabtest.mapper.CmsAbTestMapper;
import com.example.admin_demo.global.dto.PageRequest;
import com.example.admin_demo.global.dto.PageResponse;
import com.example.admin_demo.global.exception.InvalidInputException;
import com.example.admin_demo.global.exception.NotFoundException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CmsAbTestService {

    private static final Pattern GROUP_ID_PATTERN = Pattern.compile("^[a-z0-9-]{1,64}$");

    private final CmsAbTestMapper cmsAbTestMapper;

    public CmsAbTestDashboardResponse findDashboard(CmsAbTestListRequest req, PageRequest pageRequest) {
        req.setSearch(normalize(req.getSearch()));
        long total = cmsAbTestMapper.countApprovedPages(req);
        List<CmsAbPageResponse> pages =
                cmsAbTestMapper.findApprovedPages(req, pageRequest.getOffset(), pageRequest.getEndRow());
        List<CmsAbPageResponse> groupSourcePages = cmsAbTestMapper.findAbGroupPages(req.getSearch());
        List<CmsAbPageResponse> availablePages = cmsAbTestMapper.findApprovedPageOptions(req.getSearch());
        Map<String, CmsAbGroupResponse> groupMap = new LinkedHashMap<>();

        for (CmsAbPageResponse page : groupSourcePages) {
            if (page.getAbGroupId() == null || page.getAbGroupId().isBlank()) {
                continue;
            }
            CmsAbGroupResponse group =
                    groupMap.computeIfAbsent(page.getAbGroupId(), groupId -> CmsAbGroupResponse.builder()
                            .groupId(groupId)
                            .pages(new ArrayList<>())
                            .build());
            group.getPages()
                    .add(CmsAbGroupPageResponse.builder()
                            .pageId(page.getPageId())
                            .pageName(page.getPageName())
                            .viewMode(page.getViewMode())
                            .isPublic(page.getIsPublic())
                            .abWeight(page.getAbWeight())
                            .viewCount(page.getViewCount())
                            .clickCount(page.getClickCount())
                            .build());
        }

        return CmsAbTestDashboardResponse.builder()
                .pages(PageResponse.of(pages, total, pageRequest.getPage(), pageRequest.getSize()))
                .availablePages(availablePages)
                .groups(new ArrayList<>(groupMap.values()))
                .build();
    }

    public CmsAbGroupResponse findGroup(String groupId) {
        validateGroupId(groupId);
        return CmsAbGroupResponse.builder()
                .groupId(groupId)
                .pages(cmsAbTestMapper.findGroupPages(groupId))
                .build();
    }

    @Transactional
    public void saveGroup(CmsAbGroupSaveRequest req, String modifierId) {
        validateGroupId(req.getGroupId());
        boolean existingGroup = cmsAbTestMapper.countGroupPages(req.getGroupId()) > 0;
        List<CmsAbPageWeightRequest> pages = validatePages(req.getPages(), true, existingGroup);
        validateApprovedPages(pages);
        validateNoOtherGroupConflict(req.getGroupId(), pages);

        cmsAbTestMapper.clearAbGroup(req.getGroupId(), modifierId);
        for (CmsAbPageWeightRequest page : pages) {
            int updated =
                    cmsAbTestMapper.updateAbGroup(page.getPageId(), req.getGroupId(), page.getWeight(), modifierId);
            if (updated == 0) {
                throw new InvalidInputException("A/B group cannot include page: " + page.getPageId());
            }
        }
    }

    @Transactional
    public void updateWeights(String groupId, CmsAbWeightUpdateRequest req, String modifierId) {
        validateGroupExists(groupId);
        List<CmsAbPageWeightRequest> pages = validatePages(req.getPages(), true, true);
        validateAllPagesBelongToGroup(groupId, pages);

        for (CmsAbPageWeightRequest page : pages) {
            cmsAbTestMapper.updateAbGroup(page.getPageId(), groupId, page.getWeight(), modifierId);
        }
    }

    @Transactional
    public void clearGroup(String groupId, String modifierId) {
        validateGroupExists(groupId);
        cmsAbTestMapper.clearAbGroup(groupId, modifierId);
    }

    @Transactional
    public void clearPage(String pageId, String modifierId) {
        validateText(pageId, "pageId is required.");
        int updated = cmsAbTestMapper.clearPageAbGroup(pageId, modifierId);
        if (updated == 0) {
            throw new NotFoundException("A/B page not found: " + pageId);
        }
    }

    @Transactional
    public void promote(String groupId, String winnerPageId, String modifierId) {
        validateGroupExists(groupId);
        validateText(winnerPageId, "winnerPageId is required.");
        if (cmsAbTestMapper.countPageInGroup(groupId, winnerPageId) == 0) {
            throw new InvalidInputException("winnerPageId does not belong to group: " + groupId);
        }
        cmsAbTestMapper.promoteLosers(groupId, winnerPageId, modifierId);
        cmsAbTestMapper.setWinner(winnerPageId, modifierId);
    }

    private void validateGroupExists(String groupId) {
        validateGroupId(groupId);
        if (cmsAbTestMapper.countGroupPages(groupId) == 0) {
            throw new NotFoundException("A/B group not found: " + groupId);
        }
    }

    private void validateApprovedPages(List<CmsAbPageWeightRequest> pages) {
        List<String> pageIds =
                pages.stream().map(CmsAbPageWeightRequest::getPageId).toList();
        if (cmsAbTestMapper.countApprovedPagesByIds(pageIds) != pageIds.size()) {
            throw new InvalidInputException("Only approved public pages can be used for A/B tests.");
        }
    }

    private void validateNoOtherGroupConflict(String groupId, List<CmsAbPageWeightRequest> pages) {
        List<String> pageIds =
                pages.stream().map(CmsAbPageWeightRequest::getPageId).toList();
        if (cmsAbTestMapper.countConflictingPages(groupId, pageIds) > 0) {
            throw new InvalidInputException("One or more pages already belong to another A/B group.");
        }
    }

    private void validateAllPagesBelongToGroup(String groupId, List<CmsAbPageWeightRequest> pages) {
        for (CmsAbPageWeightRequest page : pages) {
            if (cmsAbTestMapper.countPageInGroup(groupId, page.getPageId()) == 0) {
                throw new InvalidInputException("Page does not belong to A/B group: " + page.getPageId());
            }
        }
    }

    private List<CmsAbPageWeightRequest> validatePages(
            List<CmsAbPageWeightRequest> pages, boolean requireAtLeastTwo, boolean allowZeroWeight) {
        if (pages == null || pages.size() < (requireAtLeastTwo ? 2 : 1)) {
            throw new InvalidInputException("At least two pages are required.");
        }

        Set<String> pageIds = new HashSet<>();
        boolean hasPositiveWeight = false;
        for (CmsAbPageWeightRequest page : pages) {
            if (page == null) {
                throw new InvalidInputException("Page item is required.");
            }
            validateText(page.getPageId(), "pageId is required.");
            if (!pageIds.add(page.getPageId())) {
                throw new InvalidInputException("Duplicate pageId is not allowed: " + page.getPageId());
            }
            if (page.getWeight() == null) {
                throw new InvalidInputException("weight is required.");
            }
            if (page.getWeight().compareTo(BigDecimal.ZERO) < 0
                    || (!allowZeroWeight && page.getWeight().compareTo(BigDecimal.ZERO) == 0)) {
                throw new InvalidInputException(
                        allowZeroWeight ? "weight must be zero or greater." : "weight must be greater than zero.");
            }
            if (page.getWeight().compareTo(new BigDecimal("999.99")) > 0) {
                throw new InvalidInputException("weight must be 999.99 or less.");
            }
            if (page.getWeight().compareTo(BigDecimal.ZERO) > 0) {
                hasPositiveWeight = true;
            }
        }
        if (!hasPositiveWeight) {
            throw new InvalidInputException("At least one page must have a positive weight.");
        }
        return pages;
    }

    private void validateGroupId(String groupId) {
        validateText(groupId, "groupId is required.");
        if (!GROUP_ID_PATTERN.matcher(groupId).matches()) {
            throw new InvalidInputException(
                    "groupId must use lowercase letters, numbers, or hyphens and be 64 chars or less.");
        }
    }

    private void validateText(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new InvalidInputException(message);
        }
    }

    private String normalize(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
