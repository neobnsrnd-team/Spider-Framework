package com.example.admin_demo.domain.cmsasset.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * CMS 이미지 목록 응답 DTO (SPW_CMS_ASSET 기반).
 *
 * <p>승인 요청 화면과 승인 관리 화면이 공유하는 행(row) 응답 포맷.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CmsAssetListResponse {

    /** 이미지 ID (UUID) */
    private String assetId;

    /** 원본 파일명 */
    private String assetName;

    /** 업무 카테고리 분류 */
    private String businessCategory;

    /** MIME 타입 (image/png, image/jpeg 등) */
    private String mimeType;

    /** 파일 크기 (바이트) */
    private Long fileSize;

    /** 클라이언트 접근 URL (/static/xxx). 현재는 placeholder 우선 사용 */
    private String assetUrl;

    /** 승인 상태 (WORK / PENDING / APPROVED / REJECTED) */
    private String assetState;

    /** 업로더 ID */
    private String createUserId;

    /** 업로더 이름 */
    private String createUserName;

    /** 반려 사유 (REJECTED 상태일 때만 노출) */
    private String rejectedReason;

    /** 생성일 (YYYY-MM-DD HH24:MI:SS) */
    private String createDate;

    /** 최종 수정일시 (YYYY-MM-DD HH24:MI:SS) */
    private String lastModifiedDtime;
}
