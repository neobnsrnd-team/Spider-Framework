import { redirect } from 'next/navigation';

import { adminPath } from '@/lib/cms-admin-boundary';

export const dynamic = 'force-dynamic';

export default function ApprovePage() {
    redirect(adminPath('/cms-admin/approvals'));
}
