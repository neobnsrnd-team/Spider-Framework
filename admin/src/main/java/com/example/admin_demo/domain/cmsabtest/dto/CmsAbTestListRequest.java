package com.example.admin_demo.domain.cmsabtest.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CmsAbTestListRequest {

    private String search;
    private String sortBy;
    private String sortDirection;
}
