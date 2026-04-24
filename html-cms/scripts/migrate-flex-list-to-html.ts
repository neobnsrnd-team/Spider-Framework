// scripts/migrate-flex-list-to-html.ts
// flex-list 가변형 멀티 컬럼 컴포넌트 등록/업데이트 (Issue #234, #244, #245, #246, #256, #262, #255 형태)
// 실행: npx tsx scripts/migrate-flex-list-to-html.ts

import 'dotenv/config';
import { getComponentById, updateComponent, createComponent, deleteComponent } from '../src/db/repository/component.repository';
import { closePool } from '../src/db/connection';

const FONT_FAMILY = "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif";

// ── 데이터 모델 ──────────────────────────────────────────────────────────

interface FlexListLine {
    text: string;
    align?: 'left' | 'center' | 'right'; // 수평 정렬 (기본 left)
}

interface FlexListColumn {
    type: 'icon' | 'text' | 'image';
    width: 'fixed' | 'flex' | 'auto' | 'custom'; // 고정(40px) / 유연(flex:1) / 자동(auto) / 커스텀(%)
    icon?: string;        // type=icon: 아이콘 키
    iconBg?: string;      // 아이콘 배경색
    lines?: FlexListLine[]; // type=text: 텍스트 행 배열
    href?: string;        // linkMode=column일 때 개별 링크 URL
    imageSrc?: string;    // type=image: 이미지 URL
    customWidth?: string; // width=custom일 때 값 (예: '30%', '120px')
    shape?: 'circle' | 'round' | 'square' | 'none'; // 아이콘/이미지 형태 (기본 circle)
}

interface FlexListRow {
    columns: FlexListColumn[];
    linkMode?: 'row' | 'column' | 'none'; // 행 전체 / 컬럼 개별 / 링크 없음
    rowHref?: string;                       // linkMode=row일 때 URL
    bgColor?: string;   // 행 배경색 (기본 투명)
    padding?: string;   // 행 패딩 (기본 '16px 20px')
    gap?: string;       // 컬럼 간격 (기본 '12px')
    border?: {
        show: boolean;  // 구분선 표시 여부 (기본 true)
        color?: string; // 구분선 색상 (기본 '#E5E7EB')
        width?: number; // 구분선 굵기 px (기본 1)
    };
}

type ViewMode = 'mobile' | 'web' | 'responsive';

// ── 프리셋 아이콘 SVG ────────────────────────────────────────────────────

const ICONS: Record<string, string> = {
    card: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>',
    transfer: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l-4-4 4-4"/><path d="M3 13h13"/><path d="M17 7l4 4-4 4"/><path d="M21 11H8"/></svg>',
    account: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>',
    savings: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2"/><path d="M2 9.1C1.8 9 1.5 9 1 9"/></svg>',
    loan: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>',
    insurance: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    shopping: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    notification: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>',
    won: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l4 16 4-12 4 12 4-16"/><path d="M3 10h18"/><path d="M3 14h18"/></svg>',
};

// ── href 보안 처리 ───────────────────────────────────────────────────────

