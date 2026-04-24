// src/app/page.tsx

import { redirect } from 'next/navigation';

import { canReadCms, getCurrentUser, getDefaultCmsPath } from '@/lib/current-user';

export const dynamic = 'force-dynamic';

export default async function Home() {
    const currentUser = await getCurrentUser();

    if (!canReadCms(currentUser)) {
        redirect('/not-authorized');
    }

    redirect(getDefaultCmsPath(currentUser));
}
