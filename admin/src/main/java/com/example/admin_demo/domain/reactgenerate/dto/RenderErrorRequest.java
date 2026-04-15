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

    /** 브라우저에서 catch한 오류 메시지 (String(e)) */
    private String errorMessage;
}
