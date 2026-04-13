package com.example.admin_demo.domain.batch.mapper;

import com.example.admin_demo.domain.batch.dto.WasExecBatchResponse;
import java.util.List;
import java.util.Map;
import org.apache.ibatis.annotations.Param;

/**
 * WasExecBatch Mapper (M:N 관계)
 * BATCH_APP과 WAS_INSTANCE의 교차 테이블 CRUD 담당
 */
public interface WasExecBatchMapper {

    // 기본 CRUD
    void insertWasExecBatch(
            @Param("batchAppId") String batchAppId,
            @Param("instanceId") String instanceId,
            @Param("useYn") String useYn,
            @Param("lastUpdateDtime") String lastUpdateDtime,
            @Param("lastUpdateUserId") String lastUpdateUserId);

    void updateWasExecBatch(
            @Param("batchAppId") String batchAppId,
            @Param("instanceId") String instanceId,
            @Param("useYn") String useYn,
            @Param("lastUpdateDtime") String lastUpdateDtime,
            @Param("lastUpdateUserId") String lastUpdateUserId);

    void deleteWasExecBatchById(@Param("batchAppId") String batchAppId, @Param("instanceId") String instanceId);

    // 조회
    List<WasExecBatchResponse> selectByBatchAppIdWithDetails(String batchAppId);

    WasExecBatchResponse selectById(@Param("batchAppId") String batchAppId, @Param("instanceId") String instanceId);

    // 존재 확인
    int countById(@Param("batchAppId") String batchAppId, @Param("instanceId") String instanceId);

    // 일괄 삭제
    void deleteByBatchAppId(String batchAppId);

    // 인스턴스 삭제 시 cascade
    void deleteByInstanceId(String instanceId);

    // Batch 작업 (Oracle UNION ALL 패턴)
    void insertWasExecBatchBatch(@Param("list") List<Map<String, String>> list);
}
