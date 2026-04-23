package com.example.admin_demo.domain.sqlquery.mapper;

import com.example.admin_demo.domain.sqlquery.dto.SqlQueryCreateRequest;
import com.example.admin_demo.domain.sqlquery.dto.SqlQueryHistoryResponse;
import com.example.admin_demo.domain.sqlquery.dto.SqlQueryResponse;
import com.example.admin_demo.domain.sqlquery.dto.SqlQueryUpdateRequest;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface SqlQueryMapper {

    SqlQueryResponse selectResponseById(@Param("queryId") String queryId);

    int countByQueryId(@Param("queryId") String queryId);

    void insert(
            @Param("dto") SqlQueryCreateRequest dto,
            @Param("lastUpdateDtime") String lastUpdateDtime,
            @Param("lastUpdateUserId") String lastUpdateUserId);

    void update(
            @Param("queryId") String queryId,
            @Param("dto") SqlQueryUpdateRequest dto,
            @Param("lastUpdateDtime") String lastUpdateDtime,
            @Param("lastUpdateUserId") String lastUpdateUserId);

    void deleteById(@Param("queryId") String queryId);

    @SuppressWarnings("java:S107")
    List<SqlQueryResponse> findAllWithSearch(
            @Param("queryId") String queryId,
            @Param("queryName") String queryName,
            @Param("useYn") String useYn,
            @Param("sqlGroupId") String sqlGroupId,
            @Param("sqlGroupName") String sqlGroupName,
            @Param("sqlType") String sqlType,
            @Param("sortBy") String sortBy,
            @Param("sortDirection") String sortDirection,
            @Param("offset") int offset,
            @Param("endRow") int endRow);

    long countAllWithSearch(
            @Param("queryId") String queryId,
            @Param("queryName") String queryName,
            @Param("useYn") String useYn,
            @Param("sqlGroupId") String sqlGroupId,
            @Param("sqlGroupName") String sqlGroupName,
            @Param("sqlType") String sqlType);

    List<SqlQueryResponse> findAllForExport(
            @Param("queryId") String queryId,
            @Param("queryName") String queryName,
            @Param("useYn") String useYn,
            @Param("sqlGroupId") String sqlGroupId,
            @Param("sqlGroupName") String sqlGroupName,
            @Param("sqlType") String sqlType);

    /**
     * 수정 직전 현재 상태를 FWK_SQL_QUERY_HIS 테이블에 백업 삽입
     *
     * <p>PK: (versionId, queryId) — versionId는 System.currentTimeMillis() 문자열 사용
     */
    void insertHistory(
            @Param("data") SqlQueryResponse data,
            @Param("versionId") String versionId,
            @Param("backupDtime") String backupDtime,
            @Param("backupUserId") String backupUserId);

    /** queryId에 해당하는 이력 목록 최신순 조회 */
    List<SqlQueryHistoryResponse> findHistoryList(@Param("queryId") String queryId);

    /** 특정 VERSION_ID의 이력 단건 조회 */
    SqlQueryHistoryResponse findHistoryByVersion(
            @Param("queryId") String queryId, @Param("versionId") String versionId);
}
