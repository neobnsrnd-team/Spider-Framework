import { NextRequest } from 'next/server';

import { getPageById, requestApproval } from '@/db/repository/page.repository';
import { errorResponse, getErrorMessage, successResponse } from '@/lib/api-response';
import { canAccessCmsEdit, canManageCmsPage, getCurrentUser } from '@/lib/current-user';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ pageId: string }> }) {
    try {
        const { pageId } = await params;

        if (!pageId || pageId.includes('..')) {
            return errorResponse('Invalid page ID.', 400);
        }

        const body = await req.json();
        const { approverId, approverName, beginningDate, expiredDate } = body;

        if (!approverId || !approverName) {
            return errorResponse('Approver information is required.', 400);
        }

        if (!beginningDate) {
            return errorResponse('Beginning date is required.', 400);
        }

        if (!expiredDate) {
            return errorResponse('Expiration date is required.', 400);
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(beginningDate) || Number.isNaN(Date.parse(beginningDate))) {
            return errorResponse('Beginning date must use YYYY-MM-DD format.', 400);
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(expiredDate) || Number.isNaN(Date.parse(expiredDate))) {
            return errorResponse('Expiration date must use YYYY-MM-DD format.', 400);
        }

        if (expiredDate < beginningDate) {
            return errorResponse('Expiration date cannot be before beginning date.', 400);
        }

        const currentUser = await getCurrentUser();
        if (!canAccessCmsEdit(currentUser)) {
            return errorResponse('Permission denied.', 403);
        }

        const page = await getPageById(pageId);
        if (!page) {
            return errorResponse('Page not found.', 404);
        }
        if (!canManageCmsPage(currentUser, page.CREATE_USER_ID)) {
            return errorResponse('Permission denied.', 403);
        }

        await requestApproval(pageId, approverId, approverName, beginningDate, expiredDate);

        return successResponse({ message: 'Approval request completed.' });
    } catch (err: unknown) {
        console.error('Approval request failed:', err);
        return errorResponse(getErrorMessage(err), 500);
    }
}
