'use client';

import { useEffect, useState } from 'react';

import Modal from '@/components/ui/Modal';
import { nextApi } from '@/lib/api-url';

import type { DashboardPageCard } from './DashboardClient';

interface Approver {
    userId: string;
    userName: string;
}

const VIEW_MODE_LABEL: Record<string, string> = {
    mobile: 'Mobile',
    web: 'Web',
    responsive: 'Responsive',
};

const VIEW_MODE_ICON: Record<string, string> = {
    mobile: 'M',
    web: 'W',
    responsive: 'R',
};

interface ApprovalRequestModalProps {
    page: DashboardPageCard;
    onClose: () => void;
    onSubmit: (approverId: string, approverName: string, beginningDate: string, expiredDate: string) => Promise<void>;
}

function todayValue(): string {
    return new Date().toLocaleDateString('en-CA');
}

function maxDate(left: string, right: string): string {
    if (!left) return right;
    if (!right) return left;
    return left > right ? left : right;
}

export default function ApprovalRequestModal({ page, onClose, onSubmit }: ApprovalRequestModalProps) {
    const [approverId, setApproverId] = useState('');
    const today = todayValue();
    const defaultBeginningDate = page.beginningDate || today;
    const [beginningDate, setBeginningDate] = useState(defaultBeginningDate);
    const [expiredDate, setExpiredDate] = useState(page.expiredDate || '');
    const [submitting, setSubmitting] = useState(false);
    const [approverList, setApproverList] = useState<Approver[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        fetch(nextApi('/api/auth/approvers'))
            .then((response) => response.json())
            .then((data) => {
                if (mounted) setApproverList(data.approvers ?? []);
            })
            .catch(() => {
                if (mounted) setApproverList([]);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    const selectedApprover = approverList.find((u) => u.userId === approverId);
    const invalidDateRange = Boolean(beginningDate && expiredDate && expiredDate < beginningDate);
    const canSubmit =
        Boolean(selectedApprover) &&
        Boolean(beginningDate) &&
        Boolean(expiredDate) &&
        !invalidDateRange &&
        !submitting &&
        !loading;
    const beginningMin = page.beginningDate && page.beginningDate < today ? page.beginningDate : today;
    const expiredMin = maxDate(beginningDate, beginningMin);

    async function handleSubmit() {
        if (!selectedApprover || !canSubmit) return;
        setSubmitting(true);
        try {
            await onSubmit(selectedApprover.userId, selectedApprover.userName, beginningDate, expiredDate);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Modal title="승인 요청" onClose={onClose} width="440px">
            <div className="px-7 pb-5">
                <div
                    className="w-full h-[140px] rounded-xl border border-[#f3f4f6] flex items-center justify-center mb-4 shrink-0"
                    style={{
                        background: page.thumbnail ? `url(${page.thumbnail}) center/cover no-repeat` : '#f0f4ff',
                    }}
                >
                    {!page.thumbnail && (
                        <span className="text-[40px] opacity-40">{VIEW_MODE_ICON[page.viewMode] ?? 'R'}</span>
                    )}
                </div>

                <p className="m-0 text-sm font-semibold text-[#111827] truncate mb-1" title={page.label}>
                    {page.label}
                </p>
                <p className="m-0 text-xs text-[#9ca3af]">{VIEW_MODE_LABEL[page.viewMode] ?? page.viewMode}</p>
            </div>

            <div className="px-7 pb-6">
                <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">
                    승인 요청 대상 <span className="text-[#dc2626]">*</span>
                </label>
                <select
                    value={approverId}
                    onChange={(e) => setApproverId(e.target.value)}
                    disabled={loading}
                    className="w-full box-border px-[14px] py-2.5 rounded-lg border border-[#d1d5db] text-sm outline-none bg-white text-[#111827]"
                >
                    <option value="">{loading ? '불러오는 중...' : '승인 요청할 관리자를 선택하세요'}</option>
                    {approverList.map((u) => (
                        <option key={u.userId} value={u.userId}>
                            {u.userName}
                        </option>
                    ))}
                </select>
                {!loading && approverList.length === 0 && (
                    <p className="mt-2 text-xs text-[#dc2626]">승인 요청 대상 목록을 불러올 수 없습니다.</p>
                )}
            </div>

            <div className="px-7 pb-4">
                <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">
                    노출 시작일 <span className="text-[#dc2626]">*</span>
                </label>
                <input
                    type="date"
                    value={beginningDate}
                    min={beginningMin}
                    onChange={(e) => {
                        const nextBeginningDate = e.target.value;
                        setBeginningDate(nextBeginningDate);
                        if (expiredDate && expiredDate < nextBeginningDate) {
                            setExpiredDate(nextBeginningDate);
                        }
                    }}
                    className="w-full box-border px-[14px] py-2.5 rounded-lg border border-[#d1d5db] text-sm outline-none bg-white text-[#111827]"
                />
            </div>

            <div className="px-7 pb-6">
                <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">
                    노출 종료일 <span className="text-[#dc2626]">*</span>
                </label>
                <input
                    type="date"
                    value={expiredDate}
                    min={expiredMin}
                    onChange={(e) => setExpiredDate(e.target.value)}
                    className="w-full box-border px-[14px] py-2.5 rounded-lg border border-[#d1d5db] text-sm outline-none bg-white text-[#111827]"
                />
                {invalidDateRange && (
                    <p className="mt-2 text-xs text-[#dc2626]">노출 종료일은 시작일보다 빠를 수 없습니다.</p>
                )}
            </div>

            {/* 버튼 */}
            <div className="flex justify-end gap-2 px-7 pb-6">
                <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-lg border border-[#e5e7eb] bg-white text-[#374151] text-sm cursor-pointer"
                >
                    취소
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className={`px-5 py-2.5 rounded-lg border-0 text-white text-sm font-semibold ${
                        !canSubmit ? 'bg-[#d1d5db] cursor-not-allowed' : 'bg-[#0046A4] cursor-pointer'
                    }`}
                >
                    {submitting ? '요청 중...' : '승인 요청'}
                </button>
            </div>
        </Modal>
    );
}
