import { getPageTemplateList } from '@/db/repository/page.repository';
import { canReadCms, getCurrentUser } from '@/lib/current-user';
import { errorResponse, getErrorMessage, successResponse } from '@/lib/api-response';

export async function GET() {
    try {
        const currentUser = await getCurrentUser();
        if (!canReadCms(currentUser)) {
            return errorResponse('권한이 없습니다.', 403);
        }

        const templates = await getPageTemplateList();
        return successResponse({ templates });
    } catch (err: unknown) {
        console.error('템플릿 목록 조회 실패:', err);
        return errorResponse(getErrorMessage(err));
    }
}
