/**
 * @file AuthService.java
 * @description 인증 비즈니스 로직 서비스.
 *              로그인 검증, 사용자 프로필 조회를 담당한다.
 *              HTTP JWT와 달리 TCP에서는 세션 관리를 TcpSessionManager가 처리한다.
 */
package com.example.tcpbackend.domain.auth;

import java.util.LinkedHashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.example.tcpbackend.domain.auth.dto.UserRow;

/**
 * 인증 서비스.
 *
 * <p>반환값은 TCP 응답 data 필드에 그대로 직렬화될 Map 형태를 사용한다.
 */
@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final AuthRepository authRepository;

    public AuthService(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }

    /**
     * 로그인 검증을 수행한다.
     *
     * @param userId   로그인 아이디
     * @param password 비밀번호
     * @return 로그인 성공 시 사용자 정보 Map, 실패 시 예외 발생
     * @throws IllegalArgumentException 아이디/비밀번호 불일치
     * @throws IllegalStateException    비활성 계정
     */
    public UserRow login(String userId, String password) {
        UserRow user = authRepository.findByCredentials(userId, password)
                .orElseThrow(() -> new IllegalArgumentException("아이디 또는 비밀번호가 틀렸습니다."));

        // LOG_YN = 'N' 계정은 사용 정지 처리
        if (!"Y".equals(user.logYn())) {
            throw new IllegalStateException("사용이 정지된 계정입니다. 관리자에게 문의하세요.");
        }

        // 최근 로그인 시각 갱신 (실패해도 로그인은 허용)
        try {
            authRepository.updateLastLoginTime(userId);
        } catch (Exception e) {
            log.warn("[Auth] LAST_LOGIN_DTIME 갱신 실패 (userId={}): {}", userId, e.getMessage());
        }

        return user;
    }

    /**
     * 사용자 프로필을 조회한다.
     * 현재 시각(SYSDATE)을 lastLogin으로 반환해 최근 접속 일시를 즉시 반영한다.
     *
     * @param userId 조회할 사용자 ID
     * @return 프로필 정보 Map
     * @throws IllegalArgumentException 사용자 미존재
     */
    public Map<String, Object> getProfile(String userId) {
        UserRow user = authRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("userId", user.userId());
        data.put("userName", user.userName());
        data.put("userGrade", user.userGrade());
        data.put("lastLogin", formatLoginDtime(user.lastLoginDtime()));
        return data;
    }

    /**
     * LAST_LOGIN_DTIME(YYYYMMDDHH24MISS 14자리) → 'YYYY.MM.DD HH:MM:SS' 변환.
     *
     * @param raw 14자리 숫자 문자열 또는 null
     * @return 포맷된 문자열, 변환 불가 시 원본 반환
     */
    public static String formatLoginDtime(String raw) {
        String s = raw == null ? "" : raw.replaceAll("\\D", "");
        if (s.length() != 14) return raw == null ? "" : raw;
        return s.substring(0, 4) + "." + s.substring(4, 6) + "." + s.substring(6, 8)
                + " " + s.substring(8, 10) + ":" + s.substring(10, 12) + ":" + s.substring(12, 14);
    }
}