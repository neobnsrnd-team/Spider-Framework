package com.example.admin_demo.domain.reactgenerate.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * React 코드 생성 이력 목록 검색 조건 DTO.
 *
 * <p>날짜 범위는 yyyyMMdd 형식으로 입력받으며, MyBatis XML에서
 * {@code fromDate || '000000'}, {@code toDate || '235959'} 로 확장되어
 * DB 저장 형식(yyyyMMddHHmmss)과 비교된다.
 */
@Getter
@Setter
public class ReactGenerateSearchRequest {

    /** 상태 필터 (GENERATED / PENDING_APPROVAL / APPROVED / FAILED). null이면 전체 조회. */
    private String status;

    /** 생성자 ID 부분 일치 검색. null이면 전체 조회. */
    private String createUserId;

    /** 검색 시작일 (yyyyMMdd). null이면 제한 없음. */
    private String fromDate;

    /** 검색 종료일 (yyyyMMdd). null이면 제한 없음. */
    private String toDate;

    /** 현재 페이지 번호 (1-based). */
    private int page = 1;

    /** 페이지당 표시 건수. 기본값 10. */
    private int size = 10;

    /**
     * Oracle ROWNUM 페이지네이션에서 시작 행 번호(0-based)를 반환한다.
     * 외부 쿼리의 {@code WHERE RNUM > offset} 조건에 사용한다.
     *
     * @return (page - 1) * size
     */
    public int getOffset() {
        return (page - 1) * size;
    }

    /**
     * Oracle ROWNUM 페이지네이션에서 끝 행 번호를 반환한다.
     * 내부 쿼리의 {@code WHERE ROWNUM <= endRow} 조건에 사용한다.
     *
     * @return page * size
     */
    public int getEndRow() {
        return page * size;
    }
}
