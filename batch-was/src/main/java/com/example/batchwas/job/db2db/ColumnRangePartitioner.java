package com.example.batchwas.job.db2db;

import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.partition.support.Partitioner;
import org.springframework.batch.item.ExecutionContext;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * 이용일자(YYYYMMDD) 범위 기반 Partitioner.
 *
 * <p>POC_카드사용내역 테이블을 이용일자 범위로 분할하여 병렬 처리한다.
 * 이용일자는 YYYYMMDD 형식의 VARCHAR2이지만 숫자로 변환하면 대소 비교가 동일하므로
 * TO_NUMBER를 사용해 MIN/MAX를 구하고 gridSize로 균등 분할한다.</p>
 *
 * <pre>
 * 예) 이용일자 20240101~20241231, gridSize=4 이면:
 *   partition0: 20240101 ~ 20240407
 *   partition1: 20240408 ~ 20240715
 *   partition2: 20240716 ~ 20241022
 *   partition3: 20241023 ~ 20241231
 * </pre>
 */
@Slf4j
@RequiredArgsConstructor
public class ColumnRangePartitioner implements Partitioner {

    private final JdbcTemplate jdbcTemplate;

    /** 파티션 분할 대상 테이블 */
    private static final String TABLE = "POC_카드사용내역";

    /** 파티션 분할 기준 컬럼 — YYYYMMDD VARCHAR2를 숫자 변환하여 범위 비교 */
    private static final String COLUMN = "TO_NUMBER(이용일자)";

    /**
     * gridSize 수만큼 파티션을 생성한다.
     * 각 파티션의 ExecutionContext에 minValue, maxValue(숫자형 날짜)를 저장한다.
     *
     * @param gridSize 병렬 처리할 파티션 수 (스레드 수와 동일)
     * @return 파티션 이름 → ExecutionContext 맵
     */
    @Override
    public Map<String, ExecutionContext> partition(int gridSize) {
        Long minId = jdbcTemplate.queryForObject(
                "SELECT MIN(" + COLUMN + ") FROM " + TABLE, Long.class);
        Long maxId = jdbcTemplate.queryForObject(
                "SELECT MAX(" + COLUMN + ") FROM " + TABLE, Long.class);

        if (minId == null || maxId == null) {
            log.warn("파티셔닝 대상 데이터 없음: table={}", TABLE);
            // 빈 파티션 하나 반환 (Job은 실행되지만 처리 건수 0)
            Map<String, ExecutionContext> empty = new HashMap<>();
            ExecutionContext ctx = new ExecutionContext();
            ctx.putLong("minValue", 0L);
            ctx.putLong("maxValue", 0L);
            empty.put("partition0", ctx);
            return empty;
        }

        long rangeSize = (maxId - minId) / gridSize + 1;
        Map<String, ExecutionContext> result = new HashMap<>();

        long start = minId;
        for (int i = 0; i < gridSize; i++) {
            long end = (i == gridSize - 1) ? maxId : start + rangeSize - 1;

            ExecutionContext ctx = new ExecutionContext();
            ctx.putLong("minValue", start);
            ctx.putLong("maxValue", end);
            result.put("partition" + i, ctx);

            log.debug("partition{}: {}~{}", i, start, end);
            start = end + 1;
        }

        log.info("파티션 생성 완료: table={}, gridSize={}, 이용일자={}~{}", TABLE, gridSize, minId, maxId);
        return result;
    }
}
