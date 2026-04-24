// src/app/api/scheduler/expire/route.ts
// 만료 페이지 일괄 처리 API — 외부 스케줄러(cron)에서 호출하는 얇은 래퍼

import { NextRequest } from 'next/server';

import { successResponse, errorResponse, getErrorMessage } from '@/lib/api-response';
import { runExpireJob } from '@/lib/scheduler';

const SCHEDULER_SECRET = process.env.SCHEDULER_SECRET ?? '';

export async function POST(req: NextRequest) {
    try {
        // 토큰 인증
        const token = req.headers.get('x-scheduler-token');
        if (!SCHEDULER_SECRET || token !== SCHEDULER_SECRET) {
            return errorResponse('인증 토큰이 유효하지 않습니다.', 401);
        }

        const { processed, failed } = await runExpireJob();
        return successResponse({ processed, failed });
    } catch (err: unknown) {
        console.error('만료 일괄 처리 오류:', err);
        return errorResponse(getErrorMessage(err));
    }
}
