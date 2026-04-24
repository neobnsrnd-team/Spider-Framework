// src/components/edit/FlexListEditor.tsx
// flex-list 가변형 멀티 컬럼 컴포넌트 편집 모달 (Issue #234, #244, #245, #246, #256, #255 형태)
// 행 추가·삭제·순서변경, 컬럼 추가·삭제, 타입 토글, 너비 선택, 아이콘 프리셋, 텍스트 행 관리

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

import { openCmsFilesPicker } from '@/lib/cms-file-picker';

// ── 데이터 모델 ──────────────────────────────────────────────────────────

interface FlexListLine {
    text: string;
    align?: 'left' | 'center' | 'right';
}

interface FlexListColumn {
    type: 'icon' | 'text' | 'image';
    width: 'fixed' | 'flex' | 'auto' | 'custom';
    icon?: string;
    iconBg?: string;
    lines?: FlexListLine[];
    href?: string;
    imageSrc?: string;
    customWidth?: string;
    shape?: 'circle' | 'round' | 'square' | 'none'; // 아이콘/이미지 형태 (기본 circle)
}

interface FlexListRow {
    columns: FlexListColumn[];
    linkMode?: 'row' | 'column' | 'none';
    rowHref?: string;
    bgColor?: string; // 행 배경색
    padding?: string; // 행 패딩 (예: '16px 20px')
    gap?: string; // 컬럼 간격 (예: '12px')
    border?: {
        show: boolean;
        color?: string;
        width?: number;
    };
}

type ViewMode = 'mobile' | 'web' | 'responsive';

interface Props {
    blockEl: HTMLElement;
    onClose: () => void;
}

const FONT_FAMILY = "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif";

// ── 아이콘 프리셋 ────────────────────────────────────────────────────────

const ICON_PRESETS: { key: string; label: string; svg: string }[] = [
    {
        key: 'card',
        label: '카드',
        svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
    },
    {
        key: 'transfer',
        label: '이체',
        svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l-4-4 4-4"/><path d="M3 13h13"/><path d="M17 7l4 4-4 4"/><path d="M21 11H8"/></svg>',
    },
    {
        key: 'account',
        label: '계좌',
        svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>',
    },
    {
        key: 'savings',
        label: '적금',
        svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2"/><path d="M2 9.1C1.8 9 1.5 9 1 9"/></svg>',
    },
    {
        key: 'loan',
        label: '대출',
        svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>',
    },
    {
        key: 'insurance',
        label: '보험',
        svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    },
    {
        key: 'shopping',
        label: '쇼핑',
        svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    },
    {
        key: 'notification',
        label: '알림',
        svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    },
    {
        key: 'calendar',
        label: '달력',
        svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>',
    },
    {
        key: 'check',
        label: '체크',
        svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>',
    },
    {
        key: 'arrow',
        label: '화살표',
        svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>',
    },
    {
        key: 'won',
        label: '원화',
        svg: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l4 16 4-12 4 12 4-16"/><path d="M3 10h18"/><path d="M3 14h18"/></svg>',
    },
];

// 마이그레이션 스크립트와 동일한 아이콘 SVG (size 20)
const ICONS_20: Record<string, string> = {
    card: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
    transfer:
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l-4-4 4-4"/><path d="M3 13h13"/><path d="M17 7l4 4-4 4"/><path d="M21 11H8"/></svg>',
    account:
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>',
    savings:
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2"/><path d="M2 9.1C1.8 9 1.5 9 1 9"/></svg>',
    loan: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>',
    insurance:
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    shopping:
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    notification:
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    calendar:
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>',
    won: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l4 16 4-12 4 12 4-16"/><path d="M3 10h18"/><path d="M3 14h18"/></svg>',
};

// ── href 보안 처리 ───────────────────────────────────────────────────────

