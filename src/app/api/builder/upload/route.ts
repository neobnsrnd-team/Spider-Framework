import crypto from 'crypto';
import { mkdir, unlink, writeFile } from 'fs/promises';
import { dirname, join } from 'path';

import { NextRequest } from 'next/server';

import { createAsset } from '@/db/repository/asset.repository';
import { contentBuilderErrorResponse, getErrorMessage, successResponse } from '@/lib/api-response';
import { normalizeCmsAssetCategory } from '@/lib/codes';
import { canAccessCmsEdit, getCurrentUser } from '@/lib/current-user';
import { ASSET_BASE_URL, ASSET_UPLOAD_DIR, SERVER_MODE } from '@/lib/env';

export async function POST(req: NextRequest) {
    if (SERVER_MODE === 'operation') {
        return contentBuilderErrorResponse('이미지 업로드는 관리자 서버에서만 가능합니다.');
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
        return contentBuilderErrorResponse('File is required.');
    }

    const bodyUserId = formData.get('userId')?.toString() || null;
    const bodyUserName = formData.get('userName')?.toString() || null;
    const businessCategoryInput = formData.get('businessCategory')?.toString() || null;
    const assetDesc = formData.get('assetDesc')?.toString() || null;

    try {
        const currentUser = await getCurrentUser();
        if (!canAccessCmsEdit(currentUser)) {
            return contentBuilderErrorResponse('Permission denied.');
        }

        const userId = bodyUserId ?? currentUser.userId;
        const userName = bodyUserId ? (bodyUserName ?? userId) : currentUser.userName;
        const businessCategory = await normalizeCmsAssetCategory(businessCategoryInput);

        const buffer = Buffer.from(await file.arrayBuffer());
        const assetId = crypto.randomUUID();
        const assetName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

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
                assetDesc: assetDesc ?? undefined,
                createUserId: userId,
                createUserName: userName,
            });
        } catch (dbErr: unknown) {
            await unlink(filepath).catch(() => {});
            throw dbErr;
        }

        return successResponse({ url: assetUrl, assetId }, 201);
    } catch (err: unknown) {
        if (err instanceof Error && err.message === '유효하지 않은 이미지 카테고리입니다.') {
            return contentBuilderErrorResponse(err.message);
        }
        console.error('File upload failed:', err);
        return contentBuilderErrorResponse(getErrorMessage(err));
    }
}
