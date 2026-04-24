// src/app/api/assets/[assetId]/image/route.ts
// 에셋 이미지 스트리밍 API — Admin 서버 등 서버 간 호출용
// ASSET_PATH에서 파일을 직접 읽어 반환 (URL 매핑 의존 없음)

import { openAsBlob } from 'fs';
import { resolve } from 'path';

import { NextRequest } from 'next/server';

import { getAssetById } from '@/db/repository/asset.repository';
import { errorResponse, getErrorMessage } from '@/lib/api-response';
import { ASSET_UPLOAD_DIR, DEPLOYED_UPLOAD_DIR } from '@/lib/env';

/** 허용된 디렉토리 내 경로인지 검증 (Path Traversal 방지) */
function isAllowedPath(filePath: string): boolean {
    const resolved = resolve(filePath);
    const allowedDirs = [resolve(ASSET_UPLOAD_DIR), resolve(DEPLOYED_UPLOAD_DIR)];
    return allowedDirs.some((dir) => resolved.startsWith(dir + '/') || resolved === dir);
}

/** GET /api/assets/:assetId/image — 이미지 파일 스트리밍 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ assetId: string }> }) {
    try {
        const { assetId } = await params;

        const asset = await getAssetById(assetId);
        if (!asset) {
            return errorResponse('이미지를 찾을 수 없습니다.', 404);
        }

        if (!asset.ASSET_PATH) {
            return errorResponse('이미지 경로 정보가 없습니다.', 404);
        }

        // Path Traversal 방지 — 허용된 디렉토리 외 접근 차단
        if (!isAllowedPath(asset.ASSET_PATH)) {
            return errorResponse('허용되지 않은 파일 경로입니다.', 403);
        }

        let blob: Blob;
        try {
            blob = await openAsBlob(asset.ASSET_PATH, {
                type: asset.MIME_TYPE || 'application/octet-stream',
            });
        } catch {
            return errorResponse('이미지 파일을 찾을 수 없습니다.', 404);
        }

        return new Response(blob, {
            status: 200,
            headers: {
                'Content-Type': asset.MIME_TYPE || 'application/octet-stream',
                'Content-Length': blob.size.toString(),
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (err: unknown) {
        console.error('에셋 이미지 조회 실패:', err);
        return errorResponse(getErrorMessage(err));
    }
}
