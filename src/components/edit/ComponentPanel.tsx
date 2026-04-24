// src/components/edit/ComponentPanel.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import type { FinanceComponent } from '@/data/finance-component-data';
import type { ParsedBlock, BasicBlock } from './EditClient';
import { nextApi } from '@/lib/api-url';

interface Props {
    /** 컴포넌트를 캔버스에 삽입 */
    onInsert: (html: string) => void;
    /** 현재 캔버스 블록 목록 */
    blocks: ParsedBlock[];
    /** 블록 이동 (from 인덱스 → to 인덱스) */
    onMoveBlock: (from: number, to: number) => void;
    /** 블록 삭제 (인덱스) */
    onDelete: (idx: number) => void;
    /** 캔버스 전체 블록 삭제 */
    onDeleteAll: () => void;
    /** 순서 탭에서 블록 클릭 시 캔버스에서 해당 블록 활성화 */
    onActivate: (idx: number) => void;
    /** content-plugins.js에서 읽어온 기본 블록 목록 */
    basicBlocks: BasicBlock[];
    /** DB 또는 파일에서 로드한 금융 컴포넌트 목록 */
    financeComponents: FinanceComponent[];
    basicBlocksLoading?: boolean;
    financeComponentsLoading?: boolean;
    basicBlocksError?: string | null;
    financeComponentsError?: string | null;
    /** 현재 페이지의 뷰 모드 — 해당 모드의 컴포넌트만 표시 */
    viewMode: 'mobile' | 'web' | 'responsive';
    /** 패널에서 외부 드래그 시작/종료 알림 */
    onDragStart?: () => void;
    onDragEnd?: () => void;
    /** 컴포넌트 편집 저장 후 목록 갱신 요청 */
    onComponentUpdate?: () => void;
}

type Tab = 'finance' | 'basic' | 'order';

const BASIC_THUMB_BASE = '/assets/minimalist-blocks/';

