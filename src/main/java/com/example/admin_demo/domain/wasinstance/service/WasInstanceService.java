package com.example.admin_demo.domain.wasinstance.service;

import com.example.admin_demo.domain.batch.mapper.WasExecBatchMapper;
import com.example.admin_demo.domain.wasinstance.dto.WasInstanceBatchSaveRequest;
import com.example.admin_demo.domain.wasinstance.dto.WasInstanceRequest;
import com.example.admin_demo.domain.wasinstance.dto.WasInstanceResponse;
import com.example.admin_demo.domain.wasinstance.mapper.WasInstanceMapper;
import com.example.admin_demo.domain.wasproperty.service.WasPropertyService;
import com.example.admin_demo.global.dto.PageRequest;
import com.example.admin_demo.global.dto.PageResponse;
import com.example.admin_demo.global.exception.DuplicateException;
import com.example.admin_demo.global.exception.InternalException;
import com.example.admin_demo.global.exception.InvalidInputException;
import com.example.admin_demo.global.exception.NotFoundException;
import com.example.admin_demo.global.util.ExcelColumnDefinition;
import com.example.admin_demo.global.util.ExcelExportUtil;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WasInstanceService {

    private final WasInstanceMapper wasInstanceMapper;
    private final WasPropertyService wasPropertyService;
    private final WasExecBatchMapper wasExecBatchMapper;

    public List<WasInstanceResponse> getAllInstances() {
        log.info("Fetching all WAS instances");
        return wasInstanceMapper.selectAll();
    }

    public PageResponse<WasInstanceResponse> getInstances(
            PageRequest pageRequest, String instanceName, String instanceType, String operModeType) {
        int page = Math.max(pageRequest.getPage(), 0);
        int size = Math.max(pageRequest.getSize(), 1);
        int offset = page * size;

        List<WasInstanceResponse> dtos = wasInstanceMapper.findBySearchPaging(
                instanceName,
                instanceType,
                operModeType,
                offset,
                size,
                pageRequest.getSortBy(),
                pageRequest.getSortDirection());
        long totalCount = wasInstanceMapper.countBySearch(instanceName, instanceType, operModeType);

        int totalPages = (int) Math.ceil((double) totalCount / size);
        return PageResponse.<WasInstanceResponse>builder()
                .content(dtos)
                .currentPage(page + 1)
                .totalPages(totalPages)
                .totalElements(totalCount)
                .size(size)
                .hasNext(page + 1 < totalPages)
                .hasPrevious(page > 0)
                .build();
    }

    public WasInstanceResponse getInstanceById(String instanceId) {
        log.info("Fetching WAS instance by ID: {}", instanceId);

        WasInstanceResponse instance = wasInstanceMapper.selectResponseById(instanceId);
        if (instance == null) {
            throw new NotFoundException("instanceId: " + instanceId);
        }

        return instance;
    }

    @Transactional
    public WasInstanceResponse createInstance(WasInstanceRequest dto) {
        log.info("Creating new WAS instance: {}", dto.getInstanceId());

        if (wasInstanceMapper.countById(dto.getInstanceId()) > 0) {
            throw new DuplicateException("instanceId: " + dto.getInstanceId());
        }

        wasInstanceMapper.insert(dto);

        log.info("WAS instance created successfully: {}", dto.getInstanceId());
        return wasInstanceMapper.selectResponseById(dto.getInstanceId());
    }

    @Transactional
    public WasInstanceResponse updateInstance(String instanceId, WasInstanceRequest dto) {
        log.info("Updating WAS instance: {}", instanceId);

        if (wasInstanceMapper.countById(instanceId) == 0) {
            throw new NotFoundException("instanceId: " + instanceId);
        }

        wasInstanceMapper.update(instanceId, dto);

        log.info("WAS instance updated successfully: {}", instanceId);
        return wasInstanceMapper.selectResponseById(instanceId);
    }

    @Transactional
    public void deleteInstance(String instanceId) {
        log.info("Deleting WAS instance: {}", instanceId);

        if (wasInstanceMapper.countById(instanceId) == 0) {
            throw new NotFoundException("instanceId: " + instanceId);
        }

        wasPropertyService.deleteByInstanceId(instanceId);
        wasExecBatchMapper.deleteByInstanceId(instanceId);
        wasInstanceMapper.deleteById(instanceId);
        log.info("WAS instance deleted successfully: {}", instanceId);
    }

    @Transactional
    public int batchSave(List<WasInstanceBatchSaveRequest> requests) {
        int processedCount = 0;

        for (WasInstanceBatchSaveRequest request : requests) {
            WasInstanceRequest dto = toRequest(request);
            switch (request.getCrud()) {
                case "C" -> {
                    if (wasInstanceMapper.countById(request.getInstanceId()) > 0) {
                        throw new DuplicateException("instanceId: " + request.getInstanceId());
                    }
                    wasInstanceMapper.insert(dto);
                    processedCount++;
                }
                case "U" -> {
                    if (wasInstanceMapper.countById(request.getInstanceId()) == 0) {
                        throw new NotFoundException("instanceId: " + request.getInstanceId());
                    }
                    wasInstanceMapper.update(request.getInstanceId(), dto);
                    processedCount++;
                }
                case "D" -> {
                    if (wasInstanceMapper.countById(request.getInstanceId()) == 0) {
                        throw new NotFoundException("instanceId: " + request.getInstanceId());
                    }
                    wasPropertyService.deleteByInstanceId(request.getInstanceId());
                    wasExecBatchMapper.deleteByInstanceId(request.getInstanceId());
                    wasInstanceMapper.deleteById(request.getInstanceId());
                    processedCount++;
                }
                default -> log.warn("Unknown CRUD action: {}", request.getCrud());
            }
        }

        return processedCount;
    }

    private WasInstanceRequest toRequest(WasInstanceBatchSaveRequest batch) {
        return WasInstanceRequest.builder()
                .instanceId(batch.getInstanceId())
                .instanceName(batch.getInstanceName())
                .instanceDesc(batch.getInstanceDesc())
                .wasConfigId(batch.getWasConfigId())
                .instanceType(batch.getInstanceType())
                .ip(batch.getIp())
                .port(batch.getPort())
                .operModeType(batch.getOperModeType())
                .build();
    }

    public byte[] exportWasInstances(
            String instanceName, String instanceType, String operModeType, String sortBy, String sortDirection) {
        List<WasInstanceResponse> data =
                wasInstanceMapper.findAllForExport(instanceName, instanceType, operModeType, sortBy, sortDirection);
        if (!ExcelExportUtil.isWithinLimit(data.size())) {
            throw new InvalidInputException(
                    "엑셀 다운로드 최대 행 수(" + ExcelExportUtil.MAX_ROW_LIMIT + ")를 초과했습니다: " + data.size());
        }
        List<ExcelColumnDefinition> columns = List.of(
                new ExcelColumnDefinition("인스턴스 ID", 12, "instanceId"),
                new ExcelColumnDefinition("인스턴스명", 20, "instanceName"),
                new ExcelColumnDefinition("인스턴스 설명", 30, "instanceDesc"),
                new ExcelColumnDefinition("WAS 설정 ID", 12, "wasConfigId"),
                new ExcelColumnDefinition("인스턴스 구분", 12, "instanceType"),
                new ExcelColumnDefinition("IP", 15, "ip"),
                new ExcelColumnDefinition("포트", 8, "port"),
                new ExcelColumnDefinition("운영 모드", 10, "operModeType"));
        List<Map<String, Object>> rows = new ArrayList<>(data.size());
        for (WasInstanceResponse item : data) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("instanceId", item.getInstanceId());
            row.put("instanceName", item.getInstanceName());
            row.put("instanceDesc", item.getInstanceDesc());
            row.put("wasConfigId", item.getWasConfigId());
            row.put("instanceType", item.getInstanceType());
            row.put("ip", item.getIp());
            row.put("port", item.getPort());
            row.put("operModeType", item.getOperModeType());
            rows.add(row);
        }
        try {
            return ExcelExportUtil.createWorkbook("WAS 인스턴스", columns, rows);
        } catch (IOException e) {
            throw new InternalException("엑셀 파일 생성 중 오류가 발생했습니다", e);
        }
    }
}
