-- ============================================================================
-- Springware CMS — Oracle 11g XE 트리거 스크립트
-- ============================================================================
-- 이슈 #26 ERD v5 기준 | 트리거 3개
--   - TRIGGER 1~3: LAST_MODIFIED_DTIME 자동 갱신 (UPDATE 시)
-- 최종 수정: 2026-03-24 (#80 SEQ 시퀀스/트리거 제거)
--
-- ※ DBeaver 실행 방법:
--    /부분 제외하고 create부터 ;까지 별개로 하나씩 실행해주세요.
-- ============================================================================


-- 1. COMPONENT 트리거
CREATE OR REPLACE TRIGGER TRG_SPW_COMPONENT_MOD_DTIME
BEFORE UPDATE ON SPW_CMS_COMPONENT
                  FOR EACH ROW
BEGIN
    :NEW.LAST_MODIFIED_DTIME := SYSTIMESTAMP;
END;
/

-- 2. PAGE 트리거
CREATE OR REPLACE TRIGGER TRG_SPW_PAGE_MOD_DTIME
BEFORE UPDATE ON SPW_CMS_PAGE
                  FOR EACH ROW
BEGIN
    :NEW.LAST_MODIFIED_DTIME := SYSTIMESTAMP;
END;
/

-- 3. MAP 수정일 트리거
CREATE OR REPLACE TRIGGER TRG_SPW_COMP_MAP_MOD_DTIME
BEFORE UPDATE ON SPW_CMS_COMP_PAGE_MAP
                  FOR EACH ROW
BEGIN
    :NEW.LAST_MODIFIED_DTIME := SYSTIMESTAMP;
END;
/


-- ════════════════════════════════════════════════════════════════════════════
-- [검증] 트리거 생성 확인
-- ════════════════════════════════════════════════════════════════════════════
SELECT trigger_name, table_name, status
FROM user_triggers
WHERE table_name LIKE 'SPW_CMS_%'
ORDER BY table_name;