// 썸네일 파일명 → 블록 고유 이름 매핑
const BLOCK_LABELS: Record<string, string> = {
    // 텍스트 (120)
    'preview/basic-03.png': '제목 + 본문',
    'preview/basic-05.png': '이미지',
    'preview/basic-06.png': '2단 텍스트',
    'preview/plugin-gallery-01.png': '미디어 갤러리',
    'preview/basic-12.png': '이미지 + 텍스트',
    'preview/basic-textslider.png': '텍스트 슬라이더',
    'preview/ai-B2h6J.webp': '배경 영상',
    'preview/basic-slider2.png': '이미지 슬라이더',
    'preview/basic-18.png': '3단 프로세스',
    'preview/basic-20.png': '구분선',
    'preview/basic-youtube.png': '유튜브',
    'preview/basic-map.png': '지도',
    'preview/basic-audio.png': '오디오',
    'preview/basic-form.png': '입력 폼',
    'preview/basic-code.png': '코드 블록',
    'preview/basic-codeview.png': '코드 뷰어',
    // 기사 (118)
    'preview/article-01.png': '기사 — 중앙 제목',
    'preview/article-03.png': '기사 — 좌측 텍스트',
    'preview/article-15.png': '기사 — 2단 본문',
    // 헤드라인 (101)
    'preview/headline-01.png': '헤드라인 — 대형',
    'preview/headline-02.png': '헤드라인 — 아이콘',
    'preview/headline-05.png': '헤드라인 — CTA',
    'preview/headline-17.png': '헤드라인 — 히어로',
    // 버튼 (119)
    'preview/buttons-02.png': '버튼 — 텍스트+라인',
    'preview/buttons-04.png': '버튼 — 둥근형',
    'preview/buttons-06.png': '버튼 — 채움+라인',
    'preview/buttons-07.png': '버튼 — 소형',
    // 사진 (102)
    'preview/photos-01.png': '사진 — 2열',
    'preview/photos-02.png': '사진 — 3열',
    'preview/photos-03.png': '사진 — 전체',
    // 프로필 (103)
    'preview/profile-01.png': '팀 — 3인 원형',
    'preview/profile-05.png': '팀 — 2인 카드',
    'preview/profile-07.png': '팀 — 상세 소개',
    // 상품 (104)
    'preview/products-05.png': '상품 카드',
    // 프로세스 (106)
    'preview/steps-05.png': '단계별 프로세스',
    // 가격표 (107)
    'preview/pricing-01.png': '가격표 — 2단',
    'preview/pricing-04.png': '가격표 — 3단',
    'preview/pricing-07.png': '가격표 — 하이라이트',
    // 스킬 (108)
    'preview/skills-10.png': '스킬 바',
    // 성과 (109)
    'preview/achievements-03.png': '성과 지표',
    // 인용 (110)
    'preview/quotes-02.png': '인용 — 중앙',
    'preview/quotes-03.png': '인용 — 프로필',
    'preview/quotes-06.png': '인용 — 큰 따옴표',
    // 파트너 (111)
    'preview/partners-02.png': '파트너 로고',
    'preview/partners-05.png': '파트너 — 설명',
    // 404 (113)
    'preview/404-01.png': '404 — 대형 텍스트',
    'preview/404-02.png': '404 — 일러스트',
    'preview/404-03.png': '404 — 미니멀',
    'preview/404-04.png': '404 — 검색',
    // 준비중 (114)
    'preview/comingsoon-03.png': '준비중 페이지',
    // FAQ (115)
    'preview/faq-08.png': 'FAQ 아코디언',
    // 문의 (116)
    'preview/contact-01.png': '문의 — 3단',
    'preview/contact-13.png': '문의 — 간단',
    // 소개 (117)
    'preview/about-04.png': '소개 — 스토리',
    'preview/about-06.png': '소개 — 이미지',
    // 플러그인
    'preview/plugin-pendulum.png': '펜들럼 애니메이션',
    'preview/plugin-mockup.png': '브라우저 목업',
    'preview/plugin-card-list.png': '카드 리스트',
    'preview/plugin-media-slider.png': '미디어 슬라이더',
    'preview/plugin-hero-anim.png': '히어로 애니메이션',
    'preview/plugin-logo-loop.png': '로고 루프',
    'preview/plugin-before-after.png': '전후 비교',
    'preview/plugin-timeline.png': '타임라인',
    'preview/plugin-accordion.png': '아코디언',
    'preview/plugin-media-grid.png': '미디어 그리드',
    'preview/plugin-social-share.png': '소셜 공유',
    'preview/plugin-cta-buttons.png': 'CTA 버튼',
    'preview/plugin-anim-stats.png': '애니메이션 통계',
};

function ComponentLoadState({ error, label }: { error?: string | null; label: string }) {
    return (
        <div
            style={{
                flex: 1,
                minHeight: 180,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                color: error ? '#b91c1c' : '#6b7280',
                fontSize: '12px',
                textAlign: 'center',
                padding: '20px',
            }}
        >
            {!error && (
                <span
                    style={{
                        width: '28px',
                        height: '28px',
                        border: '3px solid #dbeafe',
                        borderTopColor: '#0046A4',
                        borderRadius: '50%',
                        animation: 'spw-component-spin 0.8s linear infinite',
                    }}
                />
            )}
            <span>{error ?? label}</span>
        </div>
    );
}

