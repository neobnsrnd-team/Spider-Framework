// GET /dev/admin — AUTH_BYPASS 관리자 우회 진입
// 쿠키에 관리자 역할 설정 후 /approve로 리다이렉트

import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';

import { adminPath } from '@/lib/cms-admin-boundary';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    if (process.env.AUTH_BYPASS !== 'true') {
        redirect('/not-authorized');
    }

    const response = NextResponse.redirect(new URL(adminPath('/cms-admin/approvals'), req.url));
    response.cookies.set('cms_bypass_role', 'cms_admin', { path: '/' });
    return response;
}
