package com.example.batchwas.job.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 샘플 회원 데이터 모델.
 * File2DBJob(CSV 읽기), DB2DBJob(DB 복사), DB2ForeignJob(외부 연계) 공통으로 사용.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SampleMember {

    /** 회원 ID */
    private Long memberId;

    /** 회원명 */
    private String memberName;

    /** 이메일 */
    private String email;

    /** 전화번호 */
    private String phone;
}
