/**
 * @file AuthRepository.java
 * @description 인증 도메인 DB 접근 계층.
 *              POC_USER 테이블을 대상으로 로그인 검증 및 최근 접속 일시 갱신을 처리한다.
 */
package com.example.tcpbackend.domain.auth;

import java.util.Optional;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.tcpbackend.domain.auth.dto.UserRow;

/**
 * 인증 관련 DB 접근 객체.
 */
@Repository
public class AuthRepository {

    private final JdbcTemplate jdbc;

    public AuthRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * 아이디/비밀번호로 사용자를 조회한다.
     * 일치하는 사용자가 없으면 Optional.empty()를 반환한다.
     *
     * @param userId   로그인 아이디
     * @param password 평문 비밀번호 (POC: 해싱 미적용)
     * @return 사용자 정보 또는 empty
     */
    public Optional<UserRow> findByCredentials(String userId, String password) {
        // LAST_LOGIN_DTIME 컬럼은 VARCHAR2로 'YYYYMMDDHH24MISS' 형식이 이미 저장되어 있으므로
        // TO_CHAR 변환 없이 직접 조회한다 (DATE 타입이 아니므로 날짜 포맷 적용 시 ORA-01481 발생)
        String sql = """
                SELECT USER_ID, USER_NAME, USER_GRADE, LOG_YN, LAST_LOGIN_DTIME
                  FROM D_SPIDERLINK.POC_USER
                 WHERE USER_ID = ? AND PASSWORD = ?
                """;

        var rows = jdbc.query(sql, (rs, i) -> new UserRow(
                rs.getString("USER_ID"),
                rs.getString("USER_NAME"),
                rs.getString("USER_GRADE"),
                rs.getString("LOG_YN"),
                rs.getString("LAST_LOGIN_DTIME")
        ), userId, password);

        return rows.isEmpty() ? Optional.empty() : Optional.of(rows.get(0));
    }

    /**
     * 사용자 프로필을 조회한다.
     * (TCP에서는 JWT 대신 세션에 사용자 정보가 있으므로
     *  GET_PROFILE 커맨드 시 최신 DB 값을 확인할 때 사용)
     *
     * @param userId 조회할 사용자 ID
     * @return 사용자 정보 또는 empty
     */
    public Optional<UserRow> findById(String userId) {
        String sql = """
                SELECT USER_ID, USER_NAME, USER_GRADE, LOG_YN,
                       LAST_LOGIN_DTIME
                  FROM D_SPIDERLINK.POC_USER
                 WHERE USER_ID = ?
                """;

        var rows = jdbc.query(sql, (rs, i) -> new UserRow(
                rs.getString("USER_ID"),
                rs.getString("USER_NAME"),
                rs.getString("USER_GRADE"),
                rs.getString("LOG_YN"),
                rs.getString("LAST_LOGIN_DTIME")
        ), userId);

        return rows.isEmpty() ? Optional.empty() : Optional.of(rows.get(0));
    }

    /**
     * 로그인 성공 시 LAST_LOGIN_DTIME을 현재 시각으로 갱신한다.
     * 실패해도 로그인 처리에는 영향을 주지 않으므로 예외를 전파하지 않는다.
     *
     * @param userId 갱신할 사용자 ID
     */
    public void updateLastLoginTime(String userId) {
        String sql = """
                UPDATE D_SPIDERLINK.POC_USER
                   SET LAST_LOGIN_DTIME = TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS')
                 WHERE USER_ID = ?
                """;
        jdbc.update(sql, userId);
    }
}
