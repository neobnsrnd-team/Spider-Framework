package com.example.admin_demo.domain.emergencynotice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 긴급공지 노출 설정 변경 요청 DTO
 *
 * <p>공지 모달의 닫기 버튼 및 오늘 하루 보지 않기 체크박스 노출 여부를 담는다.
 * 변경 즉시 배포 중이면 Demo Backend에 재동기화된다.
 *
 * @param closeableYn  닫기 버튼 노출 여부 (Y: 표시 / N: 강제 노출)
 * @param hideTodayYn 오늘 하루 보지 않기 체크박스 노출 여부 (Y: 표시 / N: 숨김)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyNoticeSettingsRequest {

    /** 닫기 버튼 노출 여부 — Y: 표시(기본) / N: 강제 노출(critical 장애 시) */
    private String closeableYn;

    /** 오늘 하루 보지 않기 체크박스 노출 여부 — Y: 표시(기본) / N: 숨김 */
    private String hideTodayYn;
}
