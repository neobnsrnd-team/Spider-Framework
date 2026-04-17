// ── 블록/페이지 데이터 모델 타입 ──────────────────────────────────────────────
export type {
  CMSBlock,
  CMSPage,
  CMSOverlay,
  CMSOverlayType,
  Action,
  BlockInteraction,
  LayoutType,
  BlockPadding,
} from "./types";
export { DEFAULT_PADDING } from "./types";

// ── 블록 메타데이터 타입 (외부 프로젝트 구현용) ───────────────────────────────
export type {
  PropField,
  LeafPropField,
  GroupPropField,
  ArrayPropField,
  EventPropField,
  BlockCategory,
  BlockDomain,
  BlockMeta,
  BlockDefinition,
} from "./types";

// ── 레이아웃 / 오버레이 주입 타입 ─────────────────────────────────────────────
export type {
  LayoutSlots,
  LayoutRenderer,
  LayoutTemplate,
  CMSCodegenConfig,
  OverlayRendererProps,
  OverlayTemplate,
} from "./types";

// ── CMS Runtime (외부 프로젝트 앱에서 CMS 페이지 렌더링용) ────────────────────────
export { CMSRuntimeProvider } from "./CMSRuntimeProvider";
export type { CMSRuntimeProviderProps } from "./CMSRuntimeProvider";
export { default as PageRenderer } from "./runtime/renderPage";

// ── CMS Builder ────────────────────────────────────────────────────────────────
export { CMSBuilder } from "./CMSBuilder";
export type { CMSBuilderProps } from "./CMSBuilder";
export type { SavePageParams } from "./SavePageModal";
export { generateJSX } from "./codegen/exportCode";

// ── CMS App ────────────────────────────────────────────────────────────────────
export { CMSApp } from "./CMSApp";
export type { CMSAppProps } from "./CMSApp";

// ── 스타일 격리 ────────────────────────────────────────────────────────────────
export { UserScopeWrapper } from "./UserScopeWrapper";
export type { StylesheetConfig } from "./context";
