// src/components/edit/BenefitCardEditor.tsx
// benefit-card 블록의 혜택 카드 항목을 추가·삭제·순서변경·제목수정하는 모달 에디터 (Issue #231)
// 아이콘·설명은 ContentBuilder 인라인 편집으로 직접 수정

'use client';

import { useState } from 'react';

interface CardItem {
    icon: string; // 이모지 또는 이미지 URL
    title: string;
    desc: string;
}

interface Props {
    blockEl: HTMLElement;
    onClose: () => void;
}

const FONT_FAMILY = "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif";

// ── 헬퍼 ─────────────────────────────────────────────────────────────────────

/** 값이 이미지 URL인지 판별 (http/https, 절대경로 /, data URI) */
function isImageUrl(val: string): boolean {
    return /^(https?:\/\/|\/|data:image\/)/.test(val.trim());
}

// ── 카드 HTML 빌더 ────────────────────────────────────────────────────────────
// data-bc-icon / data-bc-title / data-bc-desc: parseCards()가 DOM에서 읽을 때 사용

function buildCard(card: CardItem): string {
    const iconContent = isImageUrl(card.icon)
        ? `<img src="${card.icon}" style="width:28px;height:28px;object-fit:contain;" alt="" />`
        : `<span style="font-size:24px;line-height:1;">${card.icon}</span>`;

    return (
        `<a href="#" style="display:block;text-decoration:none;flex:1;min-width:0;">` +
        `<div style="background:#fff;border:1px solid #E5E7EB;border-radius:20px;padding:24px 20px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;box-shadow:0 4px 20px rgba(0,70,164,0.08);height:100%;box-sizing:border-box;">` +
        `<div data-bc-icon style="width:48px;height:48px;background:#E8F0FC;border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">` +
        iconContent +
        `</div>` +
        `<div data-bc-title style="font-size:16px;font-weight:700;color:#0046A4;line-height:1.3;word-break:keep-all;">${card.title}</div>` +
        `<div data-bc-desc style="font-size:12px;color:#6B7280;line-height:1.4;word-break:keep-all;">${card.desc}</div>` +
        `</div>` +
        `</a>`
    );
}

// mobile 뷰어용 scroll-snap 변환 인라인 스크립트 (마이그레이션 스크립트와 동기화)
const SCROLL_SCRIPT =
    `<script data-bc-script>` +
    `(function(){` +
    `if(window.builderRuntime)return;` +
    `var root=document.currentScript&&document.currentScript.parentElement;` +
    `if(!root)return;` +
    `var track=root.querySelector('[data-bc-track]');` +
    `if(!track)return;` +
    `track.className=(track.className||'').replace(/\\bflex(?:-col)?\\b/g,'').trim();` +
    `track.style.cssText='display:flex;flex-direction:row;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none;gap:0;padding:4px 0 8px;';` +
    `var slides=Array.from(track.querySelectorAll('[data-bc-slide]'));` +
    `slides.forEach(function(s){` +
    `s.style.cssText='flex-shrink:0;width:80%;scroll-snap-align:start;padding:0 8px;box-sizing:border-box;';` +
    `});` +
    `})();` +
    `<\/script>`;

// ── DOM 조작 함수 ────────────────────────────────────────────────────────────

/** blockEl DOM을 새 카드 데이터로 갱신 */
function applyToBlock(blockEl: HTMLElement, cards: CardItem[]) {
    blockEl.setAttribute('data-bc-cards', JSON.stringify(cards));

    const compId = blockEl.getAttribute('data-component-id') ?? '';
    const container = blockEl.querySelector<HTMLElement>('[data-bc-container]');
    if (!container) return;

    if (compId.endsWith('-mobile')) {
        // container 자체가 data-bc-track을 겸하므로 querySelector 대신 container 직접 사용
        container.innerHTML = cards
            .map((card) => `<div data-bc-slide style="width:100%;">${buildCard(card)}</div>`)
            .join('');
        blockEl.querySelectorAll('script[data-bc-script]').forEach((el) => el.remove());
        blockEl.insertAdjacentHTML('beforeend', SCROLL_SCRIPT);
    } else if (compId.endsWith('-web')) {
        container.innerHTML = cards.map((card) => buildCard(card)).join('');
    } else if (compId.endsWith('-responsive')) {
        container.innerHTML = cards
            .map(
                (card) =>
                    `<div style="flex:1;min-width:calc(50% - 6px);box-sizing:border-box;">${buildCard(card)}</div>`,
            )
            .join('');
    }
}

/**
 * blockEl에서 현재 카드 데이터 파싱
 *
 * 우선순위:
 * 1. DOM (data-bc-title 속성 존재 시) — ContentBuilder 인라인 편집 결과 반영
 * 2. data-bc-cards 속성 — data-bc-title 없는 구버전 블록(마이그레이션 재실행 전) 또는 DOM 파싱 실패
 */
