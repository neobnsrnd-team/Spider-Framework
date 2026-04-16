/**
 * @file ReactRejectRequest.java
 * @description React 코드 반려 요청 DTO.
 *     반려 사유(reason)를 클라이언트로부터 수신한다.
 */
package com.example.admin_demo.domain.reactgenerate.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ReactRejectRequest {

    /** 반려 사유 (선택 입력, 최대 500자) */
    private String reason;
}
