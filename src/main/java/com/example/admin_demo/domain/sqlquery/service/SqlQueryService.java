package com.example.admin_demo.domain.sqlquery.service;

import com.example.admin_demo.domain.sqlquery.dto.SqlQueryCreateRequest;
import com.example.admin_demo.domain.sqlquery.dto.SqlQueryResponse;
import com.example.admin_demo.domain.sqlquery.dto.SqlQuerySearchRequest;
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
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SqlQueryService {

    private final SqlQueryMapper sqlQueryMapper;

    private static final Pattern XSS_PATTERN =
            Pattern.compile("(?i).*<(script|iframe|object|embed|form)[\\s>].*", Pattern.DOTALL);

    public PageResponse<SqlQueryResponse> getSqlQueriesWithSearch(SqlQuerySearchRequest searchDTO) {
        PageRequest pageRequest = searchDTO.toPageRequest();

        long total = sqlQueryMapper.countAllWithSearch(
                searchDTO.getQueryId(), searchDTO.getQueryName(), searchDTO.getUseYn());

        List<SqlQueryResponse> list = sqlQueryMapper.findAllWithSearch(
                searchDTO.getQueryId(),
                searchDTO.getQueryName(),
                searchDTO.getUseYn(),
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
        List<SqlQueryResponse> data =
                sqlQueryMapper.findAllForExport(searchDTO.getQueryId(), searchDTO.getQueryName(), searchDTO.getUseYn());

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

    private void validateSqlText(String sqlText) {
        if (sqlText != null && XSS_PATTERN.matcher(sqlText).matches()) {
            throw new InvalidInputException("SQL에 허용되지 않는 태그가 포함되어 있습니다");
        }
    }
}
