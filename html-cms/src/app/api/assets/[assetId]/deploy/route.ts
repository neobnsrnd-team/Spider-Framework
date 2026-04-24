// src/app/api/assets/[assetId]/deploy/route.ts
// 승인된 에셋의 파일을 uploads → deployed/<DEPLOYED_IMG_SUBDIR> 로 이동 + DB 경로 업데이트
//
// 흐름:
//   1. 에셋 조회 (없으면 404)
//   2. ASSET_STATE === 'APPROVED' 검증 (아니면 400)
//   3. 원본 파일 존재 확인 (없으면 404)
//   4. DEPLOYED_UPLOAD_DIR/<DEPLOYED_IMG_SUBDIR>/ 로 복사 (mkdir recursive)
//   5. 원본 삭제 (실패해도 복사는 성공)
//   6. DB ASSET_PATH, ASSET_URL 업데이트

import { timingSafeEqual } from 'crypto';
import { access, copyFile, mkdir, unlink } from 'fs/promises';
import { basename, join } from 'path';

import { NextRequest } from 'next/server';

import { getAssetById, updateAssetPathUrl } from '@/db/repository/asset.repository';
import { successResponse, errorResponse, getErrorMessage } from '@/lib/api-response';
import { DEPLOY_SECRET, DEPLOYED_UPLOAD_DIR, DEPLOYED_BASE_URL, DEPLOYED_IMG_SUBDIR } from '@/lib/env';

/** 타이밍 공격 방지 토큰 비교 */
function isValidToken(token: string | null): boolean {
    if (!DEPLOY_SECRET || !token) return false;
    try {
        const expected = Buffer.from(DEPLOY_SECRET, 'utf8');
        const received = Buffer.from(token, 'utf8');
        if (expected.length !== received.length) return false;
        return timingSafeEqual(expected, received);
    } catch {
        return false;
    }
}

/** POST /api/assets/:assetId/deploy — 승인된 이미지 파일 이동 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ assetId: string }> }) {
    try {
        const { assetId } = await params;

        // 서버간 호출 — x-deploy-token 헤더로 인증 (Spider Admin → CMS)
        if (!isValidToken(req.headers.get('x-deploy-token'))) {
            return errorResponse('인증 토큰이 유효하지 않습니다.', 401);
        }

        const asset = await getAssetById(assetId);
        if (!asset) {
            return errorResponse('에셋을 찾을 수 없습니다.', 404);
        }

        if (asset.ASSET_STATE !== 'APPROVED') {
            return errorResponse(`승인되지 않은 에셋입니다. (현재 상태: ${asset.ASSET_STATE})`, 400);
        }

        if (!asset.ASSET_PATH) {
            return errorResponse('에셋 경로 정보가 없습니다.', 500);
        }

        // 원본 파일 존재 확인
        try {
            await access(asset.ASSET_PATH);
        } catch {
            return errorResponse('원본 파일을 찾을 수 없습니다.', 404);
        }

        // 대상 경로 계산
        const filename = basename(asset.ASSET_PATH);
        const deployedImgDir = join(DEPLOYED_UPLOAD_DIR, DEPLOYED_IMG_SUBDIR);
        const deployedPath = join(deployedImgDir, filename);
        const deployedUrl = `${DEPLOYED_BASE_URL}/${filename}`;

        // 멱등성 — 이미 배포된 경로면 조기 반환 (중복 호출 시 unlink 로 배포 파일 삭제되는 사고 방지)
        if (asset.ASSET_PATH === deployedPath) {
            return successResponse({ url: deployedUrl });
        }

        // 대상 디렉토리 생성 + 파일 복사
        await mkdir(deployedImgDir, { recursive: true });
        await copyFile(asset.ASSET_PATH, deployedPath);

        // DB 경로·URL 업데이트 (복사 성공 후) — 서버간 호출이므로 수정자는 시스템으로 기록
        await updateAssetPathUrl(assetId, deployedPath, deployedUrl, 'system', 'Spider Admin');

        // 원본 파일 삭제 (실패해도 복사는 성공이므로 경고만)
        await unlink(asset.ASSET_PATH).catch((err) => {
            console.warn(`원본 파일 삭제 실패 (${asset.ASSET_PATH}):`, err);
        });

        return successResponse({ url: deployedUrl });
    } catch (err: unknown) {
        console.error('에셋 배포 실패:', err);
        return errorResponse(getErrorMessage(err));
    }
}
