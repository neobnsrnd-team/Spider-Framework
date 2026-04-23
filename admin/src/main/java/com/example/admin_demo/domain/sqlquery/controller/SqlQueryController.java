package com.example.admin_demo.domain.sqlquery.controller;

import com.example.admin_demo.domain.sqlquery.dto.SqlQueryCreateRequest;
import com.example.admin_demo.domain.sqlquery.dto.SqlQueryHistoryResponse;
import com.example.admin_demo.domain.sqlquery.dto.SqlQueryResponse;
import com.example.admin_demo.domain.sqlquery.dto.SqlQuerySearchRequest;
import com.example.admin_demo.domain.sqlquery.dto.SqlQueryTestResponse;
import com.example.admin_demo.domain.sqlquery.dto.SqlQueryUpdateRequest;
import com.example.admin_demo.domain.sqlquery.service.SqlQueryService;
import com.example.admin_demo.global.dto.ApiResponse;
import com.example.admin_demo.global.dto.PageResponse;
import com.example.admin_demo.global.util.ExcelExportUtil;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/sql-queries")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('SQL_QUERY:R')")
public class SqlQueryController {

    private final SqlQueryService sqlQueryService;

    @GetMapping("/page")
    public ResponseEntity<ApiResponse<PageResponse<SqlQueryResponse>>> getSqlQueriesWithPagination(
            @ModelAttribute SqlQuerySearchRequest searchDTO) {
        log.info(
                "GET /api/sql-queries/page - page: {}, size: {}, queryId: {}, queryName: {}, useYn: {}",
                searchDTO.getPage(),
                searchDTO.getSize(),
                searchDTO.getQueryId(),
                searchDTO.getQueryName(),
                searchDTO.getUseYn());
        return ResponseEntity.ok(ApiResponse.success(sqlQueryService.getSqlQueriesWithSearch(searchDTO)));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportExcel(@ModelAttribute SqlQuerySearchRequest searchDTO) {
        log.info("GET /api/sql-queries/export");

        byte[] excelBytes = sqlQueryService.exportExcel(searchDTO);
        String fileName = ExcelExportUtil.generateFileName("SqlQuery", LocalDate.now());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentDisposition(
                ContentDisposition.attachment().filename(fileName).build());
        headers.setContentType(
                MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));

        return ResponseEntity.ok().headers(headers).body(excelBytes);
    }

    @GetMapping("/{queryId}")
    public ResponseEntity<ApiResponse<SqlQueryResponse>> getById(@PathVariable String queryId) {
        log.info("GET /api/sql-queries/{}", queryId);
        return ResponseEntity.ok(ApiResponse.success(sqlQueryService.getById(queryId)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('SQL_QUERY:W')")
    public ResponseEntity<ApiResponse<SqlQueryResponse>> create(@Valid @RequestBody SqlQueryCreateRequest dto) {
        log.info("POST /api/sql-queries - queryId: {}", dto.getQueryId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(sqlQueryService.create(dto)));
    }

    @PutMapping("/{queryId}")
    @PreAuthorize("hasAuthority('SQL_QUERY:W')")
    public ResponseEntity<ApiResponse<SqlQueryResponse>> update(
            @PathVariable String queryId, @Valid @RequestBody SqlQueryUpdateRequest dto) {
        log.info("PUT /api/sql-queries/{}", queryId);
        return ResponseEntity.ok(ApiResponse.success(sqlQueryService.update(queryId, dto)));
    }

    @DeleteMapping("/{queryId}")
    @PreAuthorize("hasAuthority('SQL_QUERY:W')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String queryId) {
        log.info("DELETE /api/sql-queries/{}", queryId);
        sqlQueryService.delete(queryId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/{queryId}/test")
    @PreAuthorize("hasAuthority('SQL_QUERY:W')")
    public ResponseEntity<ApiResponse<SqlQueryTestResponse>> testQuery(@PathVariable String queryId) {
        log.info("POST /api/sql-queries/{}/test", queryId);
        return ResponseEntity.ok(ApiResponse.success(sqlQueryService.testQuery(queryId)));
    }

    @PostMapping("/{queryId}/backup")
    @PreAuthorize("hasAuthority('SQL_QUERY:W')")
    public ResponseEntity<ApiResponse<Void>> backupQuery(@PathVariable String queryId) {
        log.info("POST /api/sql-queries/{}/backup", queryId);
        sqlQueryService.backupQuery(queryId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping("/{queryId}/history")
    public ResponseEntity<ApiResponse<List<SqlQueryHistoryResponse>>> getHistoryList(@PathVariable String queryId) {
        log.info("GET /api/sql-queries/{}/history", queryId);
        return ResponseEntity.ok(ApiResponse.success(sqlQueryService.getHistoryList(queryId)));
    }

    @GetMapping("/{queryId}/history/{versionId}")
    public ResponseEntity<ApiResponse<SqlQueryHistoryResponse>> getHistoryDetail(
            @PathVariable String queryId, @PathVariable String versionId) {
        log.info("GET /api/sql-queries/{}/history/{}", queryId, versionId);
        return ResponseEntity.ok(ApiResponse.success(sqlQueryService.getHistoryDetail(queryId, versionId)));
    }

    @PostMapping("/{queryId}/restore/{versionId}")
    @PreAuthorize("hasAuthority('SQL_QUERY:W')")
    public ResponseEntity<ApiResponse<SqlQueryResponse>> restoreFromHistory(
            @PathVariable String queryId, @PathVariable String versionId) {
        log.info("POST /api/sql-queries/{}/restore/{}", queryId, versionId);
        return ResponseEntity.ok(ApiResponse.success(sqlQueryService.restoreFromHistory(queryId, versionId)));
    }
}
