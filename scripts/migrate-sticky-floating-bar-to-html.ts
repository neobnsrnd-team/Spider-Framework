// scripts/migrate-sticky-floating-bar-to-html.ts
// sticky-floating-bar 플러그인 컴포넌트 신규 등록
// DB SPW_CMS_COMPONENT에 플로팅 액션 바 컴포넌트 INSERT
// 실행: npx tsx scripts/migrate-sticky-floating-bar-to-html.ts

import 'dotenv/config';
import { getComponentById, createComponent } from '../src/db/repository/component.repository';
import { closePool } from '../src/db/connection';

// 썸네일 경로 (public/assets/plugins/ 하위)
const THUMBNAIL_PATH = '/assets/plugins/sticky-floating-bar/thumbnail.svg';

// 플러그인 컴포넌트 HTML 템플릿
// data-cb-type: ContentBuilder가 플러그인을 인식하는 속성
// mount() 함수가 이 엘리먼트에 DOM과 스크롤 동작을 주입
const COMPONENT_HTML = '<div data-cb-type="sticky-floating-bar" data-spw-block></div>';

// 등록할 컴포넌트 variant 목록
const VARIANTS: Array<{
    id: string;
    label: string;
    description: string;
    viewMode: 'mobile' | 'web' | 'responsive';
}> = [
    {
        id:          'sticky-floating-bar-mobile',
        label:       '플로팅 액션 바',
        description: '이벤트·상품 상세 페이지 하단에 고정되는 CTA 버튼 바 (모바일)',
        viewMode:    'mobile',
    },
    {
        id:          'sticky-floating-bar-web',
        label:       '플로팅 액션 바',
        description: '이벤트·상품 상세 페이지 하단에 고정되는 CTA 버튼 바 (웹)',
        viewMode:    'web',
    },
    {
        id:          'sticky-floating-bar-responsive',
        label:       '플로팅 액션 바',
        description: '이벤트·상품 상세 페이지 하단에 고정되는 CTA 버튼 바 (반응형)',
        viewMode:    'responsive',
    },
];

async function main() {
    console.log('sticky-floating-bar 컴포넌트 등록 마이그레이션 시작...\n');

    for (const variant of VARIANTS) {
        // 중복 체크
        const existing = await getComponentById(variant.id);
        if (existing) {
            console.log(`⏭  ${variant.id} — 이미 존재합니다. 건너뜁니다.`);
            continue;
        }

        await createComponent({
            componentId:        variant.id,
            componentType:      'finance',
            viewMode:           variant.viewMode,
            componentThumbnail: THUMBNAIL_PATH,
            data: {
                id:          variant.id,
                label:       variant.label,
                description: variant.description,
                preview:     THUMBNAIL_PATH,
                html:        COMPONENT_HTML,
                viewMode:    variant.viewMode,
            },
            createUserId:   'system',
            createUserName: '시스템',
        });

        console.log(`✅ ${variant.id} (${variant.label}) — INSERT 완료`);
    }

    await closePool();
    console.log('\n마이그레이션 완료.');
}

main().catch((err) => {
    console.error('마이그레이션 실패:', err);
    process.exit(1);
});
