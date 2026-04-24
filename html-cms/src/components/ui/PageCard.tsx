// src/components/ui/PageCard.tsx
'use client';

import type { ReactNode } from 'react';

// ── 공유 타입 ──
export type ViewMode = 'mobile' | 'web' | 'responsive';
export type ApproveStateValue = 'WORK' | 'PENDING' | 'APPROVED' | 'REJECTED';

// ── 공유 스타일 상수 ──
export const VIEW_MODE_STYLE: Record<ViewMode, { bg: string; color: string; label: string }> = {
    mobile: { bg: '#e8f0fd', color: '#0046A4', label: '모바일' },
    web: { bg: '#e6f4ef', color: '#008C6A', label: '웹' },
    responsive: { bg: '#f0eaf9', color: '#6d28d9', label: '반응형' },
};

export const APPROVE_STYLE: Record<ApproveStateValue, { bg: string; color: string }> = {
    WORK: { bg: '#f3f4f6', color: '#6b7280' },
    PENDING: { bg: '#fefce8', color: '#b45309' },
    APPROVED: { bg: '#e6f4ef', color: '#008C6A' },
    REJECTED: { bg: '#fef2f2', color: '#dc2626' },
};

// DB 조회 실패 또는 미전달 시 사용하는 기본 레이블
export const APPROVE_DEFAULT_LABELS: Record<ApproveStateValue, string> = {
    WORK: '작업중',
    PENDING: '승인대기',
    APPROVED: '승인',
    REJECTED: '반려',
};

// ── 공유 유틸 ──
export function formatDate(isoStr: string | null): string {
    if (!isoStr) return '—';
    const d = new Date(isoStr);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
}

// ── 뷰 모드 이모지 ──
const VIEW_MODE_EMOJI: Record<ViewMode, string> = {
    mobile: '📱',
    web: '🖥️',
    responsive: '🔄',
};

// ── Props ──
export interface PageCardPage {
    id: string;
    label: string;
    viewMode: ViewMode;
    thumbnail: string | null;
    lastModifiedDtime: string | null;
    approveState: ApproveStateValue;
    isExpired?: boolean;
    isPublic?: string;
}

export interface PageCardProps {
    page: PageCardPage;
    onClick: () => void;
    /** 썸네일 호버 오버레이 (미전달 시 오버레이 없음) */
    overlay?: {
        label: string;
        color: string;
    };
    /** 작성자/날짜 영역 대체 (미전달 시 날짜만 표시) */
    authorSlot?: ReactNode;
    /** 카드 하단 버튼 영역 (미전달 시 푸터 없음) */
    footerSlot?: ReactNode;
    /** 승인 상태 레이블 (FWK_CODE 동적 조회값, 미전달 시 APPROVE_DEFAULT_LABELS 사용) */
    approveLabels?: Partial<Record<ApproveStateValue, string>>;
}

export default function PageCard({ page, onClick, overlay, authorSlot, footerSlot, approveLabels }: PageCardProps) {
    const vmStyle = VIEW_MODE_STYLE[page.viewMode];
    const apStyle = APPROVE_STYLE[page.approveState];
    const apLabel = approveLabels?.[page.approveState] ?? APPROVE_DEFAULT_LABELS[page.approveState];

    return (
        <div
            className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-150 cursor-pointer flex flex-col hover:shadow-[0_8px_24px_rgba(0,70,164,0.12)] hover:-translate-y-0.5"
            onClick={onClick}
        >
            {/* 썸네일 영역 */}
            <div
                className="relative h-[140px] flex items-center justify-center shrink-0 border-b border-[#f3f4f6] group/thumb overflow-hidden"
                style={{
                    background: page.thumbnail ? `url(${page.thumbnail}) center/cover no-repeat` : '#f0f4ff',
                }}
            >
                {!page.thumbnail && <span className="text-[36px] opacity-40">{VIEW_MODE_EMOJI[page.viewMode]}</span>}
                {overlay && (
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-150"
                        style={{ background: overlay.color }}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white">
                            <path
                                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        <span className="text-white text-[12px] font-semibold">{overlay.label}</span>
                    </div>
                )}
            </div>

            {/* 카드 본문 */}
            <div className="px-4 pt-3.5 pb-3 flex-1 flex flex-col gap-2">
                <p className="m-0 text-sm font-semibold text-[#111827] truncate" title={page.label}>
                    {page.label}
                </p>

                {/* 뱃지 행 */}
                <div className="flex gap-1.5 flex-wrap">
                    <span
                        className="px-2 py-0.5 rounded-[10px] text-[11px] font-semibold"
                        style={{ background: vmStyle.bg, color: vmStyle.color }}
                    >
                        {vmStyle.label}
                    </span>
                    <span
                        className="px-2 py-0.5 rounded-[10px] text-[11px] font-semibold"
                        style={{
                            background: page.isExpired ? '#fef2f2' : page.isPublic === 'N' ? '#f3f4f6' : apStyle.bg,
                            color: page.isExpired ? '#dc2626' : page.isPublic === 'N' ? '#6b7280' : apStyle.color,
                        }}
                    >
                        {page.isExpired ? '만료' : page.isPublic === 'N' ? '비공개' : apLabel}
                    </span>
                </div>

                {/* 작성자/날짜 행 */}
                {authorSlot ?? <p className="m-0 text-[11px] text-[#9ca3af]">{formatDate(page.lastModifiedDtime)}</p>}
            </div>

            {/* 카드 푸터 */}
            {footerSlot}
        </div>
    );
}
