package com.example.batchwas.job.db2db;

import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.partition.support.Partitioner;
import org.springframework.batch.item.ExecutionContext;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * MEMBER_ID 범위 기반 Partitioner.
 *
 * <p>SAMPLE_MEMBER 테이블을 MEMBER_ID 범위로 분할하여 병렬 처리한다.
 * gridSize(파티션 수)에 따라 각 파티션에 minId~maxId 범위를 균등 배분한다.</p>
 *
 * <pre>
 * 예) MEMBER_ID 1~100, gridSize=4 이면:
 *   partition0: 1 ~ 25
 *   partition1: 26 ~ 50
 *   partition2: 51 ~ 75
 *   partition3: 76 ~ 100
 * </pre>
 */
@Slf4j
@RequiredArgsConstructor
public class ColumnRangePartitioner implements Partitioner {

    private final JdbcTemplate jdbcTemplate;

    /** 파티션 분할 기준 테이블 */
    private static final String TABLE = "SAMPLE_MEMBER";

    /** 파티션 분할 기준 컬럼 */
    private static final String COLUMN = "MEMBER_ID";

    /**
     * gridSize 수만큼 파티션을 생성한다.
     * 각 파티션의 ExecutionContext에 minValue, maxValue를 저장한다.
     *
     * @param gridSize 병렬 처리할 파티션 수 (스레드 수와 동일)
     * @return 파티션 이름 → ExecutionContext 맵
     */
    @Override
    public Map<String, ExecutionContext> partition(int gridSize) {
        // MEMBER_ID의 전체 범위 조회
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

        // 범위를 gridSize로 균등 분할
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

        log.info("파티션 생성 완료: table={}, gridSize={}, range={}~{}", TABLE, gridSize, minId, maxId);
        return result;
    }
}
