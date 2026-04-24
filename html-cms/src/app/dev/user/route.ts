// GET /dev/user — AUTH_BYPASS 일반유저 복귀
// 쿠키에 일반유저 역할 설정 후 /dashboard로 리다이렉트

import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const basePath = process.env.NEXT_PUBLIC_CMS_BASE_PATH || '/cms';

export async function GET(req: NextRequest) {
    if (process.env.AUTH_BYPASS !== 'true') {
        redirect('/not-authorized');
    }

    const response = NextResponse.redirect(new URL(`${basePath}/dashboard`, req.url));
    response.cookies.set('cms_bypass_role', 'cms_user', { path: '/' });
    return response;
}
