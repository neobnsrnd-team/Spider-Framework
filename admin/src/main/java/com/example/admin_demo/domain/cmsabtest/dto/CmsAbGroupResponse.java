package com.example.admin_demo.domain.cmsabtest.dto;

import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CmsAbGroupResponse {

    private String groupId;

    @Builder.Default
    private List<CmsAbGroupPageResponse> pages = new ArrayList<>();
}
