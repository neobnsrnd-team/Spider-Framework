/**
 * @file NoticeState.java
 * @description 현재 배포 중인 긴급공지 상태를 담는 DTO.
 *              TCP 브로드캐스트 응답의 data 필드에 직렬화된다.
 */
package com.example.tcpbackend.domain.notice.dto;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * 긴급공지 상태.
 * null 필드는 JSON 직렬화에서 제외한다.
 *
 * @param notices     언어별 공지 목록 [{ lang, title, content }]
 * @param displayType 노출 타입 ('A'|'B'|'C'|'N')
 * @param closeableYn 닫기 버튼 노출 여부 ('Y'|'N')
 * @param hideTodayYn 오늘 하루 보지 않기 체크박스 노출 여부 ('Y'|'N')
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record NoticeState(
        List<Map<String, Object>> notices,
        String displayType,
        String closeableYn,
        String hideTodayYn
) {}