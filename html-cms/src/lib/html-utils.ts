// src/lib/html-utils.ts
// HTML 처리 공통 유틸리티

/** HTML 특수문자 이스케이프 (XSS 방지) */
export const escapeHtml = (str: string): string =>
    str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m] ?? m);

/** rgb(r,g,b) / rgba(r,g,b,a) → #RRGGBB 변환 (DOM style 값 파싱용, 알파값 무시)
 * fallback 미지정 시 파싱 실패하면 원본 문자열 반환 */
export const rgbToHex = (rgb: string, fallback?: string): string => {
    if (!rgb || !rgb.startsWith('rgb')) return /^#[0-9A-Fa-f]{6}$/.test(rgb) ? rgb : (fallback ?? rgb);
    const parts = rgb.match(/\d+/g);
    if (!parts || parts.length < 3) return fallback ?? rgb;
    return (
        '#' +
        parts
            .slice(0, 3)
            .map((x) => Number(x).toString(16).padStart(2, '0'))
            .join('')
            .toUpperCase()
    );
};
