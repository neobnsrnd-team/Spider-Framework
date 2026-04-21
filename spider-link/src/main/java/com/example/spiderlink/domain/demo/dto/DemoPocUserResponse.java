package com.example.spiderlink.domain.demo.dto;

import lombok.Data;

/** D_SPIDERLINK.POC_USER 조회 결과 DTO. */
@Data
public class DemoPocUserResponse {

    private String userId;
    private String userName;
    private String userGrade;
    /** 로그인 허용 여부 (Y/N) */
    private String logYn;
    private String lastLoginDtime;
}
