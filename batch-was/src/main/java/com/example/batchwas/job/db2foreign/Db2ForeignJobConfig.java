package com.example.batchwas.job.db2foreign;

import com.example.batchwas.job.common.SampleMember;
import java.util.Map;
import javax.sql.DataSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.database.JdbcPagingItemReader;
import org.springframework.batch.item.database.Order;
import org.springframework.batch.item.database.builder.JdbcPagingItemReaderBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.web.client.RestTemplate;

/**
 * DB2ForeignJob 설정.
 *
 * <p>DB → 외부 시스템 HTTP 전문 연계 패턴을 시연한다.
 * JdbcPagingItemReader로 SAMPLE_MEMBER를 페이징 조회한 후,
 * TransferItemWriter가 각 건을 Mock 외부 엔드포인트(POST /mock/external/transfer)로 전송한다.</p>
 *
 * <p>Job Bean 이름 "db2foreign"이 FWK_BATCH_APP.BATCH_APP_FILE_NAME과 일치해야 한다.</p>
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class Db2ForeignJobConfig {

    private static final int PAGE_SIZE = 5;

    private final DataSource dataSource;

    /** WAS 포트를 application.yml에서 읽어 Mock URL 구성에 사용 */
    @Value("${server.port:8081}")
    private int serverPort;

    @Bean(name = "db2foreign")
    public Job db2ForeignJob(JobRepository jobRepository, Step db2ForeignStep) {
        return new JobBuilder("db2foreign", jobRepository)
                .start(db2ForeignStep)
                .build();
    }

    @Bean
    public Step db2ForeignStep(JobRepository jobRepository,
                               PlatformTransactionManager transactionManager) {
        return new StepBuilder("db2ForeignStep", jobRepository)
                .<SampleMember, SampleMember>chunk(PAGE_SIZE, transactionManager)
                .reader(db2ForeignReader())
                .writer(transferItemWriter())
                .faultTolerant()
                .skip(RuntimeException.class)
                .skipLimit(5)
                .build();
    }

    /**
     * JdbcPagingItemReader: SAMPLE_MEMBER 전체를 pageSize 단위로 페이징 조회.
     */
    @Bean
    public JdbcPagingItemReader<SampleMember> db2ForeignReader() {
        return new JdbcPagingItemReaderBuilder<SampleMember>()
                .name("db2ForeignReader")
                .dataSource(dataSource)
                .selectClause("SELECT MEMBER_ID, MEMBER_NAME, EMAIL, PHONE")
                .fromClause("FROM SAMPLE_MEMBER")
                .sortKeys(Map.of("MEMBER_ID", Order.ASCENDING))
                .rowMapper(new BeanPropertyRowMapper<>(SampleMember.class))
                .pageSize(PAGE_SIZE)
                .build();
    }

    /**
     * 외부 전문 연계 Writer.
     * Mock URL: http://localhost:{port}/mock/external/transfer
     * 실제 운영 시 외부 기관 URL로 교체.
     */
    @Bean
    public TransferItemWriter transferItemWriter() {
        String mockUrl = "http://localhost:" + serverPort + "/mock/external/transfer";
        log.info("DB2Foreign Mock URL: {}", mockUrl);
        return new TransferItemWriter(new RestTemplate(), mockUrl);
    }
}
