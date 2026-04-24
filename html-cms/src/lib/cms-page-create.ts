import { nextApi } from '@/lib/api-url';

export type CmsPageViewMode = 'mobile' | 'web' | 'responsive';

export interface CreateCmsPageInput {
    pageName: string;
    viewMode: CmsPageViewMode;
    templateId?: string;
}

export interface CreateCmsPageResult {
    pageId: string;
    editorUrl: string;
}

export async function createCmsPage(input: CreateCmsPageInput): Promise<CreateCmsPageResult> {
    const pageName = input.pageName.trim();
    if (!pageName) {
        throw new Error('페이지명을 입력하세요.');
    }

    const res = await fetch(nextApi('/api/builder/save'), {
        method: 'POST',
        body: JSON.stringify({
            html: '',
            pageName,
            viewMode: input.viewMode,
            templateId: input.templateId ?? 'blank',
        }),
        headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();

    if (!res.ok || !data.ok || !data.pageId) {
        throw new Error(data.error || '페이지 생성에 실패했습니다.');
    }

    return {
        pageId: data.pageId,
        editorUrl: typeof data.editorUrl === 'string' ? data.editorUrl : nextApi(`/edit?bank=${data.pageId}`),
    };
}
