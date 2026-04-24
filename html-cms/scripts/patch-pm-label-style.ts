// scripts/patch-pm-label-style.ts
// product-menu 컴포넌트 pm-label에 data-max-chars="20" 추가 및 CSS 패치
// 기존 커스터마이징(아이콘·색상·레이블 텍스트) 보존
// 실행: npx tsx scripts/patch-pm-label-style.ts

import 'dotenv/config';
import { getComponentById, updateComponent } from '../src/db/repository/component.repository';
import { closePool } from '../src/db/connection';

const COMPONENT_IDS = ['product-menu-mobile', 'product-menu-web', 'product-menu-responsive'];

// 기존 pm-label style 문자열 패턴 → 새 스타일로 교체
// data-max-chars가 이미 있으면 재적용 방지
function patchHtml(html: string): { patched: string; changed: boolean } {
    let patched = html;

    // 1. data-max-chars 없는 pm-label에 추가
    patched = patched.replace(
        /(<span class="pm-label"(?!\s[^>]*data-max-chars))/g,
        '$1 data-max-chars="20"',
    );

    // 2. word-break:keep-all 만 있고 overflow-wrap이 없으면 추가
    patched = patched.replace(
        /word-break:keep-all;(?!.*overflow-wrap)/g,
        'word-break:keep-all;overflow-wrap:anywhere;max-width:100%;',
    );

    // 3. pm-icon-wrap 내 SVG에 aria-hidden="true" 추가 (없는 경우만)
    //    장식용 SVG → 스크린 리더 중복 낭독 방지
    patched = patched.replace(
        /(<svg\b(?![^>]*\baria-hidden\b)[^>]*)(>)/g,
        '$1 aria-hidden="true"$2',
    );

    return { patched, changed: patched !== html };
}

async function main() {
    console.log('pm-label 스타일 패치 시작...\n');

    for (const id of COMPONENT_IDS) {
        const comp = await getComponentById(id);
        if (!comp) {
            console.warn(`⚠️  ${id} — DB에서 찾을 수 없습니다. 건너뜁니다.`);
            continue;
        }

        const currentData = (comp.DATA ?? {}) as Record<string, unknown>;
        const currentHtml = (currentData.html as string) ?? '';

        if (!currentHtml) {
            console.warn(`⚠️  ${id} — html 필드가 비어 있습니다. 건너뜁니다.`);
            continue;
        }

        const { patched, changed } = patchHtml(currentHtml);

        if (!changed) {
            console.log(`✅ ${id} — 이미 최신 상태입니다.`);
            continue;
        }

        await updateComponent({
            componentId:        id,
            componentType:      comp.COMPONENT_TYPE,
            viewMode:           comp.VIEW_MODE,
            componentThumbnail: comp.COMPONENT_THUMBNAIL ?? undefined,
            data: { ...currentData, html: patched },
            lastModifierId: 'system',
        });

        console.log(`✅ ${id} — 패치 완료`);
    }

    await closePool();
    console.log('\npm-label 스타일 패치 완료.');
}

main().catch((err) => {
    console.error('패치 실패:', err);
    process.exit(1);
});
