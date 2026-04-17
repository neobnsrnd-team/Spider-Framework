package com.example.admin_demo.domain.cmsasset.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * CMS 이미지 상세 응답 DTO — 승인 관리 화면의 미리보기 모달에서 사용.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CmsAssetDetailResponse {

    /** 이미지 ID */
    private String assetId;

    /** 원본 파일명 */
    private String assetName;

    /** 업무 카테고리 */
    private String businessCategory;

    /** MIME 타입 */
    private String mimeType;

    /** 파일 크기 (바이트) */
    private Long fileSize;

    /** 서버 내 물리 경로 */
    private String assetPath;

    /** 클라이언트 접근 URL */
    private String assetUrl;

    /** 이미지 설명 */
    private String assetDesc;

    /** 승인 상태 */
    private String assetState;

    /** 반려 사유 (REJECTED 상태일 때만) */
    private String rejectedReason;

    /** 업로더 ID */
    private String createUserId;

    /** 업로더 이름 */
    private String createUserName;

    /** 최종 수정자 이름 */
    private String lastModifierName;

    /** 생성일 */
    private String createDate;

    /** 최종 수정일시 */
    private String lastModifiedDtime;
}
