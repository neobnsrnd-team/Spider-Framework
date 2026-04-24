// ============================================================================
// 금융 컴포넌트 시드 — SPW_CMS_COMPONENT
// ============================================================================
// 주의: 초기 시드는 이미 완료됨. 컴포넌트 데이터는 DB에서 직접 관리.
// 이 파일은 새 환경 구축 시 참고용으로 보존.
// 기존 finance-component-data*.ts의 정적 배열은 제거되었으므로,
// 재시드가 필요하면 DB 덤프 또는 별도 마이그레이션 스크립트를 사용할 것.

import { createComponent, getComponentById } from '@/db/repository/component.repository';
import type { FinanceComponent } from '@/data/finance-component-data';
import type { ComponentType, ViewMode } from '@/db/types';

/**
 * 금융 컴포넌트를 DB에 INSERT.
 * 이미 존재하는 컴포넌트는 건너뜀 (중복 안전).
 */
export async function seedFinanceComponents(
    components: FinanceComponent[],
): Promise<{ inserted: number; skipped: number }> {
    let inserted = 0;
    let skipped = 0;

    for (const comp of components) {
        const componentId = `${comp.id}-${comp.viewMode}`;

        // 중복 체크
        const existing = await getComponentById(componentId);
        if (existing) {
            console.log(`⏭ ${componentId} — 이미 존재, 건너뜀`);
            skipped++;
            continue;
        }

        await createComponent({
            componentId,
            componentType: 'finance' as ComponentType,
            viewMode: comp.viewMode as ViewMode,
            componentThumbnail: comp.preview,
            data: {
                id: comp.id,
                label: comp.label,
                description: comp.description,
                preview: comp.preview,
                html: comp.html,
                viewMode: comp.viewMode,
            },
            createUserId: 'system',
            createUserName: '시스템',
        });

        console.log(`✅ ${componentId} (${comp.label}) — INSERT 완료`);
        inserted++;
    }

    return { inserted, skipped };
}
