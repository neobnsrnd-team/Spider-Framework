// src/app/api/components/route.ts
// 컴포넌트 목록 조회 / 수정 API — DB 전용

import { NextRequest, NextResponse } from 'next/server';
import type { FinanceComponent } from '@/data/finance-component-data';
import type { ComponentType, ViewMode, CmsComponentParsed } from '@/db/types';
import { getComponentList, getComponentById, updateComponent } from '@/db/repository/component.repository';
import { errorResponse, getErrorMessage } from '@/lib/api-response';
import { canReadCms, canWriteCms, getCurrentUser } from '@/lib/current-user';

const VALID_TYPES = new Set<string>(['finance', 'basic']);
const VALID_VIEW_MODES = new Set<string>(['mobile', 'web', 'responsive']);

function durationMs(start: number) {
    return Math.round((performance.now() - start) * 10) / 10;
}

/** DB 컴포넌트 → 프론트엔드 FinanceComponent 변환 */
function toFinanceComponent(row: CmsComponentParsed): FinanceComponent | null {
    const d = row.DATA;
    if (!d) return null;

    const viewMode = d.viewMode;
    const isValidViewMode = typeof viewMode === 'string' && VALID_VIEW_MODES.has(viewMode);

    return {
        id: typeof d.id === 'string' ? d.id : row.COMPONENT_ID,
        label: typeof d.label === 'string' ? d.label : '',
        description: typeof d.description === 'string' ? d.description : '',
        preview:
            typeof d.preview === 'string'
                ? d.preview
                : typeof d.thumbnail === 'string'
                  ? d.thumbnail
                  : (row.COMPONENT_THUMBNAIL ?? ''),
        html: typeof d.html === 'string' ? d.html : '',
        viewMode: isValidViewMode ? (viewMode as FinanceComponent['viewMode']) : row.VIEW_MODE,
    };
}

export async function GET(req: NextRequest) {
    const totalStart = performance.now();
    try {
        const authStart = performance.now();
        const currentUser = await getCurrentUser();
        const authMs = durationMs(authStart);
        if (!canReadCms(currentUser)) {
            return errorResponse('Permission denied.', 403);
        }

        const parseStart = performance.now();
        const { searchParams } = req.nextUrl;
        const type = searchParams.get('type') ?? undefined;
        const mode = searchParams.get('viewMode') ?? undefined;

        // 입력 검증
        const componentType = type && VALID_TYPES.has(type) ? (type as ComponentType) : undefined;
        const viewMode = mode && VALID_VIEW_MODES.has(mode) ? (mode as ViewMode) : undefined;
        const parseMs = durationMs(parseStart);

        const queryStart = performance.now();
        const rows = await getComponentList({ componentType, viewMode });
        const queryMs = durationMs(queryStart);
        const transformStart = performance.now();
        const components = rows.map(toFinanceComponent).filter((c): c is FinanceComponent => c !== null);
        const transformMs = durationMs(transformStart);
        const totalMs = durationMs(totalStart);

        return NextResponse.json(
            {
                ok: true,
                components,
                _timing: {
                    totalMs,
                    authMs,
                    parseMs,
                    queryMs,
                    transformMs,
                    count: components.length,
                },
            },
            {
                headers: {
                    'Server-Timing': `auth;dur=${authMs}, parse;dur=${parseMs}, query;dur=${queryMs}, transform;dur=${transformMs}, total;dur=${totalMs}`,
                },
            },
        );
    } catch (err: unknown) {
        console.error('컴포넌트 목록 조회 오류:', err);
        return errorResponse(getErrorMessage(err));
    }
}

export async function PUT(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        if (!canWriteCms(currentUser)) {
            return errorResponse('Permission denied.', 403);
        }

        const body = await req.json();
        if (typeof body !== 'object' || body === null) {
            return errorResponse('잘못된 요청 본문입니다.', 400);
        }

        const { componentId, viewMode, label, description, html } = body as Record<string, unknown>;

        if (typeof componentId !== 'string' || typeof viewMode !== 'string') {
            return errorResponse('componentId와 viewMode는 필수 문자열입니다.', 400);
        }

        // DB COMPONENT_ID는 "{id}-{viewMode}" 형식으로 저장됨
        const dbComponentId = `${componentId}-${viewMode}`;

        // 기존 컴포넌트 조회 (COMPONENT_TYPE, VIEW_MODE 보존용)
        const existing = await getComponentById(dbComponentId);
        if (!existing) {
            return errorResponse('컴포넌트를 찾을 수 없습니다.', 404);
        }

        // 기존 DATA에 label / description / html 만 덮어씀
        const currentData = (existing.DATA ?? {}) as Record<string, unknown>;
        const newData: Record<string, unknown> = {
            ...currentData,
            ...(label !== undefined && { label }),
            ...(description !== undefined && { description }),
            ...(html !== undefined && { html }),
        };

        await updateComponent({
            componentId: dbComponentId,
            componentType: existing.COMPONENT_TYPE,
            viewMode: existing.VIEW_MODE,
            componentThumbnail: existing.COMPONENT_THUMBNAIL ?? undefined,
            data: newData,
            lastModifierId: currentUser.userId,
        });

        return NextResponse.json({ ok: true });
    } catch (err: unknown) {
        console.error('컴포넌트 수정 오류:', err);
        return errorResponse(getErrorMessage(err));
    }
}
