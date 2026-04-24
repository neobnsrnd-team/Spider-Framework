import { deprecatedCmsAdminApiResponse } from '@/lib/cms-admin-boundary';

export function POST() {
    return deprecatedCmsAdminApiResponse('/api/cms-admin/ab-tests/{groupId}/promote');
}