function sanitizeHref(url: string): string {
    const trimmed = url.trim();
    // 허용 프로토콜: http, https, 상대경로(/), 앵커(#)
    if (/^(https?:\/\/|\/|#)/.test(trimmed)) {
        return trimmed.replace(/"/g, '&quot;');
    }
    return '#';
}

/** 이미지 URL 보안 처리 — javascript:, data: 차단 */
function sanitizeImageSrc(url: string): string {
    const trimmed = url.trim();
    if (/^(https?:\/\/|\/|uploads\/)/.test(trimmed)) {
        return trimmed.replace(/"/g, '&quot;');
    }
    return '';
}

// ── 이미지 HTML 빌더 ────────────────────────────────────────────────────

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
        width === 'custom' && customWidth ? `flex:0 0 ${customWidth};width:${customWidth};height:auto;` :
        width === 'fixed' ? `flex:0 0 ${fixedSize};width:${fixedSize};height:${fixedSize};` :
        width === 'auto'  ? `flex:0 0 auto;width:${autoSize};height:${autoSize};` :
                            `flex:1;min-width:0;height:${flexHeight};`;
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

// ── 아이콘 HTML 빌더 ─────────────────────────────────────────────────────

function shapeToRadius(shape?: string): string {
    if (shape === 'round') return '10px';
    if (shape === 'square') return '0';
    return '50%'; // circle (기본) 및 none
}

function buildIconHtml(
    iconKey: string,
    bgColor: string,
    width?: 'fixed' | 'flex' | 'auto' | 'custom',
    customWidth?: string,
    shape?: string,
    viewMode: ViewMode = 'mobile',
): string {
    const svg = ICONS[iconKey] ?? ICONS['check'];
    const defaultSize = viewMode === 'web' ? '48px' : '40px';
    const size = (width === 'custom' && customWidth) ? customWidth : defaultSize;
    const flexBasis = (width === 'custom' && customWidth) ? customWidth : defaultSize;
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

// ── 컬럼 HTML 빌더 ──────────────────────────────────────────────────────

function buildColumnHtml(col: FlexListColumn, viewMode: ViewMode = 'mobile'): string {
    if (col.type === 'image') {
        return buildImageHtml(col.imageSrc ?? '', col.width, col.customWidth, col.shape, viewMode);
    }

    const fixedSize = viewMode === 'web' ? '48px' : '40px';
    const widthStyle =
        col.width === 'custom' && col.customWidth ? `flex:0 0 ${col.customWidth};min-width:0;` :
        col.width === 'fixed' ? `flex:0 0 ${fixedSize};` :
        col.width === 'auto'  ? 'flex:0 1 auto;min-width:0;margin-left:auto;' :
                                'flex:1;min-width:0;';
    const customWidthAttr = col.width === 'custom' && col.customWidth ? ` data-fl-custom-width="${col.customWidth}"` : '';
    const textColumnStyle = col.width === 'auto'
        ? `align-items:flex-end;max-width:${viewMode === 'web' ? '32%' : '45%'};text-align:right;`
        : '';

    if (col.type === 'icon') {
        return buildIconHtml(col.icon ?? 'check', col.iconBg ?? '#E8F0FC', col.width, col.customWidth, col.shape, viewMode);
    }

    // 텍스트 컬럼 — 다층 행
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

// ── 컬럼 래퍼 HTML (개별 링크용) ────────────────────────────────────────

function wrapColumnWithLink(colHtml: string, href?: string): string {
    if (!href) return colHtml;
    return `<a href="${sanitizeHref(href)}" data-fl-col-link style="text-decoration:none;display:contents;">${colHtml}</a>`;
}

// ── 행(Row) HTML 빌더 ───────────────────────────────────────────────────

function buildRowHtml(row: FlexListRow, isLast: boolean, viewMode: ViewMode = 'mobile'): string {
    // 구분선 스타일 — border 설정 또는 기본값
    const borderShow = row.border?.show !== false;
    const borderColor = row.border?.color ?? '#E5E7EB';
    const borderWidth = row.border?.width ?? 1;
    const borderStyle = viewMode === 'web'
        ? ''
        : (!isLast && borderShow) ? `border-bottom:${borderWidth}px solid ${borderColor};` : '';

    // 행 스타일 — 패딩, 간격, 배경색
    const pad = row.padding ?? (viewMode === 'web' ? '20px 24px' : '16px 20px');
    const gap = row.gap ?? (viewMode === 'web' ? '18px' : '12px');
    const bg = row.bgColor ? `background:${row.bgColor};` : viewMode === 'web' ? 'background:#ffffff;' : '';
    const webCardStyle =
        viewMode === 'web'
            ? 'border:1px solid #E6ECF5;border-radius:18px;box-shadow:0 10px 28px rgba(15,23,42,0.06);margin-bottom:14px;'
            : '';

    // 데이터 속성 (파싱용)
    const dataAttrs =
        (row.bgColor ? ` data-fl-bg="${row.bgColor}"` : '') +
        (row.padding ? ` data-fl-padding="${row.padding}"` : '') +
        (row.gap ? ` data-fl-gap="${row.gap}"` : '') +
        (row.border ? ` data-fl-border-show="${row.border.show}" data-fl-border-color="${row.border.color ?? '#E5E7EB'}" data-fl-border-width="${row.border.width ?? 1}"` : '');

    const linkMode = row.linkMode ?? 'none';
    const flexStyle = `display:flex;align-items:center;gap:${gap};padding:${pad};${borderStyle}${webCardStyle}${bg}text-decoration:none;`;

    if (linkMode === 'row' && row.rowHref) {
        const columnsHtml = row.columns.map((col) => buildColumnHtml(col, viewMode)).join('');
        return `<a href="${sanitizeHref(row.rowHref)}" data-fl-link-mode="row"${dataAttrs} style="${flexStyle}">${columnsHtml}</a>`;
    }

    if (linkMode === 'column') {
        const columnsHtml = row.columns.map((col) =>
            wrapColumnWithLink(buildColumnHtml(col, viewMode), col.href),
        ).join('');
        return `<div data-fl-link-mode="column"${dataAttrs} style="${flexStyle}">${columnsHtml}</div>`;
    }

    const columnsHtml = row.columns.map((col) => buildColumnHtml(col, viewMode)).join('');
    return `<a href="#" data-fl-link-mode="none"${dataAttrs} style="${flexStyle}">${columnsHtml}</a>`;
}

// ── 전체 HTML 조립 ───────────────────────────────────────────────────────

function buildFlexListHtml(rows: FlexListRow[], componentId: string, extraStyle: string): string {
    const rowsJson = JSON.stringify(rows).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    const viewMode: ViewMode = componentId.endsWith('-web') ? 'web' : componentId.endsWith('-responsive') ? 'responsive' : 'mobile';

    const rowsHtml = rows.map((row, i) => buildRowHtml(row, i === rows.length - 1, viewMode)).join('');

    return (
        `<div data-component-id="${componentId}" data-spw-block` +
        ` data-fl-rows="${rowsJson}"` +
        ` style="font-family:${FONT_FAMILY};background:#ffffff;${extraStyle}">` +
        rowsHtml +
        `</div>`
    );
}

// ── 기본 프리셋 데이터 (3컬럼: 아이콘 + 텍스트 + 금액/상태) ─────────────

const DEFAULT_ROWS: FlexListRow[] = [
    {
        columns: [
            { type: 'icon', width: 'fixed', icon: 'shopping', iconBg: '#E8F0FC' },
            { type: 'text', width: 'flex', lines: [{ text: '스타벅스 코리아' }, { text: '01.15 14:30 · 본인' }] },
            { type: 'text', width: 'auto', lines: [{ text: '-4,500원' }, { text: '승인완료' }] },
        ],
    },
    {
        columns: [
            { type: 'icon', width: 'fixed', icon: 'shopping', iconBg: '#E8F0FC' },
            { type: 'text', width: 'flex', lines: [{ text: '네이버페이' }, { text: '01.14 11:20 · 본인' }] },
            { type: 'text', width: 'auto', lines: [{ text: '-32,000원' }, { text: '승인완료' }] },
        ],
    },
    {
        columns: [
            { type: 'icon', width: 'fixed', icon: 'transfer', iconBg: '#FEF3C7' },
            { type: 'text', width: 'flex', lines: [{ text: '홍길동' }, { text: '01.13 09:15 · 이체' }] },
            { type: 'text', width: 'auto', lines: [{ text: '+500,000원' }, { text: '입금' }] },
        ],
    },
];

// ── 1종 × 3 viewmode = 3 variant ────────────────────────────────────────

const COMPONENT_LABEL = '가변 리스트';
const COMPONENT_DESC = '아이콘·텍스트·이미지 자유 조합 리스트';

const VIEW_MODES = ['mobile', 'web', 'responsive'] as const;

const EXTRA_STYLES: Record<string, string> = {
    mobile: '',
    web: 'width:100%;box-sizing:border-box;background:transparent;padding:12px 0;',
    responsive: 'width:100%;box-sizing:border-box;',
};

const VARIANTS = VIEW_MODES.map((viewMode) => ({
    id: `flex-list-${viewMode}`,
    html: buildFlexListHtml(DEFAULT_ROWS, `flex-list-${viewMode}`, EXTRA_STYLES[viewMode]),
    viewMode,
}));

// 구버전 프리셋 컴포넌트 ID (DB에서 삭제 대상)
const DEPRECATED_IDS = [
    'flex-list-2col-mobile', 'flex-list-2col-web', 'flex-list-2col-responsive',
    'flex-list-3col-mobile', 'flex-list-3col-web', 'flex-list-3col-responsive',
    'flex-list-text-mobile', 'flex-list-text-web', 'flex-list-text-responsive',
];

// ── DB 등록 ───────────────────────────────────────────────────────────────

async function main() {
    // 구버전 프리셋 컴포넌트 삭제
    for (const id of DEPRECATED_IDS) {
        const exists = await getComponentById(id);
        if (exists) {
            await deleteComponent(id, 'system');
            console.log(`🗑️ ${id} — 삭제 완료`);
        }
    }

    // 신규/업데이트 등록
    for (const variant of VARIANTS) {
        const existing = await getComponentById(variant.id);

        if (existing) {
            await updateComponent({
                componentId:        variant.id,
                componentType:      existing.COMPONENT_TYPE,
                viewMode:           existing.VIEW_MODE,
                componentThumbnail: existing.COMPONENT_THUMBNAIL ?? undefined,
                data: {
                    ...(existing.DATA ?? {}) as Record<string, unknown>,
                    id:          'flex-list',
                    label:       COMPONENT_LABEL,
                    description: COMPONENT_DESC,
                    preview:     '/assets/minimalist-blocks/preview/ibk-flex-list.svg',
                    html:        variant.html,
                    viewMode:    variant.viewMode,
                },
                lastModifierId: 'system',
            });
            console.log(`✅ ${variant.id} — UPDATE 완료`);
        } else {
            await createComponent({
                componentId:        variant.id,
                componentType:      'finance',
                viewMode:           variant.viewMode,
                componentThumbnail: '/assets/minimalist-blocks/preview/ibk-flex-list.svg',
                data: {
                    id:          'flex-list',
                    label:       COMPONENT_LABEL,
                    description: COMPONENT_DESC,
                    preview:     '/assets/minimalist-blocks/preview/ibk-flex-list.svg',
                    html:        variant.html,
                    viewMode:    variant.viewMode,
                },
                createUserId:   'system',
                createUserName: '시스템',
            });
            console.log(`✅ ${variant.id} — INSERT 완료`);
        }
    }
    await closePool();
}

main().catch((err: unknown) => { console.error('실패:', err); process.exit(1); });
