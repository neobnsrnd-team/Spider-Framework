package com.example.admin_demo.domain.reactgenerate.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Preview App에서 발생한 렌더링 오류를 서버로 전달하기 위한 요청 DTO. */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RenderErrorRequest {

    /** 렌더링에 실패한 코드의 CODE_ID — FWK_RPS_CODE_HIS 레코드 특정에 사용 */
    private String codeId;

    /** 브라우저에서 catch한 오류 메시지 (String(e)) */
    private String errorMessage;
}
