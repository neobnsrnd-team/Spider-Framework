// src/app/api/track/view/route.ts
// 페이지 조회(VIEW) 트래킹 수신 API — 대고객 페이지에서 sendBeacon으로 호출

import { NextRequest } from 'next/server';

import { insertViewLog } from '@/db/repository/page-view-log.repository';
import {
    successResponse,
    errorResponse,
    getErrorMessage,
    TRACKER_CORS_HEADERS,
    trackerCorsOptionsResponse,
} from '@/lib/api-response';

// CORS preflight 요청 처리
export function OPTIONS() {
    return trackerCorsOptionsResponse();
}

export async function POST(req: NextRequest) {
    try {
        const { pageId } = await req.json();

        if (!pageId || typeof pageId !== 'string') {
            return errorResponse('pageId가 필요합니다.', 400, TRACKER_CORS_HEADERS);
        }

        await insertViewLog(pageId, 'VIEW');

        return successResponse(undefined, 200, TRACKER_CORS_HEADERS);
    } catch (err: unknown) {
        console.error('VIEW 로그 기록 실패:', err);
        return errorResponse(getErrorMessage(err), 500, TRACKER_CORS_HEADERS);
    }
}
