package com.example.admin_demo.domain.emergencynotice.mapper;

import com.example.admin_demo.domain.emergencynotice.dto.EmergencyNoticeDeployStatusResponse;
import com.example.admin_demo.domain.emergencynotice.dto.EmergencyNoticeHistoryResponse;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 긴급공지 배포 관리 MyBatis Mapper
 *
 * FWK_PROPERTY 배포 상태 컬럼(DEPLOY_STATUS, START_DTIME, END_DTIME)과
 * FWK_PROPERTY_HISTORY 이력을 다룬다.
 */
@Mapper
public interface EmergencyNoticeDeployMapper {

    /**
     * 현재 배포 상태 조회 (USE_YN 행의 DEPLOY_STATUS, START_DTIME, END_DTIME)
     */
    EmergencyNoticeDeployStatusResponse selectDeployStatus();

    /**
     * 배포 이력 조회 (USE_YN 행의 FWK_PROPERTY_HISTORY, VERSION DESC).
     * 같은 VERSION의 EMERGENCY_KO·CLOSEABLE_YN·HIDE_TODAY_YN 행을 LEFT JOIN하여
     * 변경 상세 정보를 함께 반환한다.
     *
     * @param reason   구분 필터 (null·빈문자열이면 전체 조회)
     * @param offset   페이징 시작 위치 (0부터)
     * @param pageSize 페이지당 최대 건수
     */
    List<EmergencyNoticeHistoryResponse> selectHistory(
            @Param("reason") String reason,
            @Param("offset") int offset,
            @Param("pageSize") int pageSize);

    /**
     * 배포 이력 전체 건수 조회 (페이징 처리를 위한 totalCount).
     *
     * @param reason 구분 필터 (null·빈문자열이면 전체 건수)
     */
    int selectHistoryCount(@Param("reason") String reason);

    /**
     * 배포 시작 상태 업데이트
     * DEPLOY_STATUS='DEPLOYED', START_DTIME=now, END_DTIME=NULL
     */
    void updateDeployStart(
            @Param("startDtime") String startDtime,
            @Param("lastUpdateDtime") String lastUpdateDtime,
            @Param("lastUpdateUserId") String lastUpdateUserId);

    /**
     * 배포 종료 상태 업데이트
     * DEPLOY_STATUS='ENDED', END_DTIME=now
     */
    void updateDeployEnd(
            @Param("endDtime") String endDtime,
            @Param("lastUpdateDtime") String lastUpdateDtime,
            @Param("lastUpdateUserId") String lastUpdateUserId);

    /**
     * 닫기 버튼 노출 여부 업데이트 (CLOSEABLE_YN 행의 DEFAULT_VALUE)
     *
     * @param value           Y: 닫기 버튼 표시 / N: 강제 노출
     * @param lastUpdateDtime 변경 일시 (yyyyMMddHHmmss)
     * @param lastUpdateUserId 변경자 ID
     */
    void updateCloseableYn(
            @Param("value") String value,
            @Param("lastUpdateDtime") String lastUpdateDtime,
            @Param("lastUpdateUserId") String lastUpdateUserId);

    /**
     * 오늘 하루 보지 않기 체크박스 노출 여부 업데이트 (HIDE_TODAY_YN 행의 DEFAULT_VALUE)
     *
     * @param value           Y: 표시 / N: 숨김
     * @param lastUpdateDtime 변경 일시 (yyyyMMddHHmmss)
     * @param lastUpdateUserId 변경자 ID
     */
    void updateHideTodayYn(
            @Param("value") String value,
            @Param("lastUpdateDtime") String lastUpdateDtime,
            @Param("lastUpdateUserId") String lastUpdateUserId);

    /**
     * 배포 액션 시 'notice' 그룹 전체 행 스냅샷을 FWK_PROPERTY_HISTORY에 삽입
     * 각 PROPERTY_ID별로 기존 최대 VERSION + 1을 자동 계산한다.
     */
    void insertHistorySnapshot(
            @Param("reason") String reason,
            @Param("lastUpdateDtime") String lastUpdateDtime,
            @Param("lastUpdateUserId") String lastUpdateUserId);
}
