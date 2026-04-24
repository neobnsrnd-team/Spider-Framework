import { deprecatedCmsAdminApiResponse } from '@/lib/cms-admin-boundary';

export function GET() {
    return deprecatedCmsAdminApiResponse('/api/cms-admin/ab-tests/{groupId}');
}

export function POST() {
    return deprecatedCmsAdminApiResponse('/api/cms-admin/ab-tests');
}

export function DELETE() {
    return deprecatedCmsAdminApiResponse('/api/cms-admin/ab-tests');
}
