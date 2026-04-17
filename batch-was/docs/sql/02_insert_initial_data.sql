-- =============================================================
-- batch-was 연동을 위한 Admin DB 초기 데이터
-- Admin DB(D_SPIDERLINK 스키마)에서 실행
-- =============================================================

-- 1. Batch WAS 인스턴스 등록
--    FWK_WAS_INSTANCE: Admin이 배치 실행 요청을 보낼 대상 WAS
INSERT INTO FWK_WAS_INSTANCE (
    INSTANCE_ID, INSTANCE_NAME, INSTANCE_DESC,
    INSTANCE_TYPE, IP, PORT, OPER_MODE_TYPE
) VALUES (
    'BWAS',                    -- application.yml의 batch.was.instance-id와 일치
    'Batch WAS',
    'Spring Batch 실행 WAS (POC)',
    'B',                       -- B: Batch WAS
    'localhost',
    '8081',                    -- batch-was 포트
    'N'                        -- N: 일반 운영
);

-- 2. 샘플 배치 Job 등록
--    BATCH_APP_FILE_NAME = Spring Batch JobRegistry Bean 이름

-- File2DBJob: CSV → SAMPLE_MEMBER 적재
INSERT INTO FWK_BATCH_APP (
    BATCH_APP_ID, BATCH_APP_NAME, BATCH_APP_FILE_NAME,
    BATCH_APP_DESC, BATCH_CYCLE, RETRYABLE_YN, IMPORTANT_TYPE,
    LAST_UPDATE_USER_ID
) VALUES (
    'FILE2DB_JOB',
    'File2DB 배치',
    'file2db',                 -- File2DbJobConfig @Bean(name="file2db")
    'CSV 파일 → Oracle DB 적재 (FlatFileItemReader → JdbcBatchItemWriter)',
    'O',                       -- O: 수시
    'Y',
    '2',                       -- 2: 중
    'SYSTEM'
);

-- DB2DBJob: SAMPLE_MEMBER → SAMPLE_MEMBER_BACKUP (페이징 + Partitioner)
INSERT INTO FWK_BATCH_APP (
    BATCH_APP_ID, BATCH_APP_NAME, BATCH_APP_FILE_NAME,
    BATCH_APP_DESC, BATCH_CYCLE, RETRYABLE_YN, IMPORTANT_TYPE,
    LAST_UPDATE_USER_ID
) VALUES (
    'DB2DB_JOB',
    'DB2DB 배치',
    'db2db',                   -- Db2DbJobConfig @Bean(name="db2db")
    'Oracle → Oracle 복사 (JdbcPagingItemReader + ColumnRangePartitioner 병렬처리)',
    'O',
    'Y',
    '2',
    'SYSTEM'
);

-- DB2ForeignJob: SAMPLE_MEMBER → 외부 시스템 HTTP 전문 연계
INSERT INTO FWK_BATCH_APP (
    BATCH_APP_ID, BATCH_APP_NAME, BATCH_APP_FILE_NAME,
    BATCH_APP_DESC, BATCH_CYCLE, RETRYABLE_YN, IMPORTANT_TYPE,
    LAST_UPDATE_USER_ID
) VALUES (
    'DB2FOREIGN_JOB',
    'DB2Foreign 배치',
    'db2foreign',              -- Db2ForeignJobConfig @Bean(name="db2foreign")
    'Oracle → 외부 시스템 HTTP 전문 연계 (JdbcPagingItemReader → RestTemplate)',
    'O',
    'Y',
    '2',
    'SYSTEM'
);

-- 3. 배치-인스턴스 매핑 등록
--    BWAS 인스턴스에서 3개 Job 모두 실행 가능
INSERT INTO FWK_WAS_EXEC_BATCH (BATCH_APP_ID, INSTANCE_ID, USE_YN, LAST_UPDATE_USER_ID)
VALUES ('FILE2DB_JOB', 'BWAS', 'Y', 'SYSTEM');

INSERT INTO FWK_WAS_EXEC_BATCH (BATCH_APP_ID, INSTANCE_ID, USE_YN, LAST_UPDATE_USER_ID)
VALUES ('DB2DB_JOB', 'BWAS', 'Y', 'SYSTEM');

INSERT INTO FWK_WAS_EXEC_BATCH (BATCH_APP_ID, INSTANCE_ID, USE_YN, LAST_UPDATE_USER_ID)
VALUES ('DB2FOREIGN_JOB', 'BWAS', 'Y', 'SYSTEM');

COMMIT;
