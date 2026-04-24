// src/components/dashboard/RejectedReasonModal.tsx
'use client';

import Modal from '@/components/ui/Modal';

import type { DashboardPageCard } from './DashboardClient';

// 뷰 모드 한국어 라벨
const VIEW_MODE_LABEL: Record<string, string> = {
    mobile: '모바일',
    web: '웹',
    responsive: '반응형',
};

// 뷰 모드 아이콘
const VIEW_MODE_ICON: Record<string, string> = {
    mobile: '📱',
    web: '🖥️',
    responsive: '🔄',
};

interface RejectedReasonModalProps {
    page: DashboardPageCard;
    onClose: () => void;
}

export default function RejectedReasonModal({ page, onClose }: RejectedReasonModalProps) {
    return (
        <Modal title="반려 사유" onClose={onClose} width="440px">
            {/* 썸네일 + 페이지 정보 */}
            <div className="px-7 pb-5">
                <div
                    className="w-full h-[140px] rounded-xl border border-[#f3f4f6] flex items-center justify-center mb-4 shrink-0"
                    style={{
                        background: page.thumbnail ? `url(${page.thumbnail}) center/cover no-repeat` : '#f0f4ff',
                    }}
                >
                    {!page.thumbnail && <span className="text-[40px] opacity-40">{VIEW_MODE_ICON[page.viewMode]}</span>}
                </div>

                <p className="m-0 text-sm font-semibold text-[#111827] truncate mb-1" title={page.label}>
                    {page.label}
                </p>
                <p className="m-0 text-xs text-[#9ca3af]">{VIEW_MODE_LABEL[page.viewMode]}</p>
            </div>

            {/* 반려 사유 */}
            <div className="px-7 pb-6">
                <p className="text-[13px] font-semibold text-[#374151] mb-1.5">반려 사유</p>
                <div className="w-full box-border px-[14px] py-3 rounded-lg border border-[#fca5a5] bg-[#fef2f2] text-sm text-[#dc2626] whitespace-pre-wrap min-h-[72px]">
                    {page.rejectedReason ?? '반려 사유가 기록되지 않았습니다.'}
                </div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end px-7 pb-6">
                <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-lg border-0 bg-[#0046A4] text-white text-sm font-semibold cursor-pointer"
                >
                    확인
                </button>
            </div>
        </Modal>
    );
}
