package com.example.admin_demo.domain.cmsabtest.dto;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CmsAbGroupSaveRequest {

    private String groupId;

    private List<CmsAbPageWeightRequest> pages = new ArrayList<>();
}
