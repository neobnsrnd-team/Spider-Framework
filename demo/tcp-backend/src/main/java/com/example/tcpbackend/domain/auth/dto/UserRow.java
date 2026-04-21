/**
 * @file UserRow.java
 * @description POC_USER 테이블 조회 결과를 담는 DTO.
 */
package com.example.tcpbackend.domain.auth.dto;

/**
 * POC_USER DB 로우 매핑 객체.
 *
 * @param userId         사용자 ID
 * @param userName       사용자 이름
 * @param userGrade      사용자 등급
 * @param logYn          로그인 허용 여부 ('Y' = 정상, 'N' = 비활성)
 * @param lastLoginDtime 최근 로그인 일시 (YYYYMMDDHH24MISS 14자리 문자열)
 */
public record UserRow(
        String userId,
        String userName,
        String userGrade,
        String logYn,
        String lastLoginDtime
) {}