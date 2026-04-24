// src/app/view/page.tsx

import { Metadata } from 'next';

import { getPageById } from '@/db/repository/page.repository';
import { readPageHtml } from '@/lib/page-file';
import ViewClient from '@/components/view/ViewClient';
import type { ViewMode } from '@/db/types';

// Override default metadata from layout.tsx for this page
export async function generateMetadata(): Promise<Metadata> {
    return {
        title: 'View',
        description: '',
        icons: {
            icon: '/favicon.ico',
        },
    };
}

// DB PAGE_HTML 우선 → FILE_PATH 폴백 → PAGE_DESC 폴백
async function loadPage(bank: string): Promise<{ html: string; viewMode: ViewMode }> {
    const page = await getPageById(bank);
    const viewMode: ViewMode = page?.VIEW_MODE ?? 'mobile';

    if (!page) return { html: '', viewMode };

    // DB PAGE_HTML 우선 (getPageById의 SELECT *에 이미 포함)
    if (page.PAGE_HTML) return { html: page.PAGE_HTML, viewMode };

    // FILE_PATH 폴백 (기존 데이터 호환)
    if (page.FILE_PATH) {
        const content = await readPageHtml(page.FILE_PATH);
        if (content !== null) return { html: content, viewMode };
        // 파일 경로는 있는데 로컬에 파일 없음 → 안내 메시지
        return {
            html:
                '<div style="padding:40px;text-align:center;color:#6b7280;">' +
                '<p style="font-size:18px;font-weight:600;">페이지 콘텐츠를 찾을 수 없습니다.</p>' +
                '<p style="margin-top:8px;">에디터에서 저장 후 다시 시도해 주세요.</p>' +
                '</div>',
            viewMode,
        };
    }
    // 마이그레이션 이전 데이터: PAGE_DESC 폴백
    return { html: page.PAGE_DESC ?? '', viewMode };
}

export default async function View({ searchParams }: { searchParams: Promise<{ bank?: string; embed?: string }> }) {
    const params = await searchParams;
    // 경로 순회 방지: 영문·숫자·하이픈만 허용 (커스텀 탭 ID 포함)
    const rawBank = params.bank ?? '';
    const bank = /^[a-z0-9-]+$/i.test(rawBank) ? rawBank : 'ibk';
    // embed=1 이면 iframe 내부 렌더링 — 툴바 없이 콘텐츠만 표시
    const embed = params.embed === '1';

    let html = '';
    let viewMode: ViewMode = 'mobile';
    try {
        ({ html, viewMode } = await loadPage(bank));
    } catch (err: unknown) {
        console.error('페이지 콘텐츠 로드 실패:', err);
        html = '<p style="color:red;">저장된 콘텐츠가 없습니다. 에디터에서 저장 후 다시 시도하세요.</p>';
    }

    return <ViewClient html={html} viewMode={viewMode} bank={bank} embed={embed} />;
}
