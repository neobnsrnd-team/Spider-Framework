import { NextResponse } from 'next/server';

const ADMIN_BASE_URL =
    process.env.CMS_ADMIN_BASE_URL ??
    process.env.SPIDER_ADMIN_BASE_URL ??
    process.env.JAVA_ADMIN_API_BASE_URL ??
    process.env.NEXT_PUBLIC_JAVA_API_BASE_URL ??
    '';

function normalizeBaseUrl(baseUrl: string): string {
    return baseUrl.trim().replace(/\/$/, '');
}

function normalizePath(path: string): string {
    return path.startsWith('/') ? path : `/${path}`;
}

export function adminPath(path: string): string {
    const normalizedPath = normalizePath(path);
    const baseUrl = normalizeBaseUrl(ADMIN_BASE_URL);
    return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
}

export function deprecatedCmsAdminApiResponse(adminRoute: string, message?: string): NextResponse {
    return NextResponse.json(
        {
            success: false,
            code: 'CMS_ADMIN_API_MOVED',
            message:
                message ??
                'This CMS admin operation is owned by spider-admin. Use the spider-admin CMS admin API instead.',
            adminRoute,
        },
        { status: 410 },
    );
}
