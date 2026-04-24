// src/app/api/manage/files/route.ts
// 승인된 이미지 목록 조회 — DEPLOYED_UPLOAD_DIR/<IMG_SUBDIR> 기준 (읽기 전용, 페이지네이션)

import { readdir, stat } from 'fs/promises';
import path from 'path';

import { NextRequest } from 'next/server';

import { DEPLOYED_UPLOAD_DIR, DEPLOYED_BASE_URL, DEPLOYED_IMG_SUBDIR } from '@/lib/env';
import { successResponse, errorResponse, getErrorMessage } from '@/lib/api-response';
import { canReadCms, getCurrentUser } from '@/lib/current-user';

const PAGE_SIZE = 24;

/** 절대 경로 해석 */
function resolveDeployedRoot(): string {
    return path.isAbsolute(DEPLOYED_UPLOAD_DIR) ? DEPLOYED_UPLOAD_DIR : path.join(process.cwd(), DEPLOYED_UPLOAD_DIR);
}

/** URL prefix 정규화 — 끝 슬래시 보장 */
function normalizeBaseUrl(): string {
    return DEPLOYED_BASE_URL.endsWith('/') ? DEPLOYED_BASE_URL : `${DEPLOYED_BASE_URL}/`;
}

/**
 * GET /api/manage/files?page=N&path=<상대경로>
 * - path는 이미지 루트 기준 상대 경로 (빈 문자열 = 이미지 루트 자체)
 * - 이미지 루트 범위 이탈 차단 (path.sep 기준 엄격 비교)
 * - 디렉토리가 아닌 경로 입력 시 400
 */
export async function GET(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        if (!canReadCms(currentUser)) {
            return errorResponse('Permission denied.', 403);
        }

        const { searchParams } = new URL(request.url);
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
        const relativePath = searchParams.get('path') || '';

        // 보안: 디렉토리 트래버설 방지
        if (relativePath.includes('..')) {
            return errorResponse('유효하지 않은 경로입니다.', 400);
        }

        // 이미지 루트를 베이스로 고정 (env.DEPLOYED_IMG_SUBDIR)
        const imgRoot = path.join(resolveDeployedRoot(), DEPLOYED_IMG_SUBDIR);
        const absolutePath = path.join(imgRoot, relativePath);

        // 보안: 이미지 루트 범위 이탈 방지 — path.sep 기준 엄격 비교
        // (단순 startsWith 로는 /data/img 가 /data/img_secret 를 허용하는 취약점이 있음)
        if (absolutePath !== imgRoot && !absolutePath.startsWith(imgRoot + path.sep)) {
            return errorResponse('유효하지 않은 경로입니다.', 400);
        }

        // 존재·디렉토리 여부 확인 (stat 실패 시 404/400 분기)
        let isDir = false;
        try {
            const st = await stat(absolutePath);
            isDir = st.isDirectory();
        } catch {
            // ENOENT — 아직 이미지 폴더가 없는 경우(승인 이미지 0건) 루트면 빈 목록 반환
            if (absolutePath === imgRoot) {
                return successResponse({
                    files: [],
                    hasMore: false,
                    nextPage: null,
                    currentPath: relativePath,
                });
            }
            return errorResponse('디렉토리를 찾을 수 없습니다.', 404);
        }

        if (!isDir) {
            return errorResponse('경로가 디렉토리가 아닙니다.', 400);
        }

        const baseUrl = normalizeBaseUrl();

        // 비동기 병렬 처리 — withFileTypes 로 stat 호출 최소화
        const dirents = await readdir(absolutePath, { withFileTypes: true });

        const allFiles = await Promise.all(
            dirents.map(async (dirent) => {
                const filePath = path.join(absolutePath, dirent.name);
                const fileRelPath = relativePath ? `${relativePath}/${dirent.name}` : dirent.name;
                // 크기·수정시간은 stat 로만 얻을 수 있어 병렬 호출
                const fileStat = await stat(filePath);

                return {
                    name: dirent.name,
                    size: fileStat.size,
                    isDirectory: dirent.isDirectory(),
                    path: fileRelPath, // ← 클라이언트가 하위 폴더 이동 등에 사용하는 상대 경로
                    url: `${baseUrl}${fileRelPath}`,
                    modified: fileStat.mtime.getTime(),
                };
            }),
        );

        // 디렉토리 우선, 이후 최신순 정렬
        allFiles.sort((a, b) => {
            if (a.isDirectory && !b.isDirectory) return -1;
            if (!a.isDirectory && b.isDirectory) return 1;
            return b.modified - a.modified;
        });

        const startIndex = (page - 1) * PAGE_SIZE;
        const paginatedFiles = allFiles.slice(startIndex, startIndex + PAGE_SIZE);
        const hasMore = startIndex + PAGE_SIZE < allFiles.length;

        return successResponse({
            files: paginatedFiles,
            hasMore,
            nextPage: hasMore ? page + 1 : null,
            currentPath: relativePath,
        });
    } catch (err: unknown) {
        console.error('파일 목록 조회 실패:', err);
        return errorResponse(getErrorMessage(err));
    }
}