function parseCards(blockEl: HTMLElement): CardItem[] {
    const anchors = blockEl.querySelectorAll(
        '[data-bc-slide] a, [data-bc-container] > a, [data-bc-container] > div > a',
    );

    // data-bc-title 속성이 존재하는 경우에만 DOM 읽기
    // 구버전 블록(속성 없음)은 anchors가 있어도 폴백으로 내려감
    if (anchors.length > 0 && anchors[0]?.querySelector('[data-bc-title]')) {
        return Array.from(anchors).map((el) => {
            const iconWrapper = el.querySelector('[data-bc-icon]');
            const iconImg = iconWrapper?.querySelector('img');
            const iconSpan = iconWrapper?.querySelector('span');
            const titleEl = el.querySelector('[data-bc-title]');
            const descEl = el.querySelector('[data-bc-desc]');
            return {
                icon: (iconImg?.getAttribute('src') ?? iconSpan?.textContent?.trim()) || '💰',
                title: titleEl?.textContent?.trim() ?? '',
                desc: descEl?.textContent?.trim() ?? '',
            };
        });
    }

    // 폴백: data-bc-cards 속성 (구버전 블록 또는 DOM 속성 없는 경우)
    const raw = blockEl.getAttribute('data-bc-cards');
    if (raw) {
        try {
            return JSON.parse(raw) as CardItem[];
        } catch {
            // 무시
        }
    }

    return [];
}

// ── 스타일 상수 ──────────────────────────────────────────────────────────────

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
        width: 400,
        maxHeight: '82vh',
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
    },
    guide: {
        padding: '8px 14px',
        background: '#f0f4ff',
        borderBottom: '1px solid #e5e7eb',
        fontSize: 11,
        color: '#4b6baf',
        flexShrink: 0,
    },
    body: {
        overflowY: 'auto' as const,
        flex: 1,
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 8,
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
    itemRow: {
        border: '1px solid #e5e7eb',
        borderRadius: 10,
        background: '#fafafa',
        padding: '7px 10px',
        display: 'flex',
        flexDirection: 'row' as const,
        alignItems: 'center',
        gap: 5,
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
    input: {
        flex: 1,
        padding: '5px 9px',
        border: '1px solid #e5e7eb',
        borderRadius: 6,
        fontSize: 13,
        color: '#111827',
        background: '#fff',
        boxSizing: 'border-box' as const,
        fontFamily: FONT_FAMILY,
        outline: 'none',
        minWidth: 0,
    },
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

// ── 컴포넌트 ─────────────────────────────────────────────────────────────────

export default function BenefitCardEditor({ blockEl, onClose }: Props) {
    const [cards, setCards] = useState<CardItem[]>(() => parseCards(blockEl));

    const handleTitleChange = (idx: number, value: string) => {
        setCards((prev) => prev.map((card, i) => (i === idx ? { ...card, title: value } : card)));
    };

    const handleAdd = () => {
        setCards((prev) => [...prev, { icon: '⭐', title: '새 혜택', desc: '혜택 설명을 입력하세요' }]);
    };

    const handleDelete = (idx: number) => {
        if (cards.length <= 1) return;
        setCards((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleMoveUp = (idx: number) => {
        if (idx === 0) return;
        const next = [...cards];
        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
        setCards(next);
    };

    const handleMoveDown = (idx: number) => {
        if (idx === cards.length - 1) return;
        const next = [...cards];
        [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
        setCards(next);
    };

    const handleApply = () => {
        applyToBlock(blockEl, cards);
        onClose();
    };

    return (
        <>
            {/* 오버레이 */}
            <div onClick={onClose} style={S.overlay} />

            {/* 패널 */}
            <div onClick={(e) => e.stopPropagation()} style={S.panel}>
                {/* 헤더 */}
                <div style={S.header}>
                    <span style={{ fontWeight: 700, color: '#111827' }}>혜택 카드 편집</span>
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
                <div style={S.guide}>
                    제목을 수정하거나 카드를 추가·삭제·순서변경합니다. 아이콘·설명은 카드를 직접 클릭해 편집하세요.
                </div>

                {/* 카드 목록 */}
                <div style={S.body}>
                    {cards.map((card, idx) => (
                        <div key={idx} style={S.itemRow}>
                            {/* 순서 번호 */}
                            <span
                                style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: '#9ca3af',
                                    minWidth: 16,
                                    textAlign: 'center',
                                }}
                            >
                                {idx + 1}
                            </span>

                            {/* 위/아래 이동 */}
                            <button
                                type="button"
                                title="위로"
                                disabled={idx === 0}
                                onClick={() => handleMoveUp(idx)}
                                style={{ ...S.iconBtn, opacity: idx === 0 ? 0.35 : 1 }}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    width="13"
                                    height="13"
                                    fill="none"
                                    stroke="#374151"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m18 15-6-6-6 6" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                title="아래로"
                                disabled={idx === cards.length - 1}
                                onClick={() => handleMoveDown(idx)}
                                style={{ ...S.iconBtn, opacity: idx === cards.length - 1 ? 0.35 : 1 }}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    width="13"
                                    height="13"
                                    fill="none"
                                    stroke="#374151"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </button>

                            {/* 제목 */}
                            <input
                                type="text"
                                value={card.title}
                                onChange={(e) => handleTitleChange(idx, e.target.value)}
                                style={S.input}
                                placeholder="30,000원 캐시백"
                            />

                            {/* 삭제 */}
                            <button
                                type="button"
                                title="카드 삭제"
                                disabled={cards.length <= 1}
                                onClick={() => handleDelete(idx)}
                                style={{ ...S.deleteBtn, opacity: cards.length <= 1 ? 0.35 : 1 }}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    width="13"
                                    height="13"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}

                    {/* 카드 추가 버튼 */}
                    <button type="button" onClick={handleAdd} style={S.addBtn}>
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
                        혜택 카드 추가
                    </button>
                </div>

                {/* 푸터 */}
                <div style={S.footer}>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>총 {cards.length}개 카드</span>
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
