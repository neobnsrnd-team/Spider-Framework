package com.example.batchwas.job.db2foreign;

import com.example.batchwas.job.common.CardUsage;
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
 * JdbcPagingItemReader로 POC_카드사용내역을 페이징 조회한 후,
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
                .<CardUsage, CardUsage>chunk(PAGE_SIZE, transactionManager)
                .reader(db2ForeignReader())
                .writer(transferItemWriter())
                .faultTolerant()
                .skip(RuntimeException.class)
                .skipLimit(5)
                .build();
    }

    /**
     * JdbcPagingItemReader: POC_카드사용내역 전체를 pageSize 단위로 페이징 조회.
     * 한글 컬럼명을 영문 alias로 매핑하여 CardUsage Bean과 연결.
     */
    @Bean
    public JdbcPagingItemReader<CardUsage> db2ForeignReader() {
        return new JdbcPagingItemReaderBuilder<CardUsage>()
                .name("db2ForeignReader")
                .dataSource(dataSource)
                .selectClause("""
                        SELECT 이용자        AS userId,
                               카드번호      AS cardNo,
                               이용일자      AS usageDt,
                               이용가맹점    AS merchant,
                               이용금액      AS amount,
                               할부개월      AS installmentMonths,
                               승인여부      AS approvalYn,
                               카드명        AS cardName,
                               승인시각      AS approvalTime,
                               결제예정일    AS paymentDueDate,
                               승인번호      AS approvalNo,
                               결제잔액      AS paymentBalance,
                               누적결제금액  AS cumulativeAmount,
                               결제상태코드  AS paymentStatusCode,
                               최종결제일자  AS lastPaymentDt
                        """)
                .fromClause("FROM POC_카드사용내역")
                .sortKeys(Map.of("이용일자", Order.ASCENDING))
                .rowMapper(new BeanPropertyRowMapper<>(CardUsage.class))
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
