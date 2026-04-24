// src/app/api/assets/route.ts
// 에셋 목록 조회 및 등록 API

import crypto from 'crypto';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { dirname, join } from 'path';

import { NextRequest } from 'next/server';

import { getAssetList, createAsset } from '@/db/repository/asset.repository';
import type { AssetState } from '@/db/types';
import { normalizeCmsAssetCategory } from '@/lib/codes';
import { canWriteCms, getCurrentUser } from '@/lib/current-user';
import { successResponse, errorResponse, getErrorMessage } from '@/lib/api-response';
import { ASSET_UPLOAD_DIR, ASSET_BASE_URL } from '@/lib/env';

// cms-admin 의 숨김 처리(USE_YN='N')가 즉시 /cms/files 에 반영되도록 프레임워크 캐시를 끈다.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const ASSET_STATES: AssetState[] = ['WORK', 'PENDING', 'APPROVED', 'REJECTED'];

function parseAssetState(value: string | null): AssetState | undefined {
    if (!value) {
        return undefined;
    }

    if (!ASSET_STATES.includes(value as AssetState)) {
        throw new Error('유효하지 않은 에셋 상태입니다.');
    }

    return value as AssetState;
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;

        const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
        const pageSize = Math.min(200, Math.max(1, parseInt(searchParams.get('pageSize') ?? '10', 10) || 10));
        const category = searchParams.get('category') || undefined;
        const search = searchParams.get('search') || undefined;
        const assetState = parseAssetState(searchParams.get('assetState'));

        const { list, totalCount } = await getAssetList({
            businessCategory: category,
            assetState,
            search,
            page,
            pageSize,
        });

        const assets = list.map((a) => ({
            assetId: a.ASSET_ID,
            assetName: a.ASSET_NAME,
            businessCategory: a.BUSINESS_CATEGORY,
            mimeType: a.MIME_TYPE,
            fileSize: a.FILE_SIZE,
            assetDesc: a.ASSET_DESC,
            assetState: a.ASSET_STATE,
            createUserId: a.CREATE_USER_ID,
            createUserName: a.CREATE_USER_NAME,
            createDate: a.CREATE_DATE ? new Date(a.CREATE_DATE).toISOString() : null,
            url: a.ASSET_URL,
            // 물리 파일 경로 — 사이드바 "폴더" 라벨(예: 'img')을 파생하는 데 사용.
            path: a.ASSET_PATH,
            // cms-admin 의 숨김(Y/N) 상태 — 클라이언트에서 이중 필터로 방어하기 위해 노출
            useYn: a.USE_YN,
        }));

        return successResponse({ assets, totalCount });
    } catch (err) {
        if (
            err instanceof Error &&
            (err.message === '유효하지 않은 에셋 상태입니다.' || err.message === '유효하지 않은 이미지 카테고리입니다.')
        ) {
            return errorResponse(err.message, 400);
        }

        console.error('에셋 목록 조회 실패:', err);
        return errorResponse(getErrorMessage(err));
    }
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return errorResponse('파일이 없습니다.', 400);
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const currentUser = await getCurrentUser();
        if (!canWriteCms(currentUser)) {
            return errorResponse('Permission denied.', 403);
        }
        const { userId, userName } = currentUser;

        const assetId = crypto.randomUUID();
        const assetName = ((formData.get('assetName') as string) || file.name).replace(/[^a-zA-Z0-9._-]/g, '_');
        const businessCategory = await normalizeCmsAssetCategory((formData.get('businessCategory') as string) || null);
        const assetDesc = (formData.get('assetDesc') as string) || undefined;

        const filename = `${assetId}_${assetName}`;
        const filepath = join(ASSET_UPLOAD_DIR, filename);
        await mkdir(dirname(filepath), { recursive: true });
        await writeFile(filepath, buffer);
        const assetUrl = `${ASSET_BASE_URL}/${filename}`;

        try {
            await createAsset({
                assetId,
                assetName,
                businessCategory,
                mimeType: file.type || 'application/octet-stream',
                fileSize: buffer.length,
                assetPath: filepath,
                assetUrl,
                assetDesc,
                createUserId: userId,
                createUserName: userName,
            });
        } catch (dbErr: unknown) {
            await unlink(filepath).catch(() => {});
            throw dbErr;
        }

        return successResponse({ assetId, url: assetUrl });
    } catch (err: unknown) {
        if (err instanceof Error && err.message === '유효하지 않은 이미지 카테고리입니다.') {
            return errorResponse(err.message, 400);
        }
        console.error('에셋 등록 실패:', err);
        return errorResponse(getErrorMessage(err));
    }
}
