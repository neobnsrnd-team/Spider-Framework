import { deprecatedCmsAdminApiResponse } from '@/lib/cms-admin-boundary';

export function GET() {
    return deprecatedCmsAdminApiResponse('/api/cms-admin/pages/{pageId}/approval-history');
}