function sanitizeHref(url: string): string {
    const trimmed = url.trim();
    if (/^(https?:\/\/|\/|#)/.test(trimmed)) {
        return trimmed.replace(/"/g, '&quot;');
    }
    return '#';
}

function sanitizeImageSrc(url: string): string {
    const trimmed = url.trim();
    if (/^(https?:\/\/|\/|uploads\/)/.test(trimmed)) {
        return trimmed.replace(/"/g, '&quot;');
    }
    return '';
}

function buildImageHtml(
    src: string,
    width: 'fixed' | 'flex' | 'auto' | 'custom',
    customWidth?: string,
    shape?: string,
    viewMode: ViewMode = 'mobile',
): string {
    const safeSrc = sanitizeImageSrc(src);
    const fixedSize = viewMode === 'web' ? '48px' : '40px';
    const autoSize = viewMode === 'web' ? '64px' : '48px';
    const flexHeight = viewMode === 'web' ? '64px' : '48px';
    const widthStyle =
        width === 'custom' && customWidth
            ? `flex:0 0 ${customWidth};width:${customWidth};height:auto;`
            : width === 'fixed'
              ? `flex:0 0 ${fixedSize};width:${fixedSize};height:${fixedSize};`
              : width === 'auto'
                ? `flex:0 0 auto;width:${autoSize};height:${autoSize};`
                : `flex:1;min-width:0;height:${flexHeight};`;
    const customAttr = width === 'custom' && customWidth ? ` data-fl-custom-width="${customWidth}"` : '';
    const imgRadius = shapeToRadius(shape || 'round');

    return (
        `<span data-fl-type="image" data-fl-width="${width}"${customAttr} data-fl-image-src="${safeSrc}" data-fl-image-shape="${shape || 'round'}"` +
        ` style="${widthStyle}display:flex;align-items:center;justify-content:center;flex-shrink:0;">` +
        (safeSrc
            ? `<img src="${safeSrc}" style="width:100%;height:100%;object-fit:cover;border-radius:${imgRadius};" alt="" />`
            : `<span style="width:100%;height:100%;background:#F3F4F6;border-radius:${imgRadius};display:flex;align-items:center;justify-content:center;color:#9CA3AF;font-size:11px;">이미지</span>`) +
        `</span>`
    );
}

// ── HTML 빌더 (마이그레이션 스크립트와 동기화) ──────────────────────────

function shapeToRadius(shape?: string): string {
    if (shape === 'round') return '10px';
    if (shape === 'square') return '0';
    return '50%';
}

function buildIconHtml(
    iconKey: string,
    bgColor: string,
    width?: 'fixed' | 'flex' | 'auto' | 'custom',
    customWidth?: string,
    shape?: string,
    viewMode: ViewMode = 'mobile',
): string {
    const svg = ICONS_20[iconKey] ?? ICONS_20['check'];
    const defaultSize = viewMode === 'web' ? '48px' : '40px';
    const size = width === 'custom' && customWidth ? customWidth : defaultSize;
    const flexBasis = width === 'custom' && customWidth ? customWidth : defaultSize;
    const radius = shapeToRadius(shape);
    const bg = shape === 'none' ? 'transparent' : bgColor;
    return (
        `<span data-fl-type="icon" data-fl-icon="${iconKey}" data-fl-icon-bg="${bgColor}" data-fl-icon-shape="${shape || 'circle'}"` +
        (width === 'custom' && customWidth ? ` data-fl-width="custom" data-fl-custom-width="${customWidth}"` : '') +
        ` style="flex:0 0 ${flexBasis};width:${size};height:${size};border-radius:${radius};` +
        `background:${bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;">` +
        svg +
        `</span>`
    );
}

function buildColumnHtml(col: FlexListColumn, viewMode: ViewMode = 'mobile'): string {
    if (col.type === 'icon') {
        return buildIconHtml(
            col.icon ?? 'check',
            col.iconBg ?? '#E8F0FC',
            col.width,
            col.customWidth,
            col.shape,
            viewMode,
        );
    }

    if (col.type === 'image') {
        return buildImageHtml(col.imageSrc ?? '', col.width, col.customWidth, col.shape, viewMode);
    }

    const fixedSize = viewMode === 'web' ? '48px' : '40px';
    const widthStyle =
        col.width === 'custom' && col.customWidth
            ? `flex:0 0 ${col.customWidth};min-width:0;`
            : col.width === 'fixed'
              ? `flex:0 0 ${fixedSize};`
              : col.width === 'auto'
                ? 'flex:0 1 auto;min-width:0;margin-left:auto;'
                : 'flex:1;min-width:0;';
    const customWidthAttr =
        col.width === 'custom' && col.customWidth ? ` data-fl-custom-width="${col.customWidth}"` : '';
    const textColumnStyle =
        col.width === 'auto'
            ? `align-items:flex-end;max-width:${viewMode === 'web' ? '32%' : '45%'};text-align:right;`
            : '';

    const lines: FlexListLine[] = (col.lines ?? [{ text: '텍스트' }]).map((l) =>
        typeof l === 'string' ? { text: l } : l,
    );
    const lineHtmls = lines.map((line, i) => {
        const alignStyle = `text-align:${line.align ?? 'left'};`;
        if (i === 0) {
            return `<span style="font-size:${viewMode === 'web' ? '16px' : '15px'};font-weight:${viewMode === 'web' ? '700' : '600'};color:#1A1A2E;line-height:${viewMode === 'web' ? '1.35' : '1.4'};${alignStyle}">${line.text}</span>`;
        }
        return `<span style="font-size:13px;color:#6B7280;line-height:${viewMode === 'web' ? '1.5' : '1.4'};${alignStyle}">${line.text}</span>`;
    });

    return (
        `<span data-fl-type="text" data-fl-width="${col.width}"${customWidthAttr}` +
        ` style="${widthStyle}${textColumnStyle}display:flex;flex-direction:column;gap:${viewMode === 'web' ? '4px' : '2px'};">` +
        lineHtmls.join('') +
        `</span>`
    );
}

function wrapColumnWithLink(colHtml: string, href?: string): string {
    if (!href) return colHtml;
    return `<a href="${sanitizeHref(href)}" data-fl-col-link style="text-decoration:none;display:contents;">${colHtml}</a>`;
}

function buildRowHtml(row: FlexListRow, isLast: boolean, viewMode: ViewMode = 'mobile'): string {
    const borderShow = row.border?.show !== false;
    const borderColor = row.border?.color ?? '#E5E7EB';
    const borderW = row.border?.width ?? 1;
    const borderStyle =
        viewMode === 'web' ? '' : !isLast && borderShow ? `border-bottom:${borderW}px solid ${borderColor};` : '';

    const pad = row.padding ?? (viewMode === 'web' ? '20px 24px' : '16px 20px');
    const gap = row.gap ?? (viewMode === 'web' ? '18px' : '12px');
    const bg = row.bgColor ? `background:${row.bgColor};` : viewMode === 'web' ? 'background:#ffffff;' : '';
    const webCardStyle =
        viewMode === 'web'
            ? 'border:1px solid #E6ECF5;border-radius:18px;box-shadow:0 10px 28px rgba(15,23,42,0.06);margin-bottom:14px;'
            : '';

    const dataAttrs =
        (row.bgColor ? ` data-fl-bg="${row.bgColor}"` : '') +
        (row.padding ? ` data-fl-padding="${row.padding}"` : '') +
        (row.gap ? ` data-fl-gap="${row.gap}"` : '') +
        (row.border
            ? ` data-fl-border-show="${row.border.show}" data-fl-border-color="${row.border.color ?? '#E5E7EB'}" data-fl-border-width="${row.border.width ?? 1}"`
            : '');

    const linkMode = row.linkMode ?? 'none';
    const flexStyle = `display:flex;align-items:center;gap:${gap};padding:${pad};${borderStyle}${webCardStyle}${bg}text-decoration:none;`;

    if (linkMode === 'row' && row.rowHref) {
        const columnsHtml = row.columns.map((col) => buildColumnHtml(col, viewMode)).join('');
        return `<a href="${sanitizeHref(row.rowHref)}" data-fl-link-mode="row"${dataAttrs} style="${flexStyle}">${columnsHtml}</a>`;
    }

    if (linkMode === 'column') {
        const columnsHtml = row.columns
            .map((col) => wrapColumnWithLink(buildColumnHtml(col, viewMode), col.href))
            .join('');
        return `<div data-fl-link-mode="column"${dataAttrs} style="${flexStyle}">${columnsHtml}</div>`;
    }

    const columnsHtml = row.columns.map((col) => buildColumnHtml(col, viewMode)).join('');
    return `<a href="#" data-fl-link-mode="none"${dataAttrs} style="${flexStyle}">${columnsHtml}</a>`;
}

// ── DOM 조작 함수 ────────────────────────────────────────────────────────

function getRootExtraStyle(componentId: string): string {
    if (componentId.endsWith('-web')) {
        return 'width:100%;box-sizing:border-box;background:transparent;padding:12px 0;';
    }
    if (componentId.endsWith('-responsive')) {
        return 'width:100%;box-sizing:border-box;';
    }
    return '';
}

function applyToBlock(blockEl: HTMLElement, rows: FlexListRow[]) {
    const componentId = blockEl.getAttribute('data-component-id') ?? '';
    const viewMode: ViewMode = componentId.endsWith('-web')
        ? 'web'
        : componentId.endsWith('-responsive')
          ? 'responsive'
          : 'mobile';
    blockEl.setAttribute('style', `font-family:${FONT_FAMILY};background:#ffffff;${getRootExtraStyle(componentId)}`);
    blockEl.setAttribute('data-fl-rows', JSON.stringify(rows));

    // 기존 행 제거 (<a> 또는 <div data-fl-link-mode>)
    blockEl.querySelectorAll(':scope > a, :scope > div[data-fl-link-mode]').forEach((el) => el.remove());

    // 새 행 삽입
    const html = rows.map((row, i) => buildRowHtml(row, i === rows.length - 1, viewMode)).join('');
    blockEl.insertAdjacentHTML('beforeend', html);
}

/**
 * blockEl에서 현재 행/컬럼 데이터 파싱
 *
 * 우선순위:
 * 1. DOM (실제 <a> 행 존재 시) — ContentBuilder 인라인 편집 결과 반영
 * 2. data-fl-rows 속성 — DOM 파싱 실패 또는 구버전 블록
 */
function parseRows(blockEl: HTMLElement): FlexListRow[] {
    // <a> 또는 <div data-fl-link-mode> 행을 모두 수집
    const rowEls = blockEl.querySelectorAll<HTMLElement>(':scope > a, :scope > div[data-fl-link-mode]');

    // DOM에서 직접 파싱 (인라인 편집 내용 반영)
    if (rowEls.length > 0) {
        const rows: FlexListRow[] = Array.from(rowEls).map((rowEl) => {
            // 링크 모드 파싱
            const flLinkMode = rowEl.getAttribute('data-fl-link-mode');
            let linkMode: 'row' | 'column' | 'none' = 'none';
            let rowHref: string | undefined;

            if (flLinkMode === 'row' && rowEl.tagName === 'A') {
                linkMode = 'row';
                const href = rowEl.getAttribute('href');
                if (href && href !== '#') rowHref = href;
            } else if (flLinkMode === 'column') {
                linkMode = 'column';
            }

            // 컬럼 파싱 — data-fl-type 속성이 있는 span을 탐색 (직계 또는 <a data-fl-col-link> 내부)
            const hasDataAttrs = !!rowEl.querySelector('span[data-fl-type]');
            let colSpans: HTMLElement[];
            if (hasDataAttrs) {
                colSpans = Array.from(rowEl.querySelectorAll<HTMLElement>('span[data-fl-type]'));
            } else {
                colSpans = Array.from(rowEl.querySelectorAll<HTMLElement>(':scope > span'));
            }

            const columns: FlexListColumn[] = colSpans.map((span) => {
                // 개별 링크 href 추출 — 부모가 <a data-fl-col-link>인 경우
                const colLinkAnchor = span.closest<HTMLAnchorElement>('a[data-fl-col-link]');
                const colHref = colLinkAnchor?.getAttribute('href') || undefined;

                // ── data-fl-* 속성 기반 (신규 HTML) ──
                const flType = span.getAttribute('data-fl-type');
                if (flType === 'icon') {
                    const iconWidth = (span.getAttribute('data-fl-width') || 'fixed') as
                        | 'fixed'
                        | 'flex'
                        | 'auto'
                        | 'custom';
                    return {
                        type: 'icon' as const,
                        width: iconWidth,
                        customWidth: span.getAttribute('data-fl-custom-width') || undefined,
                        icon: span.getAttribute('data-fl-icon') || 'check',
                        iconBg: span.getAttribute('data-fl-icon-bg') || '#E8F0FC',
                        shape:
                            (span.getAttribute('data-fl-icon-shape') as 'circle' | 'round' | 'square' | 'none') ||
                            undefined,
                        href: colHref,
                    };
                }
                if (flType === 'image') {
                    return {
                        type: 'image' as const,
                        width: (span.getAttribute('data-fl-width') || 'fixed') as 'fixed' | 'flex' | 'auto' | 'custom',
                        customWidth: span.getAttribute('data-fl-custom-width') || undefined,
                        imageSrc: span.getAttribute('data-fl-image-src') || '',
                        shape:
                            (span.getAttribute('data-fl-image-shape') as 'circle' | 'round' | 'square' | 'none') ||
                            undefined,
                        href: colHref,
                    };
                }
                if (flType === 'text') {
                    const lineSpans = span.querySelectorAll<HTMLElement>(':scope > span');
                    const lines: FlexListLine[] =
                        lineSpans.length > 0
                            ? Array.from(lineSpans).map((ls) => ({
                                  text: ls.textContent?.trim() ?? '',
                                  align: (ls.style.textAlign as 'left' | 'center' | 'right') || undefined,
                              }))
                            : [{ text: span.textContent?.trim() ?? '텍스트' }];
                    const width = (span.getAttribute('data-fl-width') || 'flex') as
                        | 'fixed'
                        | 'flex'
                        | 'auto'
                        | 'custom';
                    const customWidth = span.getAttribute('data-fl-custom-width') || undefined;
                    return { type: 'text' as const, width, customWidth, lines, href: colHref };
                }

                // ── heuristic 폴백 (구버전 HTML — data-fl-* 없음) ──
                const hasSvg = !!span.querySelector('svg');
                const isCircle = span.style.borderRadius === '50%';

                if (hasSvg && isCircle) {
                    // 아이콘 컬럼 — SVG path로 아이콘 키 역매칭
                    const svgContent = span.querySelector('svg')?.outerHTML ?? '';
                    let iconKey = 'check';
                    for (const [key, svg] of Object.entries(ICONS_20)) {
                        const keyPaths = svg.match(/d="[^"]*"/g)?.join('') ?? '';
                        const domPaths = svgContent.match(/d="[^"]*"/g)?.join('') ?? '';
                        if (keyPaths && keyPaths === domPaths) {
                            iconKey = key;
                            break;
                        }
                    }
                    return {
                        type: 'icon' as const,
                        width: 'fixed' as const,
                        icon: iconKey,
                        iconBg: span.style.background || span.style.backgroundColor || '#E8F0FC',
                    };
                }

                // 텍스트 컬럼 heuristic
                const lineSpans = span.querySelectorAll<HTMLElement>(':scope > span');
                const lines: FlexListLine[] =
                    lineSpans.length > 0
                        ? Array.from(lineSpans).map((ls) => ({
                              text: ls.textContent?.trim() ?? '',
                              align: (ls.style.textAlign as 'left' | 'center' | 'right') || undefined,
                          }))
                        : [{ text: span.textContent?.trim() ?? '텍스트' }];
                const flex = span.style.flex;
                let width: 'fixed' | 'flex' | 'auto' = 'flex';
                if (flex.startsWith('0 0 40px')) width = 'fixed';
                else if (flex.startsWith('0 0 auto') || flex === '0 0 auto') width = 'auto';

                return { type: 'text' as const, width, lines };
            });

            return {
                columns:
                    columns.length > 0
                        ? columns
                        : [{ type: 'text' as const, width: 'flex' as const, lines: [{ text: '텍스트' }] }],
                linkMode,
                rowHref,
                bgColor: rowEl.getAttribute('data-fl-bg') || undefined,
                padding: rowEl.getAttribute('data-fl-padding') || undefined,
                gap: rowEl.getAttribute('data-fl-gap') || undefined,
                border: rowEl.hasAttribute('data-fl-border-show')
                    ? {
                          show: rowEl.getAttribute('data-fl-border-show') !== 'false',
                          color: rowEl.getAttribute('data-fl-border-color') || '#E5E7EB',
                          width: Number(rowEl.getAttribute('data-fl-border-width')) || 1,
                      }
                    : undefined,
            };
        });

        if (rows.length > 0) return rows;
    }

    // 폴백: data-fl-rows JSON
    const raw = blockEl.getAttribute('data-fl-rows');
    if (raw) {
        try {
            return JSON.parse(raw) as FlexListRow[];
        } catch {
            // 파싱 실패
        }
    }

    return [{ columns: [{ type: 'text', width: 'flex', lines: [{ text: '텍스트' }] }] }];
}

// ── [숫자 input] + [단위 Select] 공용 컴포넌트 ──────────────────────────

/** CSS 값 문자열("16px", "30%")에서 숫자와 단위를 분리 */
function parseValueUnit(value: string, defaultUnit: string): { num: number; unit: string } {
    const match = value.match(/^(-?\d*\.?\d+)\s*(px|%|rem|em|vw|vh)?$/);
    if (match) {
        const num = Math.max(0, parseFloat(match[1])); // 음수 방어
        return { num, unit: match[2] || defaultUnit };
    }
    return { num: Math.max(0, parseFloat(value) || 0), unit: defaultUnit };
}

function UnitInput({
    value,
    onChange,
    units,
    defaultUnit,
    inputWidth = 42,
}: {
    value: string;
    onChange: (value: string) => void;
    units: string[];
    defaultUnit: string;
    inputWidth?: number;
}) {
    const { num, unit } = parseValueUnit(value, defaultUnit);

    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0 }}>
            <input
                type="number"
                value={num}
                onChange={(e) => {
                    const v = Math.max(0, Number(e.target.value) || 0);
                    onChange(`${v}${unit}`);
                }}
                style={{
                    width: inputWidth,
                    padding: '3px 4px',
                    border: '1px solid #e5e7eb',
                    borderRight: 'none',
                    borderRadius: '4px 0 0 4px',
                    fontSize: 10,
                    fontFamily: FONT_FAMILY,
                    outline: 'none',
                    background: '#fff',
                }}
            />
            <select
                value={unit}
                onChange={(e) => onChange(`${num}${e.target.value}`)}
                style={{
                    padding: '3px 2px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0 4px 4px 0',
                    fontSize: 9,
                    fontFamily: FONT_FAMILY,
                    background: '#fff',
                    color: '#374151',
                    outline: 'none',
                    cursor: 'pointer',
                }}
            >
                {units.map((u) => (
                    <option key={u} value={u}>
                        {u}
                    </option>
                ))}
            </select>
        </div>
    );
}

