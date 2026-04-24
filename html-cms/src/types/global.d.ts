// src/types/global.d.ts

import type ContentBuilderRuntime from '@innovastudio/contentbuilder-runtime';

import type { BasicBlock } from '@/components/edit/EditClient';

declare global {
    interface Window {
        /** ContentBuilderRuntime 인스턴스 — 에디터 내부 플러그인 미리보기용으로 전역 등록 */
        builderRuntime?: ContentBuilderRuntime;

        /** 에디터 런타임 재초기화 함수 — 플러그인에서 뷰모드 전환 시 호출 */
        builderReinit?: () => void;

        /** CMS 공유 색상 팔레트 — 플러그인 에디터에서 window.__cmsColors로 접근 */
        __cmsColors?: string[];

        /** content-plugins.js 로드 시 전역에 설정되는 기본 블록 스니펫 */
        data_basic?: { snippets: BasicBlock[] };
        data_basic_mobile?: { snippets: BasicBlock[] };
        data_basic_responsive?: { snippets: BasicBlock[] };
    }
}

export {};
