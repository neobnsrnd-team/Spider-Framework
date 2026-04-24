// src/app/api/deploy/receive/route.ts
// 데모 전용 수신 엔드포인트 — 실제 운영 환경에서는 별도 서버로 교체
import { writeFile, mkdir } from 'fs/promises';
import { timingSafeEqual } from 'crypto';
import path from 'path';

import { NextRequest } from 'next/server';

import { errorResponse, getErrorMessage, successResponse } from '@/lib/api-response';
import { DEPLOY_SECRET } from '@/lib/env';

/** 타이밍 공격 방지 토큰 비교 */
function isValidToken(token: string | null): boolean {
    if (!DEPLOY_SECRET || !token) return false;
    try {
        const expected = Buffer.from(DEPLOY_SECRET, 'utf8');
        const received = Buffer.from(token, 'utf8');
        if (expected.length !== received.length) return false;
        return timingSafeEqual(expected, received);
    } catch {
        return false;
    }
}

export async function POST(req: NextRequest) {
    // 배포 토큰 인증
    if (!isValidToken(req.headers.get('x-deploy-token'))) {
        return errorResponse('인증 토큰이 유효하지 않습니다.', 401);
    }

    try {
        const { pageId, html, trackerJs } = (await req.json()) as {
            pageId?: string;
            html?: string;
            trackerJs?: string;
        };

        if (!pageId || typeof pageId !== 'string') {
            return errorResponse('pageId가 필요합니다.', 400);
        }
        if (!html || typeof html !== 'string') {
            return errorResponse('html이 필요합니다.', 400);
        }

        // 경로 트래버설 방지
        if (pageId.includes('..') || pageId.includes('/') || pageId.includes('\\')) {
            return errorResponse('유효하지 않은 pageId입니다.', 400);
        }

        // public/deployed/ 폴더에 HTML 저장
        const deployDir = path.join(process.cwd(), 'public', 'deployed');
        await mkdir(deployDir, { recursive: true });

        const filePath = path.join(deployDir, `${pageId}.html`);
        await writeFile(filePath, html, 'utf8');

        // 트래커 JS 파일 저장 (push에서 함께 전송된 경우)
        if (trackerJs && typeof trackerJs === 'string') {
            const trackerPath = path.join(process.cwd(), 'public', 'cms-tracker.js');
            await writeFile(trackerPath, trackerJs, 'utf8');
        }

        return successResponse({ path: `/deployed/${pageId}.html` });
    } catch (err: unknown) {
        console.error('배포 수신 처리 실패:', err);
        return errorResponse(getErrorMessage(err));
    }
}