// ── 스타일 상수 ───────────────────────────────────────────────────────────

const S = {
    overlay: {
        position: 'fixed' as const,
        inset: 0,
        zIndex: 99998,
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(2px)',
    },
    panel: {
        position: 'fixed' as const,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 520,
        maxWidth: 'calc(100vw - 24px)',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column' as const,
        zIndex: 99999,
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        fontFamily: FONT_FAMILY,
        fontSize: 13,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 14px',
        borderBottom: '1px solid #f3f4f6',
        borderRadius: '12px 12px 0 0',
        background: '#fafafa',
        flexShrink: 0,
        cursor: 'grab',
        userSelect: 'none' as const,
    },
    body: {
        overflowY: 'auto' as const,
        flex: 1,
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 10,
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 6,
        padding: '10px 14px 14px',
        borderTop: '1px solid #f3f4f6',
        flexShrink: 0,
    },
    iconBtn: {
        width: 26,
        height: 26,
        border: '1px solid #e5e7eb',
        borderRadius: 5,
        background: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        padding: 0,
    } as React.CSSProperties,
    deleteBtn: {
        width: 26,
        height: 26,
        border: '1px solid #fca5a5',
        borderRadius: 5,
        background: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        padding: 0,
        color: '#ef4444',
    } as React.CSSProperties,
    addBtn: {
        width: '100%',
        padding: '8px',
        border: '1.5px dashed #c7d8f4',
        borderRadius: 8,
        background: '#f0f4ff',
        color: '#0046A4',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    } as React.CSSProperties,
    cancelBtn: {
        padding: '6px 14px',
        border: '1px solid #e5e7eb',
        borderRadius: 6,
        background: '#fff',
        fontSize: 12,
        color: '#374151',
        cursor: 'pointer',
        fontWeight: 600,
    },
    applyBtn: {
        padding: '6px 16px',
        border: 'none',
        borderRadius: 6,
        background: '#0046A4',
        fontSize: 12,
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 600,
    },
};

