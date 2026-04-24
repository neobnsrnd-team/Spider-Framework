package com.example.admin_demo.domain.sqlquery.service;

import com.example.admin_demo.domain.sqlquery.dto.SqlGroupResponse;
import com.example.admin_demo.domain.sqlquery.dto.SqlQueryCreateRequest;
import com.example.admin_demo.domain.sqlquery.dto.SqlQueryHistoryResponse;
import com.example.admin_demo.domain.sqlquery.dto.SqlQueryResponse;
import com.example.admin_demo.domain.sqlquery.dto.SqlQuerySearchRequest;
import com.example.admin_demo.domain.sqlquery.dto.SqlQueryTestRequest;
import com.example.admin_demo.domain.sqlquery.dto.SqlQueryTestResponse;
import com.example.admin_demo.domain.sqlquery.dto.SqlQueryUpdateRequest;
import com.example.admin_demo.domain.sqlquery.mapper.SqlQueryMapper;
import com.example.admin_demo.global.dto.PageRequest;
import com.example.admin_demo.global.dto.PageResponse;
import com.example.admin_demo.global.exception.DuplicateException;
import com.example.admin_demo.global.exception.InternalException;
import com.example.admin_demo.global.exception.InvalidInputException;
import com.example.admin_demo.global.exception.NotFoundException;
import com.example.admin_demo.global.util.AuditUtil;
import com.example.admin_demo.global.util.ExcelColumnDefinition;
import com.example.admin_demo.global.util.ExcelExportUtil;
import java.io.IOException;
import java.sql.Clob;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SqlQueryService {

    private final SqlQueryMapper sqlQueryMapper;
    private final JdbcTemplate jdbcTemplate;

    private static final Pattern XSS_PATTERN =
            Pattern.compile("(?i).*<(script|iframe|object|embed|form)[\\s>].*", Pattern.DOTALL);

    public PageResponse<SqlQueryResponse> getSqlQueriesWithSearch(SqlQuerySearchRequest searchDTO) {
        PageRequest pageRequest = searchDTO.toPageRequest();

        long total = sqlQueryMapper.countAllWithSearch(
                searchDTO.getQueryId(),
                searchDTO.getQueryName(),
                searchDTO.getUseYn(),
                searchDTO.getSqlGroupId(),
                searchDTO.getSqlGroupName(),
                searchDTO.getSqlType());

        List<SqlQueryResponse> list = sqlQueryMapper.findAllWithSearch(
                searchDTO.getQueryId(),
                searchDTO.getQueryName(),
                searchDTO.getUseYn(),
                searchDTO.getSqlGroupId(),
                searchDTO.getSqlGroupName(),
                searchDTO.getSqlType(),
                pageRequest.getSortBy(),
                pageRequest.getSortDirection(),
                pageRequest.getOffset(),
                pageRequest.getEndRow());

        return PageResponse.of(list, total, pageRequest.getPage(), pageRequest.getSize());
    }

    public SqlQueryResponse getById(String queryId) {
        SqlQueryResponse response = sqlQueryMapper.selectResponseById(queryId);
        if (response == null) {
            throw new NotFoundException("queryId: " + queryId);
        }
        return response;
    }

    @Transactional
    public SqlQueryResponse create(SqlQueryCreateRequest dto) {
        validateSqlText(dto.getSqlQuery());
        validateSqlText(dto.getSqlQuery2());
        try {
            sqlQueryMapper.insert(dto, AuditUtil.now(), AuditUtil.currentUserId());
        } catch (DuplicateKeyException e) {
            throw new DuplicateException("queryId: " + dto.getQueryId());
        }
        return sqlQueryMapper.selectResponseById(dto.getQueryId());
    }

    @Transactional
    public SqlQueryResponse update(String queryId, SqlQueryUpdateRequest dto) {
        if (sqlQueryMapper.countByQueryId(queryId) == 0) {
            throw new NotFoundException("queryId: " + queryId);
        }
        validateSqlText(dto.getSqlQuery());
        validateSqlText(dto.getSqlQuery2());
        sqlQueryMapper.update(queryId, dto, AuditUtil.now(), AuditUtil.currentUserId());
        return sqlQueryMapper.selectResponseById(queryId);
    }

    @Transactional
    public void delete(String queryId) {
        if (sqlQueryMapper.countByQueryId(queryId) == 0) {
            throw new NotFoundException("queryId: " + queryId);
        }
        sqlQueryMapper.deleteById(queryId);
    }

    public byte[] exportExcel(SqlQuerySearchRequest searchDTO) {
        List<SqlQueryResponse> data = sqlQueryMapper.findAllForExport(
                searchDTO.getQueryId(),
                searchDTO.getQueryName(),
                searchDTO.getUseYn(),
                searchDTO.getSqlGroupId(),
                searchDTO.getSqlGroupName(),
                searchDTO.getSqlType());

        if (!ExcelExportUtil.isWithinLimit(data.size())) {
            throw new InvalidInputException(
                    "엑셀 다운로드 최대 행 수(" + ExcelExportUtil.MAX_ROW_LIMIT + ")를 초과했습니다: " + data.size());
        }

        List<ExcelColumnDefinition> columns = List.of(
                new ExcelColumnDefinition("Query ID", 20, "queryId"),
                new ExcelColumnDefinition("Query 명", 30, "queryName"),
                new ExcelColumnDefinition("SQL 그룹", 20, "sqlGroupName"),
                new ExcelColumnDefinition("DB", 15, "dbName"),
                new ExcelColumnDefinition("SQL 유형", 10, "sqlType"),
                new ExcelColumnDefinition("실행유형", 10, "execType"),
                new ExcelColumnDefinition("캐시", 6, "cacheYn"),
                new ExcelColumnDefinition("사용여부", 8, "useYn"),
                new ExcelColumnDefinition("설명", 40, "queryDesc"),
                new ExcelColumnDefinition("최종수정일시", 18, "lastUpdateDtime"),
                new ExcelColumnDefinition("최종수정자", 15, "lastUpdateUserId"));

        List<Map<String, Object>> rows = data.stream()
                .map(item -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("queryId", item.getQueryId());
                    row.put("queryName", item.getQueryName());
                    row.put("sqlGroupName", item.getSqlGroupName());
                    row.put("dbName", item.getDbName());
                    row.put("sqlType", item.getSqlType());
                    row.put("execType", item.getExecType());
                    row.put("cacheYn", item.getCacheYn());
                    row.put("useYn", item.getUseYn());
                    row.put("queryDesc", item.getQueryDesc());
                    row.put("lastUpdateDtime", item.getLastUpdateDtime());
                    row.put("lastUpdateUserId", item.getLastUpdateUserId());
                    return row;
                })
                .toList();

        try {
            return ExcelExportUtil.createWorkbook("SQL Query 목록", columns, rows);
        } catch (IOException e) {
            throw new InternalException("엑셀 파일 생성 중 오류가 발생했습니다", e);
        }
    }

    /**
     * 현재 저장된 SQL Query 상태를 이력 테이블(FWK_SQL_QUERY_HIS)에 백업한다.
     *
     * <p>수정 저장 직전 호출되며, 백업 실패 시에도 수정 저장은 계속 진행된다.
     */
    @Transactional
    public void backupQuery(String queryId) {
        SqlQueryResponse current = sqlQueryMapper.selectResponseById(queryId);
        if (current == null) {
            throw new NotFoundException("queryId: " + queryId);
        }
        // VERSION_ID: 밀리초 타임스탬프 문자열 — 동일 쿼리의 동시 백업 충돌 방지
        String versionId = String.valueOf(System.currentTimeMillis());
        sqlQueryMapper.insertHistory(current, versionId, AuditUtil.now(), AuditUtil.currentUserId());
    }

    /**
     * 저장된 SQL 쿼리를 어드민 datasource로 실행해 결과를 반환한다.
     *
     * <p>파라미터가 제공된 경우 실제 값으로 바인딩하고, 없으면 #{}/? 를 NULL로 치환해 실행한다.
     * SELECT 이외의 DML/DDL은 오류 응답으로 반환하며 최대 50행으로 제한한다.
     */
    public SqlQueryTestResponse testQuery(String queryId, SqlQueryTestRequest request) {
        SqlQueryResponse query = getById(queryId);

        String rawSql = query.getSqlQuery();
        if (rawSql == null || rawSql.isBlank()) {
            return SqlQueryTestResponse.builder()
                    .errorMessage("저장된 SQL Query가 비어 있습니다.")
                    .build();
        }

        // 선행 블록 주석(/* */), 한 줄 주석(--)을 모두 반복 제거 (복수 주석 대응)
        String cleanedSql = rawSql.trim();
        String prev;
        do {
            prev = cleanedSql;
            cleanedSql = cleanedSql.replaceAll("(?s)^/\\*.*?\\*/\\s*", "").trim();
            cleanedSql = cleanedSql.replaceAll("(?m)^--[^\\r\\n]*[\\r\\n]*", "").trim();
        } while (!cleanedSql.equals(prev));

        // iBatis XML 동적 태그 감지 — 프레임워크 없이는 실행 불가
        if (cleanedSql.matches(
                "(?si).*<(dynamic|isNotEmpty|isEmpty|isNull|isNotNull|isEqual|isNotEqual|isGreaterThan|isLessThan|iterate)[\\s>].*")) {
            return SqlQueryTestResponse.builder()
                    .errorMessage("이 쿼리는 iBatis 동적 SQL 태그(<dynamic>, <isNotEmpty> 등)를 포함하고 있어\n"
                            + "직접 실행할 수 없습니다.\n"
                            + "iBatis 프레임워크 환경에서만 실행 가능한 쿼리입니다.")
                    .build();
        }

        // SELECT만 허용 — DML/DDL 실행 차단
        if (!cleanedSql.toUpperCase().startsWith("SELECT")) {
            return SqlQueryTestResponse.builder()
                    .errorMessage("테스트는 SELECT 쿼리만 지원합니다. (현재 SQL TYPE: " + query.getSqlType() + ")")
                    .build();
        }

        List<String> params = (request != null) ? request.getParams() : null;
        boolean hasParams = params != null && !params.isEmpty();

        String execSql;
        Object[] args;

        if (hasParams) {
            // 실제 파라미터 바인딩: #{varname}과 구버전 iBatis #VARNAME# 모두 JDBC ?로 치환
            execSql = cleanedSql.replaceAll("#\\{[^}]+\\}", "?").replaceAll("#[A-Za-z0-9_.]+#", "?");
            args = params.toArray(new Object[0]);
        } else {
            // 파라미터 미제공 — 바인딩 변수를 NULL로 치환 (기존 동작 유지)
            execSql = cleanedSql.replaceAll("#\\{[^}]+\\}", "NULL").replaceAll("#[A-Za-z0-9_.]+#", "NULL");
            args = null;
        }

        // Oracle 미지원 DB2 격리 수준 힌트 제거 (WITH UR / WITH CS / WITH RS / WITH RR)
        execSql = execSql.replaceAll("(?i)\\s+WITH\\s+(UR|CS|RS|RR)\\s*$", "");

        // MySQL 방언 LIMIT 구문 제거 — Oracle 미지원 (페이징은 ROWNUM으로 처리)
        execSql = execSql.replaceAll("(?i)\\s+LIMIT\\s+\\S+\\s*,\\s*\\S+\\s*$", "");

        // 서브쿼리 감싸기 전 끝 세미콜론 제거 — 있으면 Oracle 문법 오류 발생
        execSql = execSql.replaceAll(";\\s*$", "");

        // Oracle ROWNUM으로 최대 50행 제한
        String limitedSql = "SELECT * FROM (" + execSql + ") WHERE ROWNUM <= 50";

        long start = System.currentTimeMillis();
        try {
            List<String> columns = new ArrayList<>();

            // ResultSetExtractor를 변수로 추출해 파라미터 유무에 따라 분기 호출
            org.springframework.jdbc.core.ResultSetExtractor<List<Map<String, Object>>> extractor = rs -> {
                List<Map<String, Object>> result = new ArrayList<>();
                ResultSetMetaData meta = rs.getMetaData();
                int colCount = meta.getColumnCount();
                for (int i = 1; i <= colCount; i++) {
                    columns.add(meta.getColumnLabel(i));
                }
                while (rs.next()) {
                    Map<String, Object> row = new LinkedHashMap<>();
                    for (int i = 1; i <= colCount; i++) {
                        Object val = rs.getObject(i);
                        row.put(meta.getColumnLabel(i), toDisplayString(val));
                    }
                    result.add(row);
                }
                return result;
            };

            List<Map<String, Object>> rows = (args != null)
                    ? jdbcTemplate.query(limitedSql, extractor, args)
                    : jdbcTemplate.query(limitedSql, extractor);

            return SqlQueryTestResponse.builder()
                    .columns(columns)
                    .rows(rows)
                    .rowCount(rows != null ? rows.size() : 0)
                    .executionTimeMs(System.currentTimeMillis() - start)
                    .build();

        } catch (Exception e) {
            return SqlQueryTestResponse.builder()
                    .executionTimeMs(System.currentTimeMillis() - start)
                    .errorMessage(e.getMessage())
                    .build();
        }
    }

    /** 사용여부(USE_YN) Y↔N 반전 — 목록 인라인 토글에서 호출 */
    @Transactional
    public SqlQueryResponse toggleUseYn(String queryId) {
        SqlQueryResponse current = sqlQueryMapper.selectResponseById(queryId);
        if (current == null) {
            throw new NotFoundException("queryId: " + queryId);
        }
        String newUseYn = "Y".equals(current.getUseYn()) ? "N" : "Y";
        sqlQueryMapper.updateUseYn(queryId, newUseYn, AuditUtil.now(), AuditUtil.currentUserId());
        return sqlQueryMapper.selectResponseById(queryId);
    }

    public List<SqlQueryHistoryResponse> getHistoryList(String queryId) {
        if (sqlQueryMapper.countByQueryId(queryId) == 0) {
            throw new NotFoundException("queryId: " + queryId);
        }
        return sqlQueryMapper.findHistoryList(queryId);
    }

    public SqlQueryHistoryResponse getHistoryDetail(String queryId, String versionId) {
        SqlQueryHistoryResponse response = sqlQueryMapper.findHistoryByVersion(queryId, versionId);
        if (response == null) {
            throw new NotFoundException("queryId: " + queryId + ", versionId: " + versionId);
        }
        return response;
    }

    /**
     * 특정 이력 버전으로 쿼리를 복원한다.
     *
     * <p>복원 전 현재 상태를 이력 테이블에 자동 백업하여 복원 취소가 가능하도록 한다.
     */
    @Transactional
    public SqlQueryResponse restoreFromHistory(String queryId, String versionId) {
        SqlQueryHistoryResponse history = sqlQueryMapper.findHistoryByVersion(queryId, versionId);
        if (history == null) {
            throw new NotFoundException("queryId: " + queryId + ", versionId: " + versionId);
        }

        // 복원 전 현재 상태 백업 — 복원 자체를 되돌릴 수 있도록 보관
        SqlQueryResponse current = sqlQueryMapper.selectResponseById(queryId);
        if (current != null) {
            String backupVersionId = String.valueOf(System.currentTimeMillis());
            sqlQueryMapper.insertHistory(current, backupVersionId, AuditUtil.now(), AuditUtil.currentUserId());
        }

        SqlQueryUpdateRequest restoreDto = SqlQueryUpdateRequest.builder()
                .queryName(history.getQueryName())
                .sqlGroupId(history.getSqlGroupId())
                .dbId(history.getDbId())
                .sqlType(history.getSqlType())
                .execType(history.getExecType())
                .cacheYn(history.getCacheYn())
                .timeOut(history.getTimeOut())
                .resultType(history.getResultType())
                .useYn(history.getUseYn())
                .sqlQuery(history.getSqlQuery())
                .sqlQuery2(history.getSqlQuery2())
                .queryDesc(history.getQueryDesc())
                .build();

        sqlQueryMapper.update(queryId, restoreDto, AuditUtil.now(), AuditUtil.currentUserId());
        return sqlQueryMapper.selectResponseById(queryId);
    }

    /** SQL 그룹 ID/명 키워드 검색 — autocomplete용, 최대 20건 */
    public List<SqlGroupResponse> searchGroups(String keyword) {
        return sqlQueryMapper.searchSqlGroups(keyword);
    }

    /** CLOB/BLOB 등 LOB 타입을 안전하게 문자열로 변환 */
    private String toDisplayString(Object val) {
        if (val == null) {
            return "";
        }
        if (val instanceof Clob clob) {
            try {
                return clob.getSubString(1, (int) clob.length());
            } catch (SQLException e) {
                return "[CLOB read error]";
            }
        }
        if (val instanceof java.sql.Blob) {
            return "[BLOB]";
        }
        return val.toString();
    }

    private void validateSqlText(String sqlText) {
        if (sqlText != null && XSS_PATTERN.matcher(sqlText).matches()) {
            throw new InvalidInputException("SQL에 허용되지 않는 태그가 포함되어 있습니다");
        }
    }
}
