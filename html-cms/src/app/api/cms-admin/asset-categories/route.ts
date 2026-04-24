// GET /api/cms-admin/asset-categories
// 공유 FWK_CODE(CODE_GROUP_ID='CMS00001')에서 이미지 업무 카테고리 코드를 조회.
// spider-admin /cms-admin/asset-approvals 화면과 동일한 허용 코드(COMMON/CARD/LOAN/DEPOSIT)만 반환.

import { errorResponse, getErrorMessage, successResponse } from '@/lib/api-response';
import { CMS_ASSET_CATEGORY_GROUP_ID, CMS_ASSET_CATEGORY_LABELS } from '@/lib/cms-asset-category';
import { getCodesByGroup } from '@/lib/codes';

const ALLOWED_CATEGORY_CODES = new Set(Object.keys(CMS_ASSET_CATEGORY_LABELS));

export async function GET() {
    try {
        const codes = await getCodesByGroup(CMS_ASSET_CATEGORY_GROUP_ID);
        const categories = codes.filter((code) => ALLOWED_CATEGORY_CODES.has(code.code));
        return successResponse({ categories });
    } catch (err) {
        return errorResponse(getErrorMessage(err), 500);
    }
}