const WIDTH_LABELS: Record<string, string> = {
    fixed: '고정 (40px)',
    flex: '유연 (flex)',
    auto: '자동 (auto)',
    custom: '커스텀 (%)',
};

// ── 컬럼 편집 서브컴포넌트 ──────────────────────────────────────────────

function ColumnEditor({
    col,
    colIdx,
    linkMode,
    onUpdate,
    onDelete,
    canDelete,
}: {
    col: FlexListColumn;
    colIdx: number;
    linkMode: 'row' | 'column' | 'none';
    onUpdate: (colIdx: number, col: FlexListColumn) => void;
    onDelete: (colIdx: number) => void;
    canDelete: boolean;
}) {
    const [showIconPicker, setShowIconPicker] = useState(false);

    // 항상 최신 col을 참조 — 팝업이 열려있는 동안 다른 필드가 바뀌어도 덮어쓰지 않도록
    const colRef = useRef(col);
    colRef.current = col;

    // 이미지 선택 팝업 메시지 리스너 클린업 (누적 방지)
    const pickerCleanupRef = useRef<(() => void) | null>(null);
    useEffect(() => {
        return () => {
            pickerCleanupRef.current?.();
        };
    }, []);

    return (
        <div
            style={{
                padding: '8px 10px',
                border: '1px solid #e5e7eb',
                borderRadius: 6,
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
            }}
        >
            {/* 컬럼 헤더 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', minWidth: 24 }}>C{colIdx + 1}</span>

                {/* 타입 토글 */}
                <select
                    value={col.type}
                    onChange={(e) => {
                        const type = e.target.value as 'icon' | 'text' | 'image';
                        if (type === 'icon') {
                            onUpdate(colIdx, {
                                type,
                                width: 'fixed',
                                icon: 'check',
                                iconBg: '#E8F0FC',
                                shape: 'circle',
                            });
                        } else if (type === 'image') {
                            onUpdate(colIdx, { type, width: 'fixed', imageSrc: '', shape: 'round' });
                        } else {
                            onUpdate(colIdx, { type, width: 'flex', lines: [{ text: '텍스트' }] });
                        }
                    }}
                    style={{
                        padding: '3px 6px',
                        border: '1px solid #e5e7eb',
                        borderRadius: 4,
                        fontSize: 11,
                        fontFamily: FONT_FAMILY,
                    }}
                >
                    <option value="icon">아이콘</option>
                    <option value="text">텍스트</option>
                    <option value="image">이미지</option>
                </select>

                {/* 너비 선택 */}
                <select
                    value={col.width}
                    onChange={(e) => {
                        const w = e.target.value as 'fixed' | 'flex' | 'auto' | 'custom';
                        onUpdate(colIdx, {
                            ...col,
                            width: w,
                            customWidth: w === 'custom' ? col.customWidth || '33%' : undefined,
                        });
                    }}
                    style={{
                        padding: '3px 6px',
                        border: '1px solid #e5e7eb',
                        borderRadius: 4,
                        fontSize: 11,
                        fontFamily: FONT_FAMILY,
                    }}
                >
                    {Object.entries(WIDTH_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>
                            {v}
                        </option>
                    ))}
                </select>

                {/* 커스텀 너비 입력 — [숫자] + [단위 선택] */}
                {col.width === 'custom' && (
                    <UnitInput
                        value={col.customWidth ?? '33%'}
                        onChange={(v) => onUpdate(colIdx, { ...col, customWidth: v })}
                        units={['%', 'px', 'vw']}
                        defaultUnit="%"
                        inputWidth={42}
                    />
                )}

                {/* 삭제 */}
                <button
                    type="button"
                    title="컬럼 삭제"
                    disabled={!canDelete}
                    onClick={() => onDelete(colIdx)}
                    style={{ ...S.deleteBtn, marginLeft: 'auto', opacity: canDelete ? 1 : 0.35 }}
                >
                    <svg
                        viewBox="0 0 24 24"
                        width="11"
                        height="11"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    >
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* 아이콘 컬럼 상세 */}
            {col.type === 'icon' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        onClick={() => setShowIconPicker(!showIconPicker)}
                        style={{
                            padding: '4px 8px',
                            border: '1px solid #e5e7eb',
                            borderRadius: 4,
                            background: '#fff',
                            cursor: 'pointer',
                            fontSize: 11,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                        }}
                    >
                        <span
                            dangerouslySetInnerHTML={{
                                __html: ICON_PRESETS.find((p) => p.key === col.icon)?.svg ?? '',
                            }}
                        />
                        {ICON_PRESETS.find((p) => p.key === col.icon)?.label ?? '선택'}
                    </button>

                    <input
                        type="color"
                        value={col.iconBg ?? '#E8F0FC'}
                        onChange={(e) => onUpdate(colIdx, { ...col, iconBg: e.target.value })}
                        title="배경색"
                        style={{
                            width: 26,
                            height: 26,
                            border: '1px solid #e5e7eb',
                            borderRadius: 4,
                            padding: 1,
                            cursor: 'pointer',
                        }}
                    />

                    {/* 형태 선택 */}
                    <select
                        value={col.shape ?? 'circle'}
                        onChange={(e) =>
                            onUpdate(colIdx, {
                                ...col,
                                shape: e.target.value as 'circle' | 'round' | 'square' | 'none',
                            })
                        }
                        style={{
                            padding: '3px 6px',
                            border: '1px solid #e5e7eb',
                            borderRadius: 4,
                            fontSize: 11,
                            fontFamily: FONT_FAMILY,
                        }}
                    >
                        <option value="circle">원형</option>
                        <option value="round">라운드</option>
                        <option value="square">사각</option>
                        <option value="none">투명</option>
                    </select>

                    {showIconPicker && (
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(6, 1fr)',
                                gap: 4,
                                width: '100%',
                                padding: '6px 0',
                            }}
                        >
                            {ICON_PRESETS.map((preset) => (
                                <button
                                    key={preset.key}
                                    type="button"
                                    onClick={() => {
                                        onUpdate(colIdx, { ...col, icon: preset.key });
                                        setShowIconPicker(false);
                                    }}
                                    style={{
                                        padding: '6px 2px',
                                        border: col.icon === preset.key ? '2px solid #0046A4' : '1px solid #e5e7eb',
                                        borderRadius: 6,
                                        background: col.icon === preset.key ? '#E8F0FC' : '#fff',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 2,
                                        fontSize: 9,
                                        color: '#6B7280',
                                    }}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: preset.svg }} />
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* 이미지 컬럼 상세 */}
            {col.type === 'image' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    {/* 이미지 미리보기 */}
                    {col.imageSrc ? (
                        <img
                            src={col.imageSrc}
                            alt=""
                            style={{
                                width: 40,
                                height: 40,
                                objectFit: 'cover',
                                borderRadius: 8,
                                border: '1px solid #e5e7eb',
                                flexShrink: 0,
                            }}
                        />
                    ) : (
                        <span
                            style={{
                                width: 40,
                                height: 40,
                                background: '#F3F4F6',
                                borderRadius: 8,
                                border: '1px solid #e5e7eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 9,
                                color: '#9CA3AF',
                                flexShrink: 0,
                            }}
                        >
                            없음
                        </span>
                    )}

                    {/* URL 입력 + 이미지 브라우저 선택 */}
                    <input
                        type="text"
                        value={col.imageSrc ?? ''}
                        placeholder="이미지 URL"
                        readOnly
                        style={{
                            flex: 1,
                            minWidth: 80,
                            padding: '4px 8px',
                            border: '1px solid #e5e7eb',
                            borderRadius: 4,
                            fontSize: 11,
                            fontFamily: FONT_FAMILY,
                            outline: 'none',
                            background: '#f9fafb',
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => {
                            pickerCleanupRef.current?.(); // 이전 리스너 정리
                            try {
                                const cleanup = openCmsFilesPicker((url) => {
                                    onUpdate(colIdx, { ...colRef.current, imageSrc: url });
                                });
                                pickerCleanupRef.current = cleanup ?? null;
                            } catch {
                                alert('이미지 선택 창을 열 수 없습니다. 팝업 차단을 확인해 주세요.');
                            }
                        }}
                        style={{
                            padding: '4px 8px',
                            border: '1px solid #C7D8F4',
                            borderRadius: 4,
                            background: '#F0F4FF',
                            color: '#0046A4',
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                        }}
                    >
                        이미지 선택
                    </button>
                    {col.imageSrc && (
                        <button
                            type="button"
                            title="이미지 제거"
                            onClick={() => onUpdate(colIdx, { ...col, imageSrc: undefined })}
                            style={{
                                ...S.deleteBtn,
                                width: 22,
                                height: 22,
                                flexShrink: 0,
                            }}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                width="9"
                                height="9"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            >
                                <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                        </button>
                    )}

                    {/* 형태 선택 */}
                    <select
                        value={col.shape ?? 'round'}
                        onChange={(e) =>
                            onUpdate(colIdx, {
                                ...col,
                                shape: e.target.value as 'circle' | 'round' | 'square' | 'none',
                            })
                        }
                        style={{
                            padding: '3px 6px',
                            border: '1px solid #e5e7eb',
                            borderRadius: 4,
                            fontSize: 11,
                            fontFamily: FONT_FAMILY,
                        }}
                    >
                        <option value="circle">원형</option>
                        <option value="round">라운드</option>
                        <option value="square">사각</option>
                        <option value="none">투명</option>
                    </select>
                </div>
            )}

            {/* 텍스트 컬럼 상세 */}
            {col.type === 'text' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {(col.lines ?? [{ text: '텍스트' }]).map((line, lineIdx) => {
                        const lineObj: FlexListLine = typeof line === 'string' ? { text: line } : line;
                        return (
                            <div key={lineIdx} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ fontSize: 10, color: '#9ca3af', minWidth: 14 }}>L{lineIdx + 1}</span>
                                <input
                                    type="text"
                                    value={lineObj.text}
                                    onChange={(e) => {
                                        const newLines = [...(col.lines ?? [{ text: '텍스트' }])];
                                        newLines[lineIdx] = { ...lineObj, text: e.target.value };
                                        onUpdate(colIdx, { ...col, lines: newLines });
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '4px 8px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: 4,
                                        fontSize: 12,
                                        fontFamily: FONT_FAMILY,
                                        outline: 'none',
                                        minWidth: 0,
                                    }}
                                    placeholder="텍스트"
                                />
                                {/* 정렬 버튼 L / C / R */}
                                {(['left', 'center', 'right'] as const).map((a) => (
                                    <button
                                        key={a}
                                        type="button"
                                        title={a === 'left' ? '좌측' : a === 'center' ? '가운데' : '우측'}
                                        onClick={() => {
                                            const newLines = [...(col.lines ?? [{ text: '텍스트' }])];
                                            newLines[lineIdx] = { ...lineObj, align: a };
                                            onUpdate(colIdx, { ...col, lines: newLines });
                                        }}
                                        style={{
                                            width: 18,
                                            height: 18,
                                            border: 'none',
                                            borderRadius: 3,
                                            background: (lineObj.align ?? 'left') === a ? '#0046A4' : '#e5e7eb',
                                            color: (lineObj.align ?? 'left') === a ? '#fff' : '#6B7280',
                                            cursor: 'pointer',
                                            fontSize: 9,
                                            fontWeight: 700,
                                            padding: 0,
                                            flexShrink: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {a === 'left' ? 'L' : a === 'center' ? 'C' : 'R'}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    title="행 삭제"
                                    disabled={(col.lines ?? []).length <= 1}
                                    onClick={() => {
                                        const newLines = (col.lines ?? [{ text: '텍스트' }]).filter(
                                            (_, i) => i !== lineIdx,
                                        );
                                        onUpdate(colIdx, { ...col, lines: newLines });
                                    }}
                                    style={{
                                        ...S.deleteBtn,
                                        width: 20,
                                        height: 20,
                                        opacity: (col.lines ?? []).length <= 1 ? 0.35 : 1,
                                    }}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="9"
                                        height="9"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                    >
                                        <path d="M18 6 6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        );
                    })}
                    <button
                        type="button"
                        onClick={() =>
                            onUpdate(colIdx, {
                                ...col,
                                lines: [...(col.lines ?? [{ text: '텍스트' }]), { text: '새 텍스트' }],
                            })
                        }
                        style={{
                            fontSize: 11,
                            color: '#0046A4',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            padding: '2px 0',
                        }}
                    >
                        + 텍스트 행 추가
                    </button>
                </div>
            )}

            {/* 컬럼 개별 링크 URL (linkMode=column일 때만 표시) */}
            {linkMode === 'column' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <span style={{ fontSize: 10, color: '#6B7280', minWidth: 30 }}>URL</span>
                    <input
                        type="text"
                        value={col.href ?? ''}
                        onChange={(e) => onUpdate(colIdx, { ...col, href: e.target.value || undefined })}
                        placeholder="https://... (선택)"
                        style={{
                            flex: 1,
                            padding: '3px 8px',
                            border: '1px solid #e5e7eb',
                            borderRadius: 4,
                            fontSize: 11,
                            fontFamily: FONT_FAMILY,
                            outline: 'none',
                            minWidth: 0,
                        }}
                    />
                </div>
            )}
        </div>
    );
}

// ── 메인 컴포넌트 ────────────────────────────────────────────────────────

export default function FlexListEditor({ blockEl, onClose }: Props) {
    const [rows, setRows] = useState<FlexListRow[]>(() => parseRows(blockEl));
    const [pos, setPos] = useState(() => ({
        x: Math.max(12, window.innerWidth / 2 - 260),
        y: Math.max(12, window.innerHeight / 2 - 320),
    }));

    // 스타일 설정 펼침 상태 — UI 전용, 데이터 모델과 분리
    const [expandedStyles, setExpandedStyles] = useState<Set<number>>(() => new Set());
    const toggleStyleExpand = useCallback((rowIdx: number) => {
        setExpandedStyles((prev) => {
            const next = new Set(prev);
            if (next.has(rowIdx)) next.delete(rowIdx);
            else next.add(rowIdx);
            return next;
        });
    }, []);

    // drag 상태
    const dragging = useRef(false);
    const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });

    const handleHeaderMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if ((e.target as HTMLElement).closest('button,input,select,textarea,label')) return;
            dragging.current = true;
            dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
            e.preventDefault();
        },
        [pos],
    );

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!dragging.current) return;
            setPos({
                x: Math.max(12, dragStart.current.px + e.clientX - dragStart.current.mx),
                y: Math.max(12, dragStart.current.py + e.clientY - dragStart.current.my),
            });
        };

        const handleMouseUp = () => {
            dragging.current = false;
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const updateColumn = useCallback((rowIdx: number, colIdx: number, col: FlexListColumn) => {
        setRows((prev) =>
            prev.map((row, ri) =>
                ri === rowIdx ? { ...row, columns: row.columns.map((c, ci) => (ci === colIdx ? col : c)) } : row,
            ),
        );
    }, []);

    const deleteColumn = useCallback((rowIdx: number, colIdx: number) => {
        setRows((prev) =>
            prev.map((row, ri) =>
                ri === rowIdx ? { ...row, columns: row.columns.filter((_, ci) => ci !== colIdx) } : row,
            ),
        );
    }, []);

    const addColumn = useCallback((rowIdx: number) => {
        setRows((prev) =>
            prev.map((row, ri) =>
                ri === rowIdx
                    ? {
                          ...row,
                          columns: [...row.columns, { type: 'text', width: 'flex', lines: [{ text: '새 텍스트' }] }],
                      }
                    : row,
            ),
        );
    }, []);

    const handleAddRow = () => {
        setRows((prev) => [...prev, { columns: [{ type: 'text', width: 'flex', lines: [{ text: '새 항목' }] }] }]);
    };

    const handleDeleteRow = (idx: number) => {
        if (rows.length <= 1) return;
        setRows((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleMoveUp = (idx: number) => {
        if (idx === 0) return;
        const next = [...rows];
        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
        setRows(next);
    };

    const handleMoveDown = (idx: number) => {
        if (idx === rows.length - 1) return;
        const next = [...rows];
        [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
        setRows(next);
    };

    const handleApply = () => {
        applyToBlock(blockEl, rows);
        onClose();
    };

    return (
        <>
            <div onClick={onClose} style={S.overlay} />

            <div
                onClick={(e) => e.stopPropagation()}
                style={{ ...S.panel, left: pos.x, top: pos.y, transform: 'none' }}
            >
                {/* 헤더 */}
                <div onMouseDown={handleHeaderMouseDown} style={S.header}>
                    <span style={{ fontWeight: 700, color: '#111827' }}>가변 리스트 편집</span>
                    <button
                        onClick={onClose}
                        style={{
                            width: 24,
                            height: 24,
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            color: '#6b7280',
                            fontSize: 18,
                            padding: 0,
                            lineHeight: 1,
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* 안내 */}
                <div
                    style={{
                        padding: '8px 14px',
                        background: '#f0f4ff',
                        borderBottom: '1px solid #e5e7eb',
                        fontSize: 11,
                        color: '#4b6baf',
                        flexShrink: 0,
                    }}
                >
                    행(Row)을 추가·삭제하고, 각 행 내 컬럼(Column)의 타입·너비·내용을 편집합니다.
                </div>

                {/* 본문 */}
                <div style={S.body}>
                    {rows.map((row, rowIdx) => (
                        <div
                            key={rowIdx}
                            style={{
                                border: '1px solid #e5e7eb',
                                borderRadius: 8,
                                background: '#fafafa',
                                overflow: 'visible',
                            }}
                        >
                            {/* 행 헤더 */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '8px 10px',
                                    borderBottom: '1px solid #f3f4f6',
                                }}
                            >
                                <span style={{ fontSize: 11, fontWeight: 700, color: '#374151' }}>행 {rowIdx + 1}</span>
                                <span style={{ fontSize: 10, color: '#9ca3af' }}>({row.columns.length}컬럼)</span>

                                <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                                    <button
                                        type="button"
                                        title="위로"
                                        disabled={rowIdx === 0}
                                        onClick={() => handleMoveUp(rowIdx)}
                                        style={{ ...S.iconBtn, opacity: rowIdx === 0 ? 0.35 : 1 }}
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            width="11"
                                            height="11"
                                            fill="none"
                                            stroke="#374151"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        >
                                            <path d="m18 15-6-6-6 6" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        title="아래로"
                                        disabled={rowIdx === rows.length - 1}
                                        onClick={() => handleMoveDown(rowIdx)}
                                        style={{ ...S.iconBtn, opacity: rowIdx === rows.length - 1 ? 0.35 : 1 }}
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            width="11"
                                            height="11"
                                            fill="none"
                                            stroke="#374151"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        >
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        title="컬럼 추가"
                                        disabled={row.columns.length >= 4}
                                        onClick={() => addColumn(rowIdx)}
                                        style={{
                                            ...S.iconBtn,
                                            opacity: row.columns.length >= 4 ? 0.35 : 1,
                                            color: '#0046A4',
                                            border: '1px solid #c7d8f4',
                                        }}
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            width="11"
                                            height="11"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                        >
                                            <path d="M12 5v14M5 12h14" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        title="행 삭제"
                                        disabled={rows.length <= 1}
                                        onClick={() => handleDeleteRow(rowIdx)}
                                        style={{ ...S.deleteBtn, opacity: rows.length <= 1 ? 0.35 : 1 }}
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            width="11"
                                            height="11"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                        >
                                            <path d="M18 6 6 18M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* 링크 설정 */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    padding: '6px 10px',
                                    background: '#f9fafb',
                                    borderBottom: '1px solid #f3f4f6',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <span style={{ fontSize: 10, fontWeight: 600, color: '#6B7280' }}>링크</span>
                                <select
                                    value={row.linkMode ?? 'none'}
                                    onChange={(e) => {
                                        const mode = e.target.value as 'row' | 'column' | 'none';
                                        setRows((prev) =>
                                            prev.map((r, ri) => (ri === rowIdx ? { ...r, linkMode: mode } : r)),
                                        );
                                    }}
                                    style={{
                                        padding: '2px 6px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: 4,
                                        fontSize: 11,
                                        fontFamily: FONT_FAMILY,
                                    }}
                                >
                                    <option value="none">없음</option>
                                    <option value="row">행 전체</option>
                                    <option value="column">컬럼 개별</option>
                                </select>
                                {row.linkMode === 'row' && (
                                    <input
                                        type="text"
                                        value={row.rowHref ?? ''}
                                        onChange={(e) =>
                                            setRows((prev) =>
                                                prev.map((r, ri) =>
                                                    ri === rowIdx ? { ...r, rowHref: e.target.value || undefined } : r,
                                                ),
                                            )
                                        }
                                        placeholder="https://..."
                                        style={{
                                            flex: 1,
                                            minWidth: 120,
                                            padding: '3px 8px',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: 4,
                                            fontSize: 11,
                                            fontFamily: FONT_FAMILY,
                                            outline: 'none',
                                        }}
                                    />
                                )}
                            </div>

                            {/* 스타일 설정 (접기/펼치기) */}
                            <div style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <button
                                    type="button"
                                    onClick={() => toggleStyleExpand(rowIdx)}
                                    style={{
                                        width: '100%',
                                        padding: '6px 10px',
                                        border: 'none',
                                        background: '#f9fafb',
                                        cursor: 'pointer',
                                        fontSize: 10,
                                        fontWeight: 600,
                                        color: '#6B7280',
                                        textAlign: 'left',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                    }}
                                >
                                    <span
                                        style={{
                                            transform: expandedStyles.has(rowIdx) ? 'rotate(90deg)' : 'none',
                                            transition: 'transform 0.15s',
                                            fontSize: 10,
                                        }}
                                    >
                                        ▸
                                    </span>
                                    스타일 설정
                                </button>
                                {expandedStyles.has(rowIdx) && (
                                    <div
                                        style={{
                                            padding: '8px 10px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 6,
                                        }}
                                    >
                                        {/* 배경색 + 패딩 + 간격 */}
                                        <div
                                            style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}
                                        >
                                            <span style={{ fontSize: 10, color: '#6B7280', minWidth: 36 }}>배경색</span>
                                            <input
                                                type="color"
                                                value={row.bgColor ?? '#ffffff'}
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    setRows((prev) =>
                                                        prev.map((r, ri) =>
                                                            ri === rowIdx
                                                                ? { ...r, bgColor: v === '#ffffff' ? undefined : v }
                                                                : r,
                                                        ),
                                                    );
                                                }}
                                                style={{
                                                    width: 26,
                                                    height: 26,
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: 4,
                                                    padding: 1,
                                                    cursor: 'pointer',
                                                }}
                                            />
                                            <span style={{ fontSize: 10, color: '#6B7280' }}>상하</span>
                                            <UnitInput
                                                value={row.padding?.split(' ')[0] ?? '16px'}
                                                onChange={(v) => {
                                                    const lr = row.padding?.split(' ')[1] ?? '20px';
                                                    setRows((prev) =>
                                                        prev.map((r, ri) =>
                                                            ri === rowIdx ? { ...r, padding: `${v} ${lr}` } : r,
                                                        ),
                                                    );
                                                }}
                                                units={['px', '%', 'rem']}
                                                defaultUnit="px"
                                                inputWidth={36}
                                            />
                                            <span style={{ fontSize: 10, color: '#6B7280' }}>좌우</span>
                                            <UnitInput
                                                value={row.padding?.split(' ')[1] ?? '20px'}
                                                onChange={(v) => {
                                                    const tb = row.padding?.split(' ')[0] ?? '16px';
                                                    setRows((prev) =>
                                                        prev.map((r, ri) =>
                                                            ri === rowIdx ? { ...r, padding: `${tb} ${v}` } : r,
                                                        ),
                                                    );
                                                }}
                                                units={['px', '%', 'rem']}
                                                defaultUnit="px"
                                                inputWidth={36}
                                            />
                                            <span style={{ fontSize: 10, color: '#6B7280', marginLeft: 4 }}>간격</span>
                                            <UnitInput
                                                value={row.gap ?? '12px'}
                                                onChange={(v) =>
                                                    setRows((prev) =>
                                                        prev.map((r, ri) => (ri === rowIdx ? { ...r, gap: v } : r)),
                                                    )
                                                }
                                                units={['px', '%', 'rem']}
                                                defaultUnit="px"
                                                inputWidth={36}
                                            />
                                        </div>
                                        {/* 구분선 */}
                                        <div
                                            style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}
                                        >
                                            <span style={{ fontSize: 10, color: '#6B7280', minWidth: 36 }}>구분선</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const cur = row.border?.show !== false;
                                                    setRows((prev) =>
                                                        prev.map((r, ri) =>
                                                            ri === rowIdx
                                                                ? {
                                                                      ...r,
                                                                      border: {
                                                                          ...r.border,
                                                                          show: !cur,
                                                                          color: r.border?.color ?? '#E5E7EB',
                                                                          width: r.border?.width ?? 1,
                                                                      },
                                                                  }
                                                                : r,
                                                        ),
                                                    );
                                                }}
                                                style={{
                                                    width: 36,
                                                    height: 20,
                                                    borderRadius: 10,
                                                    border: 'none',
                                                    background: row.border?.show !== false ? '#0046A4' : '#d1d5db',
                                                    cursor: 'pointer',
                                                    position: 'relative',
                                                    padding: 0,
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        position: 'absolute',
                                                        top: 2,
                                                        left: row.border?.show !== false ? 18 : 2,
                                                        width: 16,
                                                        height: 16,
                                                        borderRadius: '50%',
                                                        background: '#fff',
                                                        boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                                                        transition: 'left 0.15s',
                                                    }}
                                                />
                                            </button>
                                            {row.border?.show !== false && (
                                                <>
                                                    <span style={{ fontSize: 10, color: '#9ca3af' }}>색상</span>
                                                    <input
                                                        type="color"
                                                        value={row.border?.color ?? '#E5E7EB'}
                                                        onChange={(e) =>
                                                            setRows((prev) =>
                                                                prev.map((r, ri) =>
                                                                    ri === rowIdx
                                                                        ? {
                                                                              ...r,
                                                                              border: {
                                                                                  ...r.border,
                                                                                  show: true,
                                                                                  color: e.target.value,
                                                                                  width: r.border?.width ?? 1,
                                                                              },
                                                                          }
                                                                        : r,
                                                                ),
                                                            )
                                                        }
                                                        style={{
                                                            width: 22,
                                                            height: 22,
                                                            border: '1px solid #e5e7eb',
                                                            borderRadius: 4,
                                                            padding: 1,
                                                            cursor: 'pointer',
                                                        }}
                                                    />
                                                    <span style={{ fontSize: 10, color: '#9ca3af' }}>굵기</span>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        max={10}
                                                        value={row.border?.width ?? 1}
                                                        onChange={(e) =>
                                                            setRows((prev) =>
                                                                prev.map((r, ri) =>
                                                                    ri === rowIdx
                                                                        ? {
                                                                              ...r,
                                                                              border: {
                                                                                  ...r.border,
                                                                                  show: true,
                                                                                  color: r.border?.color ?? '#E5E7EB',
                                                                                  width: Number(e.target.value) || 1,
                                                                              },
                                                                          }
                                                                        : r,
                                                                ),
                                                            )
                                                        }
                                                        style={{
                                                            width: 36,
                                                            padding: '3px 4px',
                                                            border: '1px solid #e5e7eb',
                                                            borderRadius: 4,
                                                            fontSize: 10,
                                                            fontFamily: FONT_FAMILY,
                                                            outline: 'none',
                                                            background: '#fff',
                                                        }}
                                                    />
                                                    <span style={{ fontSize: 10, color: '#9ca3af' }}>px</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 컬럼 목록 */}
                            <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {row.columns.map((col, colIdx) => (
                                    <ColumnEditor
                                        key={colIdx}
                                        col={col}
                                        colIdx={colIdx}
                                        linkMode={row.linkMode ?? 'none'}
                                        onUpdate={(ci, c) => updateColumn(rowIdx, ci, c)}
                                        onDelete={(ci) => deleteColumn(rowIdx, ci)}
                                        canDelete={row.columns.length > 1}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* 행 추가 */}
                    <button type="button" onClick={handleAddRow} style={S.addBtn}>
                        <svg
                            viewBox="0 0 24 24"
                            width="14"
                            height="14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        >
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        행 추가
                    </button>
                </div>

                {/* 푸터 */}
                <div style={S.footer}>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>총 {rows.length}개 행</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={onClose} style={S.cancelBtn}>
                            취소
                        </button>
                        <button onClick={handleApply} style={S.applyBtn}>
                            적용
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
