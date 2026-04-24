// ============================================================================
// 기본 블록 시드 — content-plugins*.js → SPW_CMS_COMPONENT
// ============================================================================

import fs from 'fs/promises';
import path from 'path';
import vm from 'vm';
import { createComponent, getComponentById } from '@/db/repository/component.repository';
import type { ComponentType, ViewMode } from '@/db/types';

interface BasicSnippet {
    thumbnail: string;
    category: string;
    viewMode: string;
    html: string;
    type?: string;
}

// 파싱 대상 파일 목록
const PLUGIN_FILES: Array<{ file: string; varName: string; viewMode: ViewMode }> = [
    { file: 'content-plugins.js', varName: 'data_basic', viewMode: 'web' },
    { file: 'content-plugins-mobile.js', varName: 'data_basic_mobile', viewMode: 'mobile' },
    { file: 'content-plugins-responsive.js', varName: 'data_basic_responsive', viewMode: 'responsive' },
];

const THUMBNAIL_PREFIX = '/assets/minimalist-blocks/';

/**
 * 브라우저용 JS 파일을 Node.js vm으로 파싱하여 snippets 배열 추출.
 * document 등 브라우저 API를 mock으로 제공.
 */
function parsePluginFile(source: string, varName: string): BasicSnippet[] {
    const sandbox: Record<string, unknown> = {
        document: {
            querySelectorAll: () => [{ src: 'http://localhost/assets/minimalist-blocks/content-plugins.js' }],
        },
    };

    vm.createContext(sandbox);
    vm.runInContext(source, sandbox);

    const data = sandbox[varName] as { snippets: BasicSnippet[] } | undefined;
    if (!data?.snippets) {
        throw new Error(`${varName}.snippets를 찾을 수 없습니다`);
    }

    return data.snippets;
}

/**
 * 썸네일 상대경로 → 절대경로 변환
 * 'preview/basic-03.png' → '/assets/minimalist-blocks/preview/basic-03.png'
 */
function toAbsoluteThumbnail(thumbnail: string): string {
    if (thumbnail.startsWith('/')) return thumbnail;
    return `${THUMBNAIL_PREFIX}${thumbnail}`;
}

/**
 * 기본 블록을 DB에 INSERT.
 * 이미 존재하는 블록은 건너뜀 (중복 안전).
 */
export async function seedBasicBlocks(): Promise<{ inserted: number; skipped: number }> {
    const pluginsDir = path.resolve(process.cwd(), 'public/assets/minimalist-blocks');
    let totalInserted = 0;
    let totalSkipped = 0;

    for (const { file, varName, viewMode } of PLUGIN_FILES) {
        const filePath = path.join(pluginsDir, file);
        console.log(`\n📂 파싱 중: ${file} (viewMode: ${viewMode})`);

        const source = await fs.readFile(filePath, 'utf-8');
        const snippets = parsePluginFile(source, varName);
        console.log(`   블록 수: ${snippets.length}개`);

        for (let i = 0; i < snippets.length; i++) {
            const snippet = snippets[i];
            const componentId = `basic-${viewMode}-${String(i + 1).padStart(3, '0')}`;

            // 중복 체크
            const existing = await getComponentById(componentId);
            if (existing) {
                console.log(`   ⏭ ${componentId} — 이미 존재, 건너뜀`);
                totalSkipped++;
                continue;
            }

            await createComponent({
                componentId,
                componentType: 'basic' as ComponentType,
                viewMode,
                componentThumbnail: toAbsoluteThumbnail(snippet.thumbnail),
                data: {
                    thumbnail: snippet.thumbnail,
                    category: snippet.category,
                    viewMode: snippet.viewMode,
                    html: snippet.html,
                    ...(snippet.type ? { type: snippet.type } : {}),
                },
                createUserId: 'system',
                createUserName: '시스템',
            });

            console.log(`   ✅ ${componentId} — INSERT 완료`);
            totalInserted++;
        }
    }

    return { inserted: totalInserted, skipped: totalSkipped };
}
