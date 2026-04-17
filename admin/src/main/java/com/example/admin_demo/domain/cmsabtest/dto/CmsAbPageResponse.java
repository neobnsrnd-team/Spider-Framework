package com.example.admin_demo.domain.cmsabtest.dto;

import java.math.BigDecimal;
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
public class CmsAbPageResponse {

    private String pageId;
    private String pageName;
    private String viewMode;
    private String approveState;
    private String isPublic;
    private String createUserName;
    private String lastModifiedDtime;
    private String abGroupId;
    private BigDecimal abWeight;
    private long viewCount;
    private long clickCount;
}
