package com.example.admin_demo.domain.reactgenerate.mapper;

import com.example.admin_demo.domain.reactgenerate.dto.ReactGenerateResponse;
import org.apache.ibatis.annotations.Param;

/**
 * FWK_RPS_CODE_HIS 테이블 Mapper.
 * React 코드 생성 이력의 저장·조회·상태 변경을 담당한다.
 *
 * <p>Oracle {@code @MapperScan}("domain.**.mapper") 스캔 대상으로 등록되어
 * Oracle datasource를 통해 FWK_RPS_CODE_HIS 테이블에 접근한다.
 */
public interface ReactGenerateMapper {

    /** 생성된 React 코드 이력을 신규 저장한다. */
    void insert(
            @Param("codeId") String codeId,
            @Param("figmaUrl") String figmaUrl,
            @Param("requirements") String requirements,
            @Param("systemPrompt") String systemPrompt,
            @Param("userPrompt") String userPrompt,
            @Param("reactCode") String reactCode,
            @Param("createUserId") String createUserId,
            @Param("createDtime") String createDtime);

    /** CODE_ID로 생성 이력을 단건 조회한다. 존재하지 않으면 null 반환. */
    ReactGenerateResponse selectById(@Param("codeId") String codeId);

    /** 승인 상태를 변경한다. 승인·반려 시 approvalUserId/approvalDtime 함께 기록. */
    void updateStatus(
            @Param("codeId") String codeId,
            @Param("status") String status,
            @Param("approvalUserId") String approvalUserId,
            @Param("approvalDtime") String approvalDtime);
}
