// src/app/[userId]/page.tsx
// /dashboard로 redirect — userId URL 노출 제거 (#406)

import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function UserPageRedirect() {
    redirect('/dashboard');
}
