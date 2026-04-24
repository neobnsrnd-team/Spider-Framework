const CMS_BASE_PATH = process.env.NEXT_PUBLIC_CMS_BASE_PATH ?? '/cms';
const JAVA_API_BASE_URL = process.env.NEXT_PUBLIC_JAVA_API_BASE_URL ?? '';

function normalizeBasePath(basePath: string): string {
    const trimmed = basePath.trim();
    if (!trimmed || trimmed === '/') return '';
    return trimmed.startsWith('/') ? trimmed.replace(/\/$/, '') : `/${trimmed.replace(/\/$/, '')}`;
}

function normalizePath(path: string): string {
    return path.startsWith('/') ? path : `/${path}`;
}

export function nextApi(path: string): string {
    return `${normalizeBasePath(CMS_BASE_PATH)}${normalizePath(path)}`;
}

export function javaApi(path: string): string {
    const normalizedPath = normalizePath(path);
    const baseUrl = JAVA_API_BASE_URL.replace(/\/$/, '');
    return baseUrl ? `${baseUrl}${normalizedPath}` : normalizedPath;
}