export default function ComponentPanel({
    onInsert,
    blocks,
    onMoveBlock,
    onDelete,
    onDeleteAll,
    onActivate,
    basicBlocks,
    financeComponents,
    basicBlocksLoading = false,
    financeComponentsLoading = false,
    basicBlocksError = null,
    financeComponentsError = null,
    viewMode,
    onDragStart,
    onDragEnd,
    onComponentUpdate,
}: Props) {
    const [collapsed, setCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('finance');
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [hoveredOrderIdx, setHoveredOrderIdx] = useState<number | null>(null);
    const [editingComp, setEditingComp] = useState<FinanceComponent | null>(null);

    // ── 탭별 스크롤 위치 저장/복원 ────────────────────────────────────────
    const scrollPositions = useRef<Record<Tab, number>>({ finance: 0, basic: 0, order: 0 });
    const scrollRefs = useRef<Partial<Record<Tab, HTMLDivElement | null>>>({});

    function handleTabChange(newTab: Tab) {
        // 현재 탭 스크롤 위치 저장
        const currentEl = scrollRefs.current[activeTab];
        if (currentEl) scrollPositions.current[activeTab] = currentEl.scrollTop;
        setActiveTab(newTab);
    }

    useEffect(() => {
        // 탭 전환 후 저장된 스크롤 위치 복원
        const el = scrollRefs.current[activeTab];
        if (el) el.scrollTop = scrollPositions.current[activeTab] ?? 0;
    }, [activeTab]);

    // ── 탭: 금융 컴포넌트 ─ 캔버스 드래그 핸들러 ─────────────────────────
    function handleCompDragStart(e: React.DragEvent, comp: FinanceComponent) {
        e.dataTransfer.setData('text/plain', comp.html);
        e.dataTransfer.effectAllowed = 'copy';
        onDragStart?.();
    }

    // ── 탭: 기본 블록 ─ 드래그 핸들러 ────────────────────────────────────
    function handleBasicDragStart(e: React.DragEvent, block: BasicBlock) {
        e.dataTransfer.setData('text/plain', block.html);
        e.dataTransfer.effectAllowed = 'copy';
        onDragStart?.();
    }

    // ── 탭: 블록 순서 ─ 드래그 핸들러 ────────────────────────────────────
    // • dragBlockIdx: 드래그 중인 아이템 인덱스 (ref — DnD 도중 re-render 없이 접근)
    // • draggingIdx : 드래그 중인 아이템 인덱스 (state — 시각 표시용, dragStart 직후 설정)
    // • insertBeforeIdx : 삽입 예정 위치 (state — 구분선 표시용)
    // • insertIdxRef : insertBeforeIdx의 ref 사본 (rAF 콜백 내에서 최신값 비교용)
    // • rafRef : requestAnimationFrame ID (throttle)
    const dragBlockIdx = useRef<number | null>(null);
    const insertIdxRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);
    const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
    const [insertBeforeIdx, setInsertBeforeIdx] = useState<number | null>(null);
    const visibleFinanceComponents = financeComponents.filter((c) => c.viewMode === viewMode);
    const visibleBasicBlocks = basicBlocks.filter((b) => b.viewMode === viewMode);

    function handleBlockDragStart(e: React.DragEvent, idx: number) {
        dragBlockIdx.current = idx;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/x-block-idx', String(idx));
        // 드래그 ghost 캡처 이후 re-render — setTimeout 0으로 지연
        setTimeout(() => setDraggingIdx(idx), 0);
    }

    function handleBlockDragEnd() {
        dragBlockIdx.current = null;
        insertIdxRef.current = null;
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        setDraggingIdx(null);
        setInsertBeforeIdx(null);
    }

    // 컨테이너 레벨 dragOver — 마우스 Y로 삽입 위치 계산, rAF throttle
    function handleOrderDragOver(e: React.DragEvent) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (rafRef.current) return;
        const y = e.clientY;
        const items = Array.from((e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('[data-order-item]'));
        const rects = items.map((el) => el.getBoundingClientRect());
        rafRef.current = requestAnimationFrame(() => {
            rafRef.current = null;
            let pos = items.length; // 기본: 맨 끝
            for (let i = 0; i < rects.length; i++) {
                if (y < rects[i].top + rects[i].height / 2) {
                    pos = i;
                    break;
                }
            }
            if (insertIdxRef.current !== pos) {
                insertIdxRef.current = pos;
                setInsertBeforeIdx(pos);
            }
        });
    }

    function handleOrderDrop(e: React.DragEvent) {
        e.preventDefault();
        const raw = e.dataTransfer.getData('text/x-block-idx');
        const from = raw !== '' ? parseInt(raw, 10) : dragBlockIdx.current;
        const to = insertIdxRef.current;
        dragBlockIdx.current = null;
        insertIdxRef.current = null;
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
        setDraggingIdx(null);
        setInsertBeforeIdx(null);
        if (from === null || to === null || isNaN(from as number)) return;
        onMoveBlock(from as number, to);
    }

    // ── 공용 스타일 ────────────────────────────────────────────────────
    const PANEL_W = 264;
    const COLLAPSED_W = 40;

    return (
        <>
            <style>{`
                @keyframes spw-component-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
            <aside
                style={{
                    position: 'fixed',
                    top: '52px',
                    right: 0,
                    bottom: 0,
                    width: collapsed ? `${COLLAPSED_W}px` : `${PANEL_W}px`,
                    background: '#f9fafb',
                    borderLeft: '1px solid #e5e7eb',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 90,
                    transition: 'width 0.2s ease',
                    overflow: 'hidden',
                }}
            >
                {/* ── 패널 헤더 ── */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 10px',
                        borderBottom: '1px solid #e5e7eb',
                        background: '#ffffff',
                        flexShrink: 0,
                        gap: '6px',
                    }}
                >
                    {!collapsed && (
                        /* ── 탭 버튼 (3개) ── */
                        <div style={{ display: 'flex', gap: '3px', flex: 1 }}>
                            {(
                                [
                                    { key: 'finance', label: '금융' },
                                    { key: 'basic', label: '기본 블록' },
                                    { key: 'order', label: `순서${blocks.length > 0 ? ` (${blocks.length})` : ''}` },
                                ] as { key: Tab; label: string }[]
                            ).map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => handleTabChange(tab.key)}
                                    style={{
                                        flex: 1,
                                        padding: '4px 2px',
                                        border: 'none',
                                        borderRadius: '6px',
                                        background: activeTab === tab.key ? '#0046A4' : 'transparent',
                                        color: activeTab === tab.key ? '#ffffff' : '#6b7280',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* 접기/펴기 버튼 */}
                    <button
                        onClick={() => setCollapsed((v) => !v)}
                        title={collapsed ? '패널 펼치기' : '패널 접기'}
                        style={{
                            flexShrink: 0,
                            width: '28px',
                            height: '28px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            background: '#ffffff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#6b7280',
                        }}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width={14}
                            height={14}
                            style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                        >
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </div>

                {!collapsed && (
                    <div
                        style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                    >
                        {/* ══ 탭 1: 금융 컴포넌트 ══ */}
                        {activeTab === 'finance' && (
                            <div
                                ref={(el) => {
                                    scrollRefs.current['finance'] = el;
                                }}
                                style={{
                                    flex: 1,
                                    minHeight: 0,
                                    overflowY: 'auto',
                                    padding: '10px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '6px',
                                }}
                            >
                                <p
                                    style={{
                                        margin: '0 0 4px',
                                        fontSize: '11px',
                                        color: '#9ca3af',
                                        textAlign: 'center',
                                    }}
                                >
                                    드래그하거나 + 클릭하여 캔버스에 추가
                                </p>

                                {financeComponentsLoading || financeComponentsError ? (
                                    <ComponentLoadState
                                        error={financeComponentsError}
                                        label="금융 컴포넌트를 불러오는 중입니다."
                                    />
                                ) : visibleFinanceComponents.length === 0 ? (
                                    <ComponentLoadState label="표시할 금융 컴포넌트가 없습니다." />
                                ) : (
                                    visibleFinanceComponents.map((comp) => (
                                        <div
                                            key={comp.id}
                                            draggable
                                            onDragStart={(e) => handleCompDragStart(e, comp)}
                                            onDragEnd={() => onDragEnd?.()}
                                            onMouseEnter={() => setHoveredId(comp.id)}
                                            onMouseLeave={() => setHoveredId(null)}
                                            title={comp.description}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                padding: '10px 10px',
                                                background: hoveredId === comp.id ? '#EBF4FF' : '#ffffff',
                                                border: `1px solid ${hoveredId === comp.id ? '#0046A4' : '#e5e7eb'}`,
                                                borderRadius: '8px',
                                                cursor: 'grab',
                                                userSelect: 'none',
                                                boxShadow:
                                                    hoveredId === comp.id
                                                        ? '0 2px 8px rgba(0,70,164,0.10)'
                                                        : '0 1px 2px rgba(0,0,0,0.04)',
                                                transition: 'background 0.12s, border-color 0.12s, box-shadow 0.12s',
                                            }}
                                        >
                                            {/* 미리보기 썸네일 */}
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={nextApi(comp.preview)}
                                                alt={comp.label}
                                                draggable={false}
                                                style={{
                                                    width: '52px',
                                                    height: '40px',
                                                    objectFit: 'cover',
                                                    borderRadius: '5px',
                                                    border: '1px solid #e5e7eb',
                                                    background: '#f3f4f6',
                                                    flexShrink: 0,
                                                }}
                                            />

                                            {/* 텍스트 */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div
                                                    style={{
                                                        fontSize: '12px',
                                                        fontWeight: 700,
                                                        color: hoveredId === comp.id ? '#0046A4' : '#111827',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        transition: 'color 0.12s',
                                                    }}
                                                >
                                                    {comp.label}
                                                </div>
                                                <div
                                                    style={{
                                                        fontSize: '10px',
                                                        color: '#6b7280',
                                                        marginTop: '2px',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                    }}
                                                >
                                                    {comp.description}
                                                </div>
                                            </div>

                                            {/* 편집 버튼 — 플러그인 방식(data-cb-type) 컴포넌트만 표시 (settings 전용 컴포넌트 제외) */}
                                            {/data-cb-type\s*=/.test(comp.html) &&
                                                !comp.id.startsWith('sticky-floating-bar') && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingComp(comp);
                                                        }}
                                                        title="컴포넌트 편집"
                                                        style={{
                                                            flexShrink: 0,
                                                            width: '26px',
                                                            height: '26px',
                                                            border: `1px solid ${hoveredId === comp.id ? '#9ca3af' : '#d1d5db'}`,
                                                            borderRadius: '50%',
                                                            background: hoveredId === comp.id ? '#f3f4f6' : '#f9fafb',
                                                            color: hoveredId === comp.id ? '#374151' : '#9ca3af',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            transition: 'all 0.12s',
                                                            padding: 0,
                                                        }}
                                                    >
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            width={12}
                                                            height={12}
                                                        >
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                        </svg>
                                                    </button>
                                                )}

                                            {/* 추가 버튼 */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onInsert(comp.html);
                                                }}
                                                title="캔버스 끝에 추가"
                                                style={{
                                                    flexShrink: 0,
                                                    width: '26px',
                                                    height: '26px',
                                                    border: `1px solid ${hoveredId === comp.id ? '#0046A4' : '#d1d5db'}`,
                                                    borderRadius: '50%',
                                                    background: hoveredId === comp.id ? '#0046A4' : '#f9fafb',
                                                    color: hoveredId === comp.id ? '#ffffff' : '#6b7280',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.12s',
                                                    padding: 0,
                                                }}
                                            >
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth={2.5}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    width={12}
                                                    height={12}
                                                >
                                                    <line x1="12" y1="5" x2="12" y2="19" />
                                                    <line x1="5" y1="12" x2="19" y2="12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* ══ 탭 2: 기본 블록 ══ */}
                        {activeTab === 'basic' && (
                            <div
                                ref={(el) => {
                                    scrollRefs.current['basic'] = el;
                                }}
                                style={{
                                    flex: 1,
                                    minHeight: 0,
                                    overflowY: 'auto',
                                    padding: '10px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '6px',
                                }}
                            >
                                <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af', textAlign: 'center' }}>
                                    드래그하거나 + 클릭하여 캔버스에 추가
                                </p>

                                {basicBlocksLoading || basicBlocksError ? (
                                    <ComponentLoadState
                                        error={basicBlocksError}
                                        label="기본 블록을 불러오는 중입니다."
                                    />
                                ) : visibleBasicBlocks.length === 0 ? (
                                    <ComponentLoadState label="표시할 기본 블록이 없습니다." />
                                ) : (
                                    /* 2열 그리드로 썸네일 표시 */
                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '6px',
                                        }}
                                    >
                                        {visibleBasicBlocks.map((block, idx) => (
                                            <BasicBlockCard
                                                key={idx}
                                                block={block}
                                                onDragStart={handleBasicDragStart}
                                                onDragEnd={() => onDragEnd?.()}
                                                onInsert={onInsert}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ══ 탭 3: 블록 순서 변경 ══ */}
                        {activeTab === 'order' && (
                            <div
                                ref={(el) => {
                                    scrollRefs.current['order'] = el;
                                }}
                                onDragOver={handleOrderDragOver}
                                onDrop={handleOrderDrop}
                                style={{
                                    flex: 1,
                                    minHeight: 0,
                                    overflowY: 'auto',
                                    padding: '10px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '6px',
                                }}
                            >
                                {blocks.length === 0 ? (
                                    <div
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#9ca3af',
                                            fontSize: '12px',
                                            textAlign: 'center',
                                            gap: '8px',
                                            padding: '20px',
                                        }}
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={1.5}
                                            width={32}
                                            height={32}
                                            style={{ opacity: 0.4 }}
                                        >
                                            <rect x="3" y="3" width="18" height="18" rx="2" />
                                            <line x1="3" y1="9" x2="21" y2="9" />
                                            <line x1="3" y1="15" x2="21" y2="15" />
                                        </svg>
                                        캔버스에 컴포넌트를 추가하면
                                        <br />
                                        여기서 순서를 조정할 수 있습니다
                                    </div>
                                ) : (
                                    <>
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: '6px',
                                            }}
                                        >
                                            <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af' }}>
                                                드래그하여 순서 변경
                                            </p>
                                            <button
                                                onClick={() => {
                                                    if (confirm('캔버스의 모든 블록을 삭제하시겠습니까?')) {
                                                        onDeleteAll();
                                                    }
                                                }}
                                                title="전체 블록 삭제"
                                                style={{
                                                    flexShrink: 0,
                                                    padding: '3px 8px',
                                                    border: '1px solid #fca5a5',
                                                    borderRadius: '6px',
                                                    background: '#fff5f5',
                                                    color: '#ef4444',
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                전체 삭제
                                            </button>
                                        </div>
                                        {blocks.map((block, idx) => {
                                            const isDragging = draggingIdx === idx;
                                            // 삽입 구분선: 해당 인덱스 앞에 표시 (no-op 위치 제외)
                                            const showLine =
                                                draggingIdx !== null &&
                                                insertBeforeIdx === idx &&
                                                draggingIdx !== idx &&
                                                draggingIdx !== idx - 1;
                                            return (
                                                <React.Fragment key={block.id}>
                                                    {/* 삽입 위치 구분선 */}
                                                    {showLine && (
                                                        <div
                                                            style={{
                                                                height: '3px',
                                                                background: '#0046A4',
                                                                borderRadius: '2px',
                                                                flexShrink: 0,
                                                                margin: '-2px 2px',
                                                            }}
                                                        />
                                                    )}
                                                    <div
                                                        data-order-item
                                                        draggable
                                                        onDragStart={(e) => handleBlockDragStart(e, idx)}
                                                        onDragEnd={handleBlockDragEnd}
                                                        onMouseEnter={() => setHoveredOrderIdx(idx)}
                                                        onMouseLeave={() => setHoveredOrderIdx(null)}
                                                        onClick={() => onActivate(idx)}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '8px',
                                                            padding: '8px 10px',
                                                            background: isDragging ? '#f0f4ff' : '#ffffff',
                                                            border: isDragging
                                                                ? '1.5px dashed #93c5fd'
                                                                : `1px solid #e5e7eb`,
                                                            borderRadius: '8px',
                                                            cursor: 'grab',
                                                            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                                                            userSelect: 'none',
                                                            opacity: isDragging ? 0.45 : 1,
                                                            transition: 'opacity 0.1s',
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                flexShrink: 0,
                                                                color: '#9ca3af',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                            }}
                                                        >
                                                            <DragDots />
                                                        </div>

                                                        {block.preview ? (
                                                            // eslint-disable-next-line @next/next/no-img-element
                                                            <img
                                                                src={block.preview}
                                                                alt={block.label}
                                                                draggable={false}
                                                                style={{
                                                                    width: '36px',
                                                                    height: '28px',
                                                                    objectFit: 'contain',
                                                                    flexShrink: 0,
                                                                    borderRadius: '3px',
                                                                    background: '#f3f4f6',
                                                                }}
                                                            />
                                                        ) : (
                                                            <div
                                                                style={{
                                                                    width: '36px',
                                                                    height: '28px',
                                                                    flexShrink: 0,
                                                                    borderRadius: '3px',
                                                                    background: '#f3f4f6',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                }}
                                                            >
                                                                <svg
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="#9ca3af"
                                                                    strokeWidth={1.5}
                                                                    width={14}
                                                                    height={14}
                                                                >
                                                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                                                </svg>
                                                            </div>
                                                        )}

                                                        <div style={{ flex: 1, minWidth: 0 }}>
                                                            <div
                                                                style={{
                                                                    fontSize: '12px',
                                                                    fontWeight: 600,
                                                                    color: '#111827',
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                }}
                                                            >
                                                                {block.label}
                                                            </div>
                                                            <div style={{ fontSize: '10px', color: '#9ca3af' }}>
                                                                {idx + 1} / {blocks.length}
                                                            </div>
                                                        </div>

                                                        {/* 삭제 버튼 (호버 시 표시) */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onDelete(idx);
                                                            }}
                                                            title="블록 삭제"
                                                            style={{
                                                                flexShrink: 0,
                                                                width: '22px',
                                                                height: '22px',
                                                                border: '1px solid #fca5a5',
                                                                borderRadius: '6px',
                                                                background:
                                                                    hoveredOrderIdx === idx ? '#fee2e2' : '#ffffff',
                                                                color: '#ef4444',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                padding: 0,
                                                                opacity: hoveredOrderIdx === idx ? 1 : 0,
                                                                transition: 'opacity 0.15s, background 0.15s',
                                                            }}
                                                        >
                                                            <svg
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                width={12}
                                                                height={12}
                                                            >
                                                                <polyline points="3 6 5 6 21 6" />
                                                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                                <path d="M10 11v6M14 11v6" />
                                                                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </React.Fragment>
                                            );
                                        })}
                                        {/* 맨 끝 삽입 구분선 */}
                                        {draggingIdx !== null &&
                                            insertBeforeIdx === blocks.length &&
                                            draggingIdx !== blocks.length - 1 && (
                                                <div
                                                    style={{
                                                        height: '3px',
                                                        background: '#0046A4',
                                                        borderRadius: '2px',
                                                        flexShrink: 0,
                                                        margin: '-2px 2px',
                                                    }}
                                                />
                                            )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </aside>

            {/* ── 컴포넌트 편집 모달 ── */}
            {editingComp && (
                <EditCompModal
                    comp={editingComp}
                    onClose={() => setEditingComp(null)}
                    onSaved={() => {
                        setEditingComp(null);
                        onComponentUpdate?.();
                    }}
                />
            )}
        </>
    );
}

