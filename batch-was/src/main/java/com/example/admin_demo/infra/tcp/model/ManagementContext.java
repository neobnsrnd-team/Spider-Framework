package com.example.admin_demo.infra.tcp.model;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Admin ↔ batch-was 간 TCP 통신 메시지 모델.
 *
 * <p>Admin의 ManagementContext와 동일한 패키지/serialVersionUID를 유지해야
 * Java ObjectStream 역직렬화가 성공한다.</p>
 *
 * <p>Admin 경로와 이 파일의 내용·필드·serialVersionUID는 반드시 동일해야 한다.</p>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ManagementContext implements Serializable {

    private static final long serialVersionUID = 1L;

    /** 대상 WAS 인스턴스 ID */
    private String instanceId;

    /** 실행 커맨드 (BATCH_EXEC, PING 등) */
    private String command;

    /** 배치 APP ID */
    private String batchAppId;

    /** 배치 기준일 (YYYYMMDD) */
    private String batchDate;

    /** 실행 요청 사용자 ID */
    private String userId;

    /** 배치 파라미터 (key=value;key2=value2 형식, 선택) */
    private String parameters;

    /** 실행 결과 코드 (SUCCESS, ABNORMAL_TERMINATION 등) */
    private String resultCode;

    /** 배치 실행 시퀀스 (응답 시 채워짐) */
    private Integer executeSeq;

    /** 오류 정보 (실패 시 채워짐, 직렬화 전달 가능) */
    private Exception exception;
}
