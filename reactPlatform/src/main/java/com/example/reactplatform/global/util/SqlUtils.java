/**
 * @file SqlUtils.java
 * @description Oracle MyBatis 쿼리에서 공통으로 필요한 SQL 유틸리티 메서드 모음.
 *     현재는 LIKE 검색 와일드카드 이스케이프 기능을 제공한다.
 */
package com.example.reactplatform.global.util;

public final class SqlUtils {

    private SqlUtils() {}

    /**
     * Oracle LIKE 검색의 와일드카드 문자를 이스케이프한다.
     *
     * <p>SQL에 {@code ESCAPE '\'} 절이 선언된 경우, Java에서 {@code %}, {@code _}, {@code \}를
     * 미리 이스케이프해야 사용자 입력이 의도치 않은 와일드카드로 동작하는 것을 방지할 수 있다.
     * 순서 중요: {@code \} 먼저 이스케이프 후 {@code %}, {@code _} 순으로 처리.
     *
     * @param value 이스케이프할 문자열 (null이면 null 반환)
     * @return 이스케이프 처리된 문자열
     */
    public static String escapeLike(String value) {
        if (value == null) return null;
        return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
    }
}
