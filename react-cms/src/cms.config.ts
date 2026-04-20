/**
 * @file cms.config.ts
 * @description CMS 앱 설정 진입점.
 * cms-meta에서 정의된 blocks / overlays / layouts를 불러와
 * main.tsx의 CMSApp에 전달하는 중간 집합 파일입니다.
 * 외부 프로젝트에서 블록 목록·오버레이·레이아웃을 커스터마이징할 때 이 파일을 수정합니다.
 */
import type { BlockDefinition, OverlayTemplate, LayoutTemplate } from "@cms-core"
import { blocks as myBlocks, overlays as myOverlays, layouts as myLayouts } from "@cms-meta"

export const blocks: BlockDefinition[] = myBlocks
export const overlays: OverlayTemplate[] = myOverlays
export const layouts: LayoutTemplate[] = myLayouts
