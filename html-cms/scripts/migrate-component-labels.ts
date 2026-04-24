// scripts/migrate-component-labels.ts
// 금융 컴포넌트 label·description 일괄 업데이트
// 실행: npx tsx scripts/migrate-component-labels.ts

import 'dotenv/config';
import { getComponentById, updateComponent } from '../src/db/repository/component.repository';
import { closePool } from '../src/db/connection';

const VIEW_MODES = ['mobile', 'web', 'responsive'] as const;

const COMPONENT_META: Record<string, { label: string; description: string }> = {
    'app-header':       { label: '상단 헤더',    description: '로고·은행명 표시 상단 헤더' },
    'product-menu':     { label: '퀵메뉴',        description: '아이콘 그리드 메뉴' },
    'product-gallery':  { label: '상품 갤러리',   description: '상품 카드 슬라이더' },
    'exchange-board':   { label: '환율 현황',      description: '실시간 환율 조회' },
    'branch-locator':   { label: '지점 등록',      description: '지도·영업점 검색' },
    'promo-banner':     { label: '홍보 배너',      description: '슬라이드 홍보 배너' },
    'media-video':      { label: '미디어',         description: '유튜브 영상 임베드' },
    'loan-calculator':  { label: '금융 계산기',    description: '대출·예금 이자 계산' },
    'auth-center':      { label: '인증센터',       description: '인증서·OTP 관리' },
    'site-footer':      { label: '푸터',           description: '약관·연락처·SNS 링크' },
};

async function main() {
    console.log('컴포넌트 label·description 마이그레이션 시작...\n');

    for (const [baseId, meta] of Object.entries(COMPONENT_META)) {
        for (const viewMode of VIEW_MODES) {
            const componentId = `${baseId}-${viewMode}`;
            const existing = await getComponentById(componentId);
            if (!existing) {
                console.warn(`⚠ ${componentId} — DB에서 찾을 수 없음, 건너뜀`);
                continue;
            }

            const currentData = (existing.DATA ?? {}) as Record<string, unknown>;
            await updateComponent({
                componentId,
                componentType: existing.COMPONENT_TYPE,
                viewMode: existing.VIEW_MODE,
                componentThumbnail: existing.COMPONENT_THUMBNAIL ?? undefined,
                data: { ...currentData, label: meta.label, description: meta.description },
                lastModifierId: 'system',
            });

            console.log(`✅ ${componentId} — "${meta.label}" / "${meta.description}"`);
        }
    }

    await closePool();
    console.log('\n마이그레이션 완료.');
}

main().catch((err) => { console.error('마이그레이션 실패:', err); process.exit(1); });
