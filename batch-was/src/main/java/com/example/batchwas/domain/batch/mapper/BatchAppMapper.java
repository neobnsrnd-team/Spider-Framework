package com.example.batchwas.domain.batch.mapper;

import org.apache.ibatis.annotations.Param;

/**
 * FWK_BATCH_APP 조회 Mapper.
 *
 * <p>배치 실행 시 BATCH_APP_FILE_NAME(= JobRegistry Bean 이름)을 조회하는 용도로만 사용.</p>
 */
public interface BatchAppMapper {

    /**
     * batchAppId로 배치 파일명(= Job Bean 이름) 조회.
     *
     * @param batchAppId 배치 APP ID
     * @return BATCH_APP_FILE_NAME (JobRegistry에 등록된 Job 이름), 없으면 null
     */
    String selectBatchAppFileName(@Param("batchAppId") String batchAppId);
}
