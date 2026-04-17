package com.example.batchwas.job.db2db;

import com.example.batchwas.job.common.SampleMember;
import java.util.Map;
import javax.sql.DataSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.partition.PartitionHandler;
import org.springframework.batch.core.partition.support.TaskExecutorPartitionHandler;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.database.JdbcBatchItemWriter;
import org.springframework.batch.item.database.JdbcPagingItemReader;
import org.springframework.batch.item.database.Order;
import org.springframework.batch.item.database.builder.JdbcBatchItemWriterBuilder;
import org.springframework.batch.item.database.builder.JdbcPagingItemReaderBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskExecutor;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.transaction.PlatformTransactionManager;

/**
 * DB2DBJob 설정.
 *
 * <p>Oracle → Oracle 복사 패턴을 시연한다. 대용량 처리를 위해:
 * <ul>
 *   <li>JdbcPagingItemReader: pageSize 단위로 페이징 조회</li>
 *   <li>ColumnRangePartitioner: MEMBER_ID 범위로 분할하여 병렬 처리</li>
 *   <li>TaskExecutorPartitionHandler: 멀티스레드로 파티션 병렬 실행</li>
 * </ul>
 * </p>
 *
 * <p>Job Bean 이름 "db2db"가 FWK_BATCH_APP.BATCH_APP_FILE_NAME과 일치해야 한다.</p>
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class Db2DbJobConfig {

    /** 페이지 당 읽을 건수 */
    private static final int PAGE_SIZE = 5;

    /** 병렬 처리할 파티션(스레드) 수 */
    private static final int GRID_SIZE = 4;

    private final DataSource dataSource;

    @Bean(name = "db2db")
    public Job db2DbJob(JobRepository jobRepository,
                        Step db2DbPartitionStep) {
        return new JobBuilder("db2db", jobRepository)
                .start(db2DbPartitionStep)
                .build();
    }

    /**
     * 매니저 Step: Partitioner로 파티션을 분할하고 PartitionHandler로 병렬 실행.
     */
    @Bean
    public Step db2DbPartitionStep(JobRepository jobRepository,
                                   Step db2DbWorkerStep,
                                   JdbcTemplate jdbcTemplate) {
        return new StepBuilder("db2DbPartitionStep", jobRepository)
                .partitioner("db2DbWorkerStep", new ColumnRangePartitioner(jdbcTemplate))
                .partitionHandler(db2DbPartitionHandler(db2DbWorkerStep))
                .build();
    }

    /**
     * TaskExecutorPartitionHandler: 각 파티션을 별도 스레드에서 병렬 실행.
     */
    @Bean
    public PartitionHandler db2DbPartitionHandler(Step db2DbWorkerStep) {
        TaskExecutorPartitionHandler handler = new TaskExecutorPartitionHandler();
        handler.setStep(db2DbWorkerStep);
        handler.setTaskExecutor(db2DbTaskExecutor());
        handler.setGridSize(GRID_SIZE);
        return handler;
    }

    /**
     * 파티션 병렬 실행용 스레드 풀.
     */
    @Bean
    public TaskExecutor db2DbTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(GRID_SIZE);
        executor.setMaxPoolSize(GRID_SIZE);
        executor.setThreadNamePrefix("db2db-partition-");
        executor.initialize();
        return executor;
    }

    /**
     * 워커 Step: 각 파티션(minValue~maxValue 범위)에서 페이징 읽기 → BACKUP 테이블에 쓰기.
     */
    @Bean
    public Step db2DbWorkerStep(JobRepository jobRepository,
                                PlatformTransactionManager transactionManager) {
        return new StepBuilder("db2DbWorkerStep", jobRepository)
                .<SampleMember, SampleMember>chunk(PAGE_SIZE, transactionManager)
                .reader(db2DbReader(null, null))   // @StepScope로 런타임 주입
                .writer(db2DbWriter())
                .faultTolerant()
                .skip(Exception.class)
                .skipLimit(10)
                .build();
    }

    /**
     * JdbcPagingItemReader: 파티션의 minValue~maxValue 범위에서 페이징 조회.
     *
     * @param minValue 파티션 시작 MEMBER_ID (ColumnRangePartitioner가 ExecutionContext에 주입)
     * @param maxValue 파티션 종료 MEMBER_ID
     */
    @Bean
    @StepScope
    public JdbcPagingItemReader<SampleMember> db2DbReader(
            @Value("#{stepExecutionContext['minValue']}") Long minValue,
            @Value("#{stepExecutionContext['maxValue']}") Long maxValue) {

        log.debug("db2DbReader 생성: minValue={}, maxValue={}", minValue, maxValue);

        return new JdbcPagingItemReaderBuilder<SampleMember>()
                .name("db2DbReader")
                .dataSource(dataSource)
                .selectClause("SELECT MEMBER_ID, MEMBER_NAME, EMAIL, PHONE")
                .fromClause("FROM SAMPLE_MEMBER")
                // 파티션 범위 조건
                .whereClause("WHERE MEMBER_ID BETWEEN :minValue AND :maxValue")
                .sortKeys(Map.of("MEMBER_ID", Order.ASCENDING))
                .rowMapper(new BeanPropertyRowMapper<>(SampleMember.class))
                .parameterValues(Map.of(
                        "minValue", minValue != null ? minValue : 0L,
                        "maxValue", maxValue != null ? maxValue : Long.MAX_VALUE))
                .pageSize(PAGE_SIZE)
                .build();
    }

    /**
     * SAMPLE_MEMBER_BACKUP 테이블에 배치 INSERT.
     */
    @Bean
    public JdbcBatchItemWriter<SampleMember> db2DbWriter() {
        return new JdbcBatchItemWriterBuilder<SampleMember>()
                .dataSource(dataSource)
                .sql("""
                        MERGE INTO SAMPLE_MEMBER_BACKUP t
                        USING (SELECT :memberId AS MEMBER_ID FROM DUAL) s
                        ON (t.MEMBER_ID = s.MEMBER_ID)
                        WHEN MATCHED THEN UPDATE SET
                            t.MEMBER_NAME = :memberName,
                            t.EMAIL       = :email,
                            t.PHONE       = :phone
                        WHEN NOT MATCHED THEN INSERT (MEMBER_ID, MEMBER_NAME, EMAIL, PHONE)
                        VALUES (:memberId, :memberName, :email, :phone)
                        """)
                .beanMapped()
                .build();
    }
}
