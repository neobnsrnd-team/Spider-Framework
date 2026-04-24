// src/app/edit/page.tsx

import { Suspense } from 'react';

import EditClientLoader from '@/components/edit/EditClientLoader';
import { getPageById } from '@/db/repository/page.repository';
import { canAccessCmsEdit, canManageCmsPage, getCurrentUser } from '@/lib/current-user';
import { BANK_BRAND } from '@/lib/env';
import { BRAND_THEMES, type BrandTheme } from '@/data/brand-themes';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Edit({ searchParams }: { searchParams: Promise<{ bank?: string }> }) {
    const params = await searchParams;
    const bank = params.bank || 'ibk';
    const currentUser = await getCurrentUser();
    if (!canAccessCmsEdit(currentUser)) {
        redirect('/not-authorized');
    }

    const page = await getPageById(bank);
    if (page && !canManageCmsPage(currentUser, page.CREATE_USER_ID)) {
        redirect('/not-authorized');
    }

    // BANK_BRAND 미설정 시 null → EditClient에서 색상 치환 건너뜀
    const brandTheme: BrandTheme | null = BRAND_THEMES[BANK_BRAND.toUpperCase()] ?? null;

    return (
        <Suspense>
            <EditClientLoader
                key={bank}
                bank={bank}
                userId={currentUser.userId}
                brandTheme={brandTheme}
                canWrite={canManageCmsPage(currentUser, page?.CREATE_USER_ID)}
            />
        </Suspense>
    );
}
