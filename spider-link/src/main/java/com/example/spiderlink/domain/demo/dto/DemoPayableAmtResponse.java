package com.example.spiderlink.domain.demo.dto;

import lombok.Data;

/** D_SPIDERLINK.POC_카드사용내역 / POC_카드리스트 조회 결과 DTO. */
@Data
public class DemoPayableAmtResponse {

    private long payableAmount;
    private long creditLimit;
}
