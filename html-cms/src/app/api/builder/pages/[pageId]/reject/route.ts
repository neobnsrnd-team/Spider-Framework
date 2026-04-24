import { deprecatedCmsAdminApiResponse } from '@/lib/cms-admin-boundary';

export function PATCH() {
    return deprecatedCmsAdminApiResponse('/api/cms-admin/pages/{pageId}/approval/reject');
}
