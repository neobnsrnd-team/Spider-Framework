// scripts/migrate-auth-center-to-html.ts
// auth-center 컴포넌트 순수 HTML 변환 + data-component-id 적용 (Issue #3 + #10)
// DB SPW_CMS_COMPONENT의 auth-center-mobile / web / responsive DATA.html 필드 업데이트
// 실행: npx tsx scripts/migrate-auth-center-to-html.ts

import 'dotenv/config';
import { getComponentById, updateComponent } from '../src/db/repository/component.repository';
import { closePool } from '../src/db/connection';

const FONT_FAMILY = "-apple-system,BlinkMacSystemFont,'Malgun Gothic',sans-serif";

// 공통 SVG 상수
const ARROW_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="m9 18 6-6-6-6"/></svg>`;
const NOTICE_ICON_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#CA8A04" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" style="flex-shrink:0;margin-top:1px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>`;

// 카드 아이콘 SVG (내부 path만, svg 래퍼는 buildCardIcon에서)
const CARD_ICONS: Record<string, string> = {
    cert: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
    'finance-cert': '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    otp: '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/><path d="M9 7h6"/><path d="M9 11h6"/>',
    'security-card': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>',
};

// data-type별 아이콘 배경·색상 (style.css 참조)
const CARD_ICON_STYLE: Record<string, { bg: string; color: string }> = {
    cert:           { bg: '#E8F0FC', color: '#0046A4' },
    'finance-cert': { bg: '#E8F0FC', color: '#0046A4' },
    otp:            { bg: '#FFF3EC', color: '#FF6600' },
    'security-card':{ bg: '#F0FFF4', color: '#059669' },
};

interface CardData {
    type: keyof typeof CARD_ICONS;
    title: string;
    desc: string;
    href?: string;
    isLast?: boolean;
}

function buildCard(card: CardData): string {
    const iconStyle = CARD_ICON_STYLE[card.type] ?? CARD_ICON_STYLE['cert'];
    const borderBottom = card.isLast ? 'none' : '1px solid #F9FAFB';
    return (
        `<a href="${card.href ?? '#'}" class="ac-item" style="display:flex;align-items:center;gap:14px;padding:14px 20px;text-decoration:none;border-bottom:${borderBottom};min-height:64px;">` +
            `<div class="ac-icon-wrap" style="width:48px;height:48px;border-radius:14px;background:${iconStyle.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;color:${iconStyle.color};">` +
                `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="22" height="22">${CARD_ICONS[card.type]}</svg>` +
            `</div>` +
            `<div style="flex:1;display:flex;flex-direction:column;gap:3px;min-width:0;">` +
                `<span style="font-size:15px;font-weight:700;color:#1A1A2E;">${card.title}</span>` +
                `<span style="font-size:12px;color:#6B7280;">${card.desc}</span>` +
            `</div>` +
            ARROW_SVG +
        `</a>`
    );
}

const DEFAULT_CARDS: CardData[] = [
    { type: 'cert',          title: '공동인증서',  desc: '발급 · 갱신 · 복사' },
    { type: 'finance-cert',  title: '금융인증서',  desc: '클라우드 기반 인증' },
    { type: 'otp',           title: 'OTP',         desc: '일회용 비밀번호 생성기' },
    { type: 'security-card', title: '보안카드',     desc: '보안카드 분실 · 재발급', isLast: true },
];

// 모바일용 — 세로 목록
function buildAuthCards(): string {
    return DEFAULT_CARDS.map(buildCard).join('');
}

// 웹 전용 — 2×2 CSS grid 레이아웃
// 카드 테두리를 grid gap으로 대체하여 격자 구분
function buildAuthCardsWeb(): string {
    const webCard = (card: CardData): string => {
        const iconStyle = CARD_ICON_STYLE[card.type] ?? CARD_ICON_STYLE['cert'];
        return (
            `<a href="${card.href ?? '#'}" class="ac-item" style="display:flex;align-items:center;gap:14px;padding:20px 24px;text-decoration:none;background:#fff;border-radius:12px;border:1px solid #F3F4F6;min-height:80px;">` +
                `<div class="ac-icon-wrap" style="width:52px;height:52px;border-radius:14px;background:${iconStyle.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;color:${iconStyle.color};">` +
                    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">${CARD_ICONS[card.type]}</svg>` +
                `</div>` +
                `<div style="flex:1;display:flex;flex-direction:column;gap:4px;min-width:0;">` +
                    `<span style="font-size:16px;font-weight:700;color:#1A1A2E;">${card.title}</span>` +
                    `<span style="font-size:13px;color:#6B7280;">${card.desc}</span>` +
                `</div>` +
                ARROW_SVG +
            `</a>`
        );
    };
    return (
        `<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;padding:20px 24px;">` +
            DEFAULT_CARDS.map(webCard).join('') +
        `</div>`
    );
}

