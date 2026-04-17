package com.example.batchwas.job.file2db;

import com.example.batchwas.job.common.SampleMember;
import javax.sql.DataSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.item.database.JdbcBatchItemWriter;
import org.springframework.batch.item.database.builder.JdbcBatchItemWriterBuilder;
import org.springframework.batch.item.file.FlatFileItemReader;
import org.springframework.batch.item.file.builder.FlatFileItemReaderBuilder;
import org.springframework.batch.item.file.mapping.BeanWrapperFieldSetMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.transaction.PlatformTransactionManager;

/**
 * File2DBJob 설정.
 *
 * <p>CSV 파일 → Oracle DB 적재 패턴을 시연한다.
 * FlatFileItemReader로 sample-data/members.csv를 읽어 SAMPLE_MEMBER 테이블에 INSERT.</p>
 *
 * <p>Job Bean 이름 "file2db"가 FWK_BATCH_APP.BATCH_APP_FILE_NAME과 일치해야 한다.</p>
 *
 * <pre>{@code
 * FWK_BATCH_APP: BATCH_APP_ID='FILE2DB_JOB', BATCH_APP_FILE_NAME='file2db'
 * }</pre>
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
public class File2DbJobConfig {

    /** Chunk 크기: 5건씩 읽어서 DB에 배치 INSERT */
    private static final int CHUNK_SIZE = 5;

    private final DataSource dataSource;

    /**
     * File2DBJob.
     * Job 이름이 JobRegistry의 키가 되므로 FWK_BATCH_APP.BATCH_APP_FILE_NAME과 일치.
     */
    @Bean(name = "file2db")
    public Job file2DbJob(JobRepository jobRepository, Step file2DbStep) {
        return new JobBuilder("file2db", jobRepository)
                .start(file2DbStep)
                .build();
    }

    @Bean
    public Step file2DbStep(JobRepository jobRepository,
                            PlatformTransactionManager transactionManager) {
        return new StepBuilder("file2DbStep", jobRepository)
                .<SampleMember, SampleMember>chunk(CHUNK_SIZE, transactionManager)
                .reader(file2DbReader())
                .processor(item -> {
                    // 간단한 검증: 이름이 없으면 skip
                    if (item.getMemberName() == null || item.getMemberName().isBlank()) {
                        log.warn("회원명 없음 — skip: memberId={}", item.getMemberId());
                        return null;
                    }
                    return item;
                })
                .writer(file2DbWriter())
                // skip: 개별 아이템 오류 시 해당 Chunk 내 아이템만 건너뜀 (트랜잭션 보장)
                .faultTolerant()
                .skip(Exception.class)
                .skipLimit(10)
                .build();
    }

    /**
     * CSV FlatFileItemReader.
     * 컬럼 순서: memberId, memberName, email, phone
     */
    @Bean
    public FlatFileItemReader<SampleMember> file2DbReader() {
        BeanWrapperFieldSetMapper<SampleMember> fieldSetMapper = new BeanWrapperFieldSetMapper<>();
        fieldSetMapper.setTargetType(SampleMember.class);

        return new FlatFileItemReaderBuilder<SampleMember>()
                .name("file2DbReader")
                .resource(new ClassPathResource("sample-data/members.csv"))
                // CSV 헤더 없음 — 컬럼 이름 직접 지정
                .delimited()
                .names("memberId", "memberName", "email", "phone")
                .fieldSetMapper(fieldSetMapper)
                .build();
    }

    /**
     * SAMPLE_MEMBER 테이블에 배치 INSERT.
     * 동일 MEMBER_ID가 있으면 MERGE로 UPSERT 처리.
     */
    @Bean
    public JdbcBatchItemWriter<SampleMember> file2DbWriter() {
        return new JdbcBatchItemWriterBuilder<SampleMember>()
                .dataSource(dataSource)
                .sql("""
                        MERGE INTO SAMPLE_MEMBER t
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
