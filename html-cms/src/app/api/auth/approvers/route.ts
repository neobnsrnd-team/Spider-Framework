import { errorResponse, successResponse } from '@/lib/api-response';
import { fetchJavaAdminApi } from '@/lib/java-admin-api';

interface CmsApprover {
    userId: string;
    userName: string;
}

const APPROVERS_API_PATH = process.env.JAVA_ADMIN_CMS_APPROVERS_PATH ?? '/api/auth/cms-approvers';

export async function GET() {
    try {
        const approvers = await fetchJavaAdminApi<CmsApprover[]>(APPROVERS_API_PATH);
        return successResponse({ approvers });
    } catch (error) {
        return errorResponse(error instanceof Error ? error.message : 'Failed to load approvers.', 502);
    }
}
