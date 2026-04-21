-- =============================================================
-- batch-was 연동을 위한 Admin DB 초기 데이터
-- Admin DB(D_SPIDERLINK 스키마)에서 실행
-- ※ 쿼리 실행은 개발자가 DB에서 직접 수행해야 함
-- =============================================================

-- 1. Batch WAS 인스턴스 등록
--    FWK_WAS_INSTANCE: Admin이 배치 실행 요청을 보낼 대상 WAS
INSERT INTO FWK_WAS_INSTANCE (
    INSTANCE_ID, INSTANCE_NAME, INSTANCE_DESC,
    INSTANCE_TYPE, IP, PORT, OPER_MODE_TYPE
) VALUES (
    'BT01',                    -- BT(Batch) + 01 / application.yml의 batch.was.instance-id와 일치
    'Batch WAS',
    'Spring Batch 실행 WAS (POC)',
    '2',                       -- 2: AP (1:WEB, 2:AP, 3:통합)
    '127.0.0.1',
    '8081',                    -- batch-was 포트 (※ #41 TCP 전환 시 소켓 포트로 변경 예정)
    'D'                        -- D: 개발 서버 (D:개발, R:운영, T:테스트)
);

-- 2. 샘플 배치 Job 등록
--    BATCH_APP_FILE_NAME = Spring Batch JobRegistry Bean 이름

-- File2DBJob: poc-users.csv → POC_USER 적재
INSERT INTO FWK_BATCH_APP (
    BATCH_APP_ID, BATCH_APP_NAME, BATCH_APP_FILE_NAME,
    BATCH_APP_DESC, BATCH_CYCLE, RETRYABLE_YN, IMPORTANT_TYPE,
    LAST_UPDATE_USER_ID
) VALUES (
    'FILE2DB_JOB',
    'File2DB 배치',
    'file2db',                 -- File2DbJobConfig @Bean(name="file2db")
    'CSV 파일 → POC_USER 적재 (FlatFileItemReader → JdbcBatchItemWriter)',
    'O',                       -- O: 수시
    'Y',
    '2',                       -- 2: 중
    'SYSTEM'
);

-- DB2DBJob: POC_카드사용내역 → POC_카드사용내역_백업 (이용일자 파티셔닝 + 병렬처리)
INSERT INTO FWK_BATCH_APP (
    BATCH_APP_ID, BATCH_APP_NAME, BATCH_APP_FILE_NAME,
    BATCH_APP_DESC, BATCH_CYCLE, RETRYABLE_YN, IMPORTANT_TYPE,
    LAST_UPDATE_USER_ID
) VALUES (
    'DB2DB_JOB',
    'DB2DB 배치',
    'db2db',                   -- Db2DbJobConfig @Bean(name="db2db")
    'POC_카드사용내역 → POC_카드사용내역_백업 아카이브 (JdbcPagingItemReader + ColumnRangePartitioner 병렬처리)',
    'O',
    'Y',
    '2',
    'SYSTEM'
);

-- DB2ForeignJob: POC_카드사용내역 → 외부 시스템 HTTP 전문 연계
INSERT INTO FWK_BATCH_APP (
    BATCH_APP_ID, BATCH_APP_NAME, BATCH_APP_FILE_NAME,
    BATCH_APP_DESC, BATCH_CYCLE, RETRYABLE_YN, IMPORTANT_TYPE,
    LAST_UPDATE_USER_ID
) VALUES (
    'DB2FOREIGN_JOB',
    'DB2Foreign 배치',
    'db2foreign',              -- Db2ForeignJobConfig @Bean(name="db2foreign")
    'POC_카드사용내역 → 외부 시스템 HTTP 전문 연계 (JdbcPagingItemReader → RestTemplate)',
    'O',
    'Y',
    '2',
    'SYSTEM'
);

-- 3. 배치-인스턴스 매핑 등록
--    BT01 인스턴스에서 3개 Job 모두 실행 가능
INSERT INTO FWK_WAS_EXEC_BATCH (BATCH_APP_ID, INSTANCE_ID, USE_YN, LAST_UPDATE_USER_ID)
VALUES ('FILE2DB_JOB', 'BT01', 'Y', 'SYSTEM');

INSERT INTO FWK_WAS_EXEC_BATCH (BATCH_APP_ID, INSTANCE_ID, USE_YN, LAST_UPDATE_USER_ID)
VALUES ('DB2DB_JOB', 'BT01', 'Y', 'SYSTEM');

INSERT INTO FWK_WAS_EXEC_BATCH (BATCH_APP_ID, INSTANCE_ID, USE_YN, LAST_UPDATE_USER_ID)
VALUES ('DB2FOREIGN_JOB', 'BT01', 'Y', 'SYSTEM');

COMMIT;
