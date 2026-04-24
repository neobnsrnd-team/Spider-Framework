// src/components/edit/EditClientLoader.tsx
'use client';

import dynamic from 'next/dynamic';

import type { BrandTheme } from '@/data/brand-themes';

// ssr: false — Server Component에서는 사용 불가하므로 Client Component 래퍼로 분리
// localStorage 기반 탭 목록이 서버 DEFAULT_TABS로 렌더링되어 삭제된 탭이 잠깐 노출되는 현상 방지
const EditClient = dynamic(() => import('@/components/edit/EditClient'), { ssr: false });

export default function EditClientLoader({
    bank,
    userId,
    brandTheme,
    canWrite,
}: {
    bank: string;
    userId: string;
    brandTheme?: BrandTheme | null;
    canWrite?: boolean;
}) {
    return <EditClient bank={bank} userId={userId} brandTheme={brandTheme} canWrite={canWrite} />;
}