/** 금융 컴포넌트 인라인 편집 모달 */
function EditCompModal({
    comp,
    onClose,
    onSaved,
}: {
    comp: FinanceComponent;
    onClose: () => void;
    onSaved: () => void;
}) {
    const [label, setLabel] = useState(comp.label);
    const [description, setDescription] = useState(comp.description);
    const [html, setHtml] = useState(comp.html);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSave() {
        setSaving(true);
        setError(null);
        try {
            const res = await fetch(nextApi('/api/components'), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ componentId: comp.id, viewMode: comp.viewMode, label, description, html }),
            });
            const data = await res.json();
            if (!res.ok || data.error) {
                setError(data.error ?? '저장에 실패했습니다.');
            } else {
                onSaved();
            }
        } catch (err: unknown) {
            console.error('컴포넌트 저장 API 호출 오류:', err);
            setError('네트워크 오류가 발생했습니다.');
        } finally {
            setSaving(false);
        }
    }

    const INPUT_STYLE: React.CSSProperties = {
        width: '100%',
        padding: '7px 10px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        fontSize: '13px',
        color: '#111827',
        background: '#ffffff',
        boxSizing: 'border-box',
        outline: 'none',
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.45)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    width: '560px',
                    maxWidth: '90vw',
                    maxHeight: '85vh',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                    overflow: 'hidden',
                }}
            >
                {/* 모달 헤더 */}
                <div
                    style={{
                        padding: '16px 20px',
                        borderBottom: '1px solid #e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexShrink: 0,
                    }}
                >
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>컴포넌트 편집</span>
                    <button
                        onClick={onClose}
                        style={{
                            width: '28px',
                            height: '28px',
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            color: '#6b7280',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '6px',
                        }}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            width={16}
                            height={16}
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* 모달 본문 */}
                <div
                    style={{
                        padding: '20px',
                        overflowY: 'auto',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                    }}
                >
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>이름 (label)</span>
                        <input value={label} onChange={(e) => setLabel(e.target.value)} style={INPUT_STYLE} />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>설명 (description)</span>
                        <input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={INPUT_STYLE}
                        />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>HTML</span>
                        <textarea
                            value={html}
                            onChange={(e) => setHtml(e.target.value)}
                            spellCheck={false}
                            style={{
                                ...INPUT_STYLE,
                                height: '240px',
                                resize: 'vertical',
                                fontFamily: 'monospace',
                                fontSize: '12px',
                                lineHeight: 1.5,
                            }}
                        />
                    </label>
                    {error && (
                        <div
                            style={{
                                fontSize: '12px',
                                color: '#ef4444',
                                padding: '8px 10px',
                                background: '#fef2f2',
                                borderRadius: '6px',
                                border: '1px solid #fca5a5',
                            }}
                        >
                            {error}
                        </div>
                    )}
                </div>

                {/* 모달 푸터 */}
                <div
                    style={{
                        padding: '14px 20px',
                        borderTop: '1px solid #e5e7eb',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '8px',
                        flexShrink: 0,
                    }}
                >
                    <button
                        onClick={onClose}
                        disabled={saving}
                        style={{
                            padding: '7px 16px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            background: '#ffffff',
                            color: '#374151',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: saving ? 'not-allowed' : 'pointer',
                            opacity: saving ? 0.5 : 1,
                        }}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        style={{
                            padding: '7px 16px',
                            border: 'none',
                            borderRadius: '8px',
                            background: saving ? '#93c5fd' : '#0046A4',
                            color: '#ffffff',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: saving ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {saving ? '저장 중...' : '저장'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/** 기본 블록 카드 (2열 그리드용) */
function BasicBlockCard({
    block,
    onDragStart,
    onDragEnd,
    onInsert,
}: {
    block: BasicBlock;
    onDragStart: (e: React.DragEvent, block: BasicBlock) => void;
    onDragEnd: () => void;
    onInsert: (html: string) => void;
}) {
    const [hovered, setHovered] = useState(false);
    const thumbSrc = nextApi(BASIC_THUMB_BASE + block.thumbnail);

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, block)}
            onDragEnd={onDragEnd}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            title="드래그하거나 클릭하여 추가"
            style={{
                background: '#ffffff',
                border: `1px solid ${hovered ? '#0046A4' : '#e5e7eb'}`,
                borderRadius: '6px',
                cursor: 'grab',
                overflow: 'hidden',
                boxShadow: hovered ? '0 2px 6px rgba(0,70,164,0.12)' : '0 1px 2px rgba(0,0,0,0.05)',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                userSelect: 'none',
                position: 'relative',
            }}
        >
            {/* 썸네일 */}
            <div
                style={{
                    height: '64px',
                    background: '#f3f4f6',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={thumbSrc}
                    alt=""
                    draggable={false}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
                />
                {hovered && (
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,70,164,0.06)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    />
                )}
            </div>

            {/* 블록 이름 */}
            <div
                style={{
                    padding: '3px 6px',
                    fontSize: '10px',
                    color: '#6b7280',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1.3,
                }}
            >
                {block.label ?? BLOCK_LABELS[block.thumbnail] ?? block.thumbnail}
            </div>

            {/* 추가 버튼 */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onInsert(block.html);
                }}
                title="클릭하여 캔버스 끝에 추가"
                style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '20px',
                    height: '20px',
                    border: '1px solid #0046A4',
                    borderRadius: '50%',
                    background: hovered ? '#0046A4' : '#ffffff',
                    color: hovered ? '#ffffff' : '#0046A4',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    opacity: hovered ? 1 : 0,
                    transition: 'opacity 0.15s, background 0.15s',
                }}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width={10}
                    height={10}
                >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>
        </div>
    );
}

/** 드래그 핸들 점 아이콘 */
function DragDots() {
    return (
        <svg viewBox="0 0 10 18" width={10} height={18} fill="currentColor">
            <circle cx="3" cy="3" r="1.5" />
            <circle cx="7" cy="3" r="1.5" />
            <circle cx="3" cy="9" r="1.5" />
            <circle cx="7" cy="9" r="1.5" />
            <circle cx="3" cy="15" r="1.5" />
            <circle cx="7" cy="15" r="1.5" />
        </svg>
    );
}
