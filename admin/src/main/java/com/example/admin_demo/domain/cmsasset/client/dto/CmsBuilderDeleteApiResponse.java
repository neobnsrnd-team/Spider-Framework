package com.example.admin_demo.domain.cmsasset.client.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * CMS Builder /cms/api/assets/{assetId} DELETE 응답 스키마 — Issue #88.
 *
 * <p>업로드 API 와 동일 규약을 가정한다: CMS 는 실패 시에도 HTTP 200 을 반환하며
 * body 의 {@code ok:false} 로 실패를 표현할 수 있다. 성공 응답은 {@code ok} 필드가
 * 생략된 빈 body 또는 {@code {"ok": true}} 형태일 수 있으므로, 실패가 아니면 성공으로 본다.
 *
 * <p>성공 body 예: {@code {}} 또는 {@code {"ok": true}}
 * <p>실패 body 예: {@code {"ok": false, "error": "not found"}}
 */
@Getter
@Setter
@NoArgsConstructor
public class CmsBuilderDeleteApiResponse {

    /** 성공 여부 플래그. 실패 시에만 명시됨 (null → 성공으로 취급) */
    private Boolean ok;

    /** 실패 메시지 (ok=false 일 때만 존재) */
    private String error;

    /**
     * 성공 여부 판단.
     *
     * <p>{@code ok == Boolean.FALSE} 일 때만 실패로 간주. null 이나 true 는 성공.
     */
    public boolean isSuccess() {
        return !Boolean.FALSE.equals(ok);
    }
}
