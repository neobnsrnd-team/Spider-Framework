// src/app/api/codes/route.ts
// GET /api/codes?groupId=CS00001 — FWK_CODE 코드 목록 조회

import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-response';
import { getCodesByGroup } from '@/lib/codes';

export async function GET(request: NextRequest) {
    const groupId = request.nextUrl.searchParams.get('groupId');
    if (!groupId) {
        return errorResponse('groupId 파라미터가 필요합니다', 400);
    }

    const codes = await getCodesByGroup(groupId);
    return successResponse({ data: codes });
}
