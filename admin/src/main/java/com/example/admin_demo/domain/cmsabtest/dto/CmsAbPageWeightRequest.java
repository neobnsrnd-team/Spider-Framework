package com.example.admin_demo.domain.cmsabtest.dto;

import java.math.BigDecimal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CmsAbPageWeightRequest {

    private String pageId;

    private BigDecimal weight;
}
