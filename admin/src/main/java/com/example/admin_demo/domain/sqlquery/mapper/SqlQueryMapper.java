package com.example.admin_demo.domain.sqlquery.mapper;

import com.example.admin_demo.domain.sqlquery.dto.SqlQueryCreateRequest;
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
            @Param("sortBy") String sortBy,
            @Param("sortDirection") String sortDirection,
            @Param("offset") int offset,
            @Param("endRow") int endRow);

    long countAllWithSearch(
            @Param("queryId") String queryId, @Param("queryName") String queryName, @Param("useYn") String useYn);

    List<SqlQueryResponse> findAllForExport(
            @Param("queryId") String queryId, @Param("queryName") String queryName, @Param("useYn") String useYn);
}
