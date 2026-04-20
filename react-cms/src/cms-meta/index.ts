/**
 * @file index.ts
 * @description cms-meta 공개 API 진입점.
 * CMS 빌더에 등록할 블록 정의 목록, 오버레이 템플릿 목록, 레이아웃 템플릿 목록을 내보냅니다.
 * CMSApp 또는 cms.config.ts에서 import해서 사용합니다.
 *
 * @example
 * import { blocks, overlays, layouts } from "@cms-meta";
 * <CMSApp blocks={blocks} overlays={overlays} layouts={layouts} />
 */
export { layouts }  from "./layouts";
export { overlays } from "./overlays";
export { blocks }   from "./blocks";