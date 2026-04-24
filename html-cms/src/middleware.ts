// src/middleware.ts
// CORS 응답 헤더 주입 — CORS_ALLOWED_ORIGINS에 등록된 오리진만 허용

import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = (process.env.CORS_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

function setCorsHeaders(res: NextResponse, origin: string): void {
    res.headers.set('Access-Control-Allow-Origin', origin);
    res.headers.append('Vary', 'Origin');
    res.headers.set('Access-Control-Allow-Credentials', 'true');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-deploy-token');
    res.headers.set('Access-Control-Max-Age', '86400');
}

export function middleware(req: NextRequest): NextResponse {
    const origin = req.headers.get('origin') ?? '';
    const isAllowed = ALLOWED_ORIGINS.length > 0 && ALLOWED_ORIGINS.includes(origin);

    // Preflight 요청 처리
    if (req.method === 'OPTIONS') {
        const res = new NextResponse(null, { status: 204 });
        if (isAllowed) setCorsHeaders(res, origin);
        return res;
    }

    const res = NextResponse.next();
    if (isAllowed) setCorsHeaders(res, origin);
    return res;
}

export const config = {
    matcher: [
        // API 라우트 및 페이지 라우트 모두 적용 (정적 파일·_next 제외)
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
