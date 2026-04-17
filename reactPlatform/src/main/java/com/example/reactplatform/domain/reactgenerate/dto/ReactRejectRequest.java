/**
 * @file ReactRejectRequest.java
 * @description React 코드 반려 요청 DTO.
 *     반려 사유(reason)를 클라이언트로부터 수신한다.
 */
package com.example.reactplatform.domain.reactgenerate.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ReactRejectRequest {

    /**
     * 반려 사유 (선택 입력, 최대 500자).
     * DB 컬럼(FAIL_REASON CLOB)에 저장되며, 프론트 maxlength 우회 방지를 위해 서버에서 재검증한다.
     */
    @Size(max = 500, message = "반려 사유는 500자 이하여야 합니다.")
    private String reason;
}