function buildHeader(): string {
    return (
        `<div style="padding:20px 20px 12px;border-bottom:1px solid #F3F4F6;">` +
            `<h3 style="font-size:18px;font-weight:700;color:#1A1A2E;margin:0 0 4px;">인증센터</h3>` +
            `<p style="font-size:13px;color:#6B7280;margin:0;">안전한 금융거래를 위한 인증 서비스</p>` +
        `</div>`
    );
}

// 웹 전용 헤더 — 패딩·폰트 데스크탑 기준으로 확장
function buildHeaderWeb(): string {
    return (
        `<div style="padding:28px 32px 16px;border-bottom:1px solid #F3F4F6;">` +
            `<h3 style="font-size:20px;font-weight:700;color:#1A1A2E;margin:0 0 6px;">인증센터</h3>` +
            `<p style="font-size:14px;color:#6B7280;margin:0;">안전한 금융거래를 위한 인증 서비스</p>` +
        `</div>`
    );
}

function buildNotice(): string {
    return (
        `<div style="display:flex;align-items:flex-start;gap:8px;background:#FEF9C3;padding:14px 20px;border-top:1px solid #FEF08A;">` +
            NOTICE_ICON_SVG +
            `<p style="font-size:12px;color:#78350F;line-height:1.5;margin:0;font-weight:500;">[금융사명]은 절대 개인정보, 보안카드 번호 전체를 요구하지 않습니다.</p>` +
        `</div>`
    );
}

// ── mobile variant ──────────────────────────────────────────────────────────
const AUTH_CENTER_MOBILE_HTML =
    `<div data-component-id="auth-center-mobile" data-spw-block style="font-family:${FONT_FAMILY};background:#fff;border-radius:20px;box-shadow:0 2px 16px rgba(0,70,164,0.07);">` +
        buildHeader() +
        `<div style="padding:8px 0;">` +
            buildAuthCards() +
        `</div>` +
        buildNotice() +
    `</div>`;

// ── web variant ─────────────────────────────────────────────────────────────
const AUTH_CENTER_WEB_HTML =
    `<div data-component-id="auth-center-web" data-spw-block style="font-family:${FONT_FAMILY};background:#fff;border-radius:20px;box-shadow:0 2px 16px rgba(0,70,164,0.07);width:100%;box-sizing:border-box;">` +
        buildHeaderWeb() +
        buildAuthCardsWeb() +
        buildNotice() +
    `</div>`;

// ── responsive variant ──────────────────────────────────────────────────────
const AUTH_CENTER_RESPONSIVE_HTML =
    `<div data-component-id="auth-center-responsive" data-spw-block style="font-family:${FONT_FAMILY};background:#fff;border-radius:20px;box-shadow:0 2px 16px rgba(0,70,164,0.07);width:100%;box-sizing:border-box;">` +
        buildHeader() +
        `<div style="padding:8px 0;">` +
            buildAuthCards() +
        `</div>` +
        buildNotice() +
    `</div>`;

const VARIANTS = [
    { id: 'auth-center-mobile',     html: AUTH_CENTER_MOBILE_HTML },
    { id: 'auth-center-web',        html: AUTH_CENTER_WEB_HTML },
    { id: 'auth-center-responsive', html: AUTH_CENTER_RESPONSIVE_HTML },
];

async function main() {
    for (const variant of VARIANTS) {
        const existing = await getComponentById(variant.id);
        if (!existing) {
            console.error(`❌ ${variant.id} — 찾을 수 없음`);
            continue;
        }
        await updateComponent({
            componentId:        variant.id,
            componentType:      existing.COMPONENT_TYPE,
            viewMode:           existing.VIEW_MODE,
            componentThumbnail: existing.COMPONENT_THUMBNAIL ?? undefined,
            data: { ...(existing.DATA ?? {}) as Record<string, unknown>, html: variant.html },
            lastModifierId: 'system',
        });
        console.log(`✅ ${variant.id} 완료`);
    }
    await closePool();
}

main().catch((err) => { console.error('실패:', err); process.exit(1); });
