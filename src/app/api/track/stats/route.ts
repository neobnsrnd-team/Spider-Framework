// src/app/api/track/stats/route.ts
// 페이지 통계 조회 API — 조회수 + 컴포넌트별 클릭수 집계

import { NextRequest } from 'next/server';

import { getViewCountByPage, getClickCountByComponent } from '@/db/repository/page-view-log.repository';
import { successResponse, errorResponse, getErrorMessage } from '@/lib/api-response';
import { canReadCms, getCurrentUser } from '@/lib/current-user';

export async function GET(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        if (!canReadCms(currentUser)) {
            return errorResponse('Permission denied.', 403);
        }

        const pageId = req.nextUrl.searchParams.get('pageId');

        if (!pageId) {
            return errorResponse('pageId가 필요합니다.', 400);
        }

        const [viewCount, clicks] = await Promise.all([getViewCountByPage(pageId), getClickCountByComponent(pageId)]);

        const totalClicks = clicks.reduce((sum, c) => sum + c.CLICK_COUNT, 0);

        return successResponse({
            viewCount,
            totalClicks,
            clicks: clicks.map((c) => ({
                componentId: c.COMPONENT_ID,
                clickCount: c.CLICK_COUNT,
            })),
        });
    } catch (err: unknown) {
        console.error('통계 조회 실패:', err);
        return errorResponse(getErrorMessage(err));
    }
}
