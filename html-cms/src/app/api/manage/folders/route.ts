// src/app/api/manage/folders/route.ts
// 승인된 이미지 폴더 트리 조회 — DEPLOYED_UPLOAD_DIR/<IMG_SUBDIR> 기준 (읽기 전용)

import { readdir } from 'fs/promises';
import path from 'path';

import { DEPLOYED_UPLOAD_DIR, DEPLOYED_IMG_SUBDIR } from '@/lib/env';
import { successResponse, errorResponse, getErrorMessage } from '@/lib/api-response';
import { canReadCms, getCurrentUser } from '@/lib/current-user';

interface FolderNode {
    name: string;
    path: string;
    children?: FolderNode[];
    isExpanded?: boolean;
}

/** 이미지 루트 하위 디렉토리 재귀 탐색 (비동기 병렬) */
async function buildFolderTree(dirPath: string, relativePath: string = ''): Promise<FolderNode[]> {
    let dirents;
    try {
        dirents = await readdir(dirPath, { withFileTypes: true });
    } catch {
        return []; // 디렉토리 없으면 빈 배열
    }

    const folders = await Promise.all(
        dirents
            .filter((d) => d.isDirectory())
            .map(async (d) => {
                const itemRelativePath = relativePath ? `${relativePath}/${d.name}` : d.name;
                const children = await buildFolderTree(path.join(dirPath, d.name), itemRelativePath);
                return {
                    name: d.name,
                    path: itemRelativePath,
                    children: children.length > 0 ? children : undefined,
                    isExpanded: false,
                } satisfies FolderNode;
            }),
    );

    return folders.sort((a, b) => a.name.localeCompare(b.name));
}

/** 절대 경로 해석 */
function resolveDeployedRoot(): string {
    return path.isAbsolute(DEPLOYED_UPLOAD_DIR) ? DEPLOYED_UPLOAD_DIR : path.join(process.cwd(), DEPLOYED_UPLOAD_DIR);
}

/** GET /api/manage/folders — 승인 이미지 폴더 트리 (루트 고정: <DEPLOYED_IMG_SUBDIR>) */
export async function GET() {
    try {
        const currentUser = await getCurrentUser();
        if (!canReadCms(currentUser)) {
            return errorResponse('Permission denied.', 403);
        }

        const imgRoot = path.join(resolveDeployedRoot(), DEPLOYED_IMG_SUBDIR);

        // 루트 이름·경로 모두 env (DEPLOYED_IMG_SUBDIR) 에서 가져옴
        // 하위 디렉토리는 실제 파일시스템 구조 그대로 반영
        const children = await buildFolderTree(imgRoot);

        const root: FolderNode = {
            name: DEPLOYED_IMG_SUBDIR,
            path: '', // 빈 경로 = 이미지 루트 자체 (files route에서 path 파라미터로 공백 전달)
            children: children.length > 0 ? children : undefined,
            isExpanded: true,
        };

        return successResponse({ folders: [root] });
    } catch (err: unknown) {
        console.error('폴더 트리 조회 실패:', err);
        return errorResponse(getErrorMessage(err));
    }
}
