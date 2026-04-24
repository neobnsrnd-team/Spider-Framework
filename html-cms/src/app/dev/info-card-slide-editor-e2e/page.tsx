'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import InfoCardSlideEditor from '@/components/edit/InfoCardSlideEditor';

interface CardButton {
    label: string;
    href?: string;
}

interface CardSlide {
    tag?: string;
    showMore?: boolean;
    moreHref?: string;
    title: string;
    widthPx?: number;
    heightPx?: number;
    copyable?: boolean;
    subtitle?: string;
    infoLines?: string[];
    buttons?: CardButton[];
}

const FONT_FAMILY = "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif";

const DEFAULT_SLIDES: CardSlide[] = [
    {
        tag: '이벤트',
        showMore: true,
        moreHref: '#details',
        title: 'IBK 신용카드 혜택',
        copyable: true,
        subtitle: '연회비 무료 이벤트 진행 중',
        infoLines: ['유효기간: 2024.12.31'],
        buttons: [{ label: '자세히 보기' }, { label: '신청하기' }],
    },
    {
        tag: '안내',
        title: '체크카드 캐시백 안내',
        subtitle: '월 30만원 이상 이용 시 1% 캐시백',
        infoLines: ['적용일: 2024.01.01', '한도: 월 5,000원'],
        buttons: [{ label: '상세 조건 보기' }],
    },
];

function getCardStyles() {
    return {
        tag: 'display:inline-block;max-width:100%;padding:4px 12px;border-radius:12px;background:#E8F0FC;color:#0046A4;font-size:12px;font-weight:600;overflow-wrap:anywhere;word-break:break-all;box-sizing:border-box;',
        more: 'color:#9CA3AF;font-size:13px;text-decoration:none;line-height:1.4;display:inline-flex;align-items:center;justify-content:flex-end;max-width:96px;min-width:0;overflow-wrap:anywhere;word-break:break-word;text-align:right;flex-shrink:1;',
        header: 'display:flex;align-items:flex-start;justify-content:space-between;gap:8px;',
        copyButton:
            'background:none;border:none;cursor:pointer;padding:2px;flex-shrink:0;display:flex;align-items:center;',
        titleWrap: 'display:flex;align-items:flex-start;gap:4px;min-width:0;max-width:100%;',
        title: 'display:block;font-size:18px;font-weight:700;color:#1A1A2E;flex:1;min-width:0;max-width:100%;overflow-wrap:anywhere;word-break:break-all;line-height:1.4;',
        subtitle:
            'display:block;max-width:100%;font-size:14px;color:#6B7280;overflow-wrap:anywhere;word-break:break-all;line-height:1.45;',
        infoLine:
            'display:block;max-width:100%;font-size:13px;color:#6B7280;text-align:right;overflow-wrap:anywhere;word-break:break-all;line-height:1.45;',
        buttonsWrap: 'display:flex;gap:8px;margin-top:4px;min-width:0;max-width:100%;flex-wrap:wrap;',
        button: 'flex:1 1 120px;min-width:0;max-width:100%;text-align:center;padding:10px;border-radius:8px;background:#F5F7FA;color:#1A1A2E;font-size:13px;font-weight:600;text-decoration:none;white-space:normal;overflow-wrap:anywhere;word-break:break-all;line-height:1.35;box-sizing:border-box;',
        itemOuter: 'flex-shrink:0;width:100%;max-width:100%;padding:0 8px;box-sizing:border-box;',
        itemInner:
            'width:100%;max-width:100%;overflow:hidden;background:#fff;border:1px solid #E5E7EB;border-radius:16px;padding:20px;display:flex;flex-direction:column;gap:12px;min-height:180px;box-sizing:border-box;',
        track: 'display:flex;flex-direction:column;gap:12px;padding:8px 0;',
    };
}

function buildCardHtml(card: CardSlide, idx: number): string {
    const styles = getCardStyles();
    const tagHtml = card.tag ? `<span style="${styles.tag}">${card.tag}</span>` : '';
    const moreHtml = card.showMore
        ? `<a href="${card.moreHref || '#'}" data-card-more style="${styles.more}">더보기</a>`
        : '';
    const copyBtnHtml = card.copyable
        ? `<button data-card-copy style="${styles.copyButton}"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>`
        : '';

    return (
        `<div data-card-item data-card-idx="${idx}" style="${styles.itemOuter}">` +
        `<div style="${styles.itemInner}">` +
        (tagHtml || moreHtml ? `<div style="${styles.header}">${tagHtml}${moreHtml}</div>` : '') +
        `<div style="${styles.titleWrap}"><span data-card-title style="${styles.title}">${card.title}</span>${copyBtnHtml}</div>` +
        (card.subtitle ? `<span style="${styles.subtitle}">${card.subtitle}</span>` : '') +
        (card.infoLines ?? []).map((line) => `<span style="${styles.infoLine}">${line}</span>`).join('') +
        ((card.buttons ?? []).length > 0
            ? `<div style="${styles.buttonsWrap}">${(card.buttons ?? [])
                  .map((button) => `<a href="${button.href || '#'}" style="${styles.button}">${button.label}</a>`)
                  .join('')}</div>`
            : '') +
        `</div></div>`
    );
}

export default function InfoCardSlideEditorE2EPage() {
    const blockRef = useRef<HTMLDivElement | null>(null);
    const [editorBlock, setEditorBlock] = useState<HTMLElement | null>(null);
    const [editorOpen, setEditorOpen] = useState(false);
    const slidesJson = useMemo(() => JSON.stringify(DEFAULT_SLIDES), []);

    useEffect(() => {
        const block = blockRef.current;
        if (!block) return;

        block.setAttribute('data-component-id', 'info-card-slide-mobile');
        block.setAttribute('data-spw-block', '');
        block.setAttribute('data-card-view-mode', 'mobile');
        block.setAttribute('data-card-slides', slidesJson);
        block.style.fontFamily = FONT_FAMILY;
        block.style.background = '#ffffff';

        block.innerHTML = `<div data-card-track style="${getCardStyles().track}">${DEFAULT_SLIDES.map((card, idx) => buildCardHtml(card, idx)).join('')}</div>`;
    }, [slidesJson]);

    return (
        <main style={{ minHeight: '100vh', padding: 24, background: '#edf2f7' }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <button
                    data-testid="open-info-card-slide-editor"
                    onClick={() => {
                        if (!blockRef.current) return;
                        setEditorBlock(blockRef.current);
                        setEditorOpen(true);
                    }}
                    style={{
                        border: 'none',
                        background: '#0046A4',
                        color: '#fff',
                        borderRadius: 8,
                        padding: '10px 14px',
                        fontWeight: 700,
                        cursor: 'pointer',
                    }}
                >
                    정보 카드 편집 열기
                </button>
            </div>

            <div ref={blockRef} data-testid="info-card-slide-block" style={{ maxWidth: 420, margin: '0 auto' }} />

            {editorOpen && editorBlock && (
                <InfoCardSlideEditor
                    blockEl={editorBlock}
                    onClose={() => {
                        setEditorOpen(false);
                        setEditorBlock(null);
                    }}
                />
            )}
        </main>
    );
}
