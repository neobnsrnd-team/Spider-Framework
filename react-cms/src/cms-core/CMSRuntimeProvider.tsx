/**
 * @file CMSRuntimeProvider.tsx
 * @description 외부 프로젝트 앱에서 CMS 페이지를 런타임에 렌더링하기 위한 경량 컨텍스트 제공자.
 * CMSApp(빌더 UI) 없이 PageRenderer만 사용할 때 이 컴포넌트로 감쌉니다.
 *
 * @example
 * // apps/my-app/src/providers/AppProviders.tsx
 * import { CMSRuntimeProvider } from "@neobnsrnd-team/cms-core";
 * import { blocks, overlays, LAYOUT_TEMPLATES } from "@/cms";
 *
 * <CMSRuntimeProvider blocks={blocks} overlays={overlays} layouts={LAYOUT_TEMPLATES}>
 *   <App />
 * </CMSRuntimeProvider>
 */
import { useMemo } from "react";
import type { BlockDefinition, LayoutRenderer, LayoutTemplate, OverlayTemplate } from "./types";
import {
  BlockRegistryContext,
  BlockMetaContext,
  BlockDefinitionsContext,
  LayoutRendererContext,
  OverlayTemplatesContext,
  StylesheetContext,
} from "./context";

export interface CMSRuntimeProviderProps {
  /** 외부 프로젝트가 제공하는 블록 정의 목록 */
  blocks: BlockDefinition[];
  /** 오버레이 템플릿 목록 */
  overlays?: OverlayTemplate[];
  /**
   * 레이아웃 템플릿 목록.
   * 각 템플릿의 renderer 함수로 레이아웃 크롬(header/footer)을 렌더링합니다.
   */
  layouts?: LayoutTemplate[];
  /** 외부 프로젝트 CSS URL (UserScopeWrapper 사용 시) */
  stylesheet?: string;
  /** CSS 변수 활성화용 data 속성 */
  stylesheetScope?: Record<string, string>;
  children: React.ReactNode;
}

/**
 * @description CMS 런타임 컨텍스트 제공자.
 * 외부 프로젝트 앱 루트에 배치하면 앱 어디서든 PageRenderer로 CMS 페이지를 렌더링할 수 있습니다.
 */
export function CMSRuntimeProvider({
  blocks,
  overlays = [],
  layouts = [],
  stylesheet,
  stylesheetScope,
  children,
}: CMSRuntimeProviderProps) {
  const blockMeta = useMemo(
    () => Object.fromEntries(blocks.map((b) => [b.meta.name, b.meta])),
    [blocks],
  );

  const blockRegistry = useMemo(
    () => Object.fromEntries(blocks.map((b) => [b.meta.name, b.component])),
    [blocks],
  );

  const stylesheetConfig = useMemo(
    () => ({ stylesheet, stylesheetScope }),
    [stylesheet, stylesheetScope],
  );

  // layouts 배열에서 LayoutRenderer 파생: id로 템플릿을 찾아 renderer 호출
  const derivedRenderer = useMemo<LayoutRenderer | undefined>(() => {
    if (!layouts.length) return undefined;
    return (layoutType, layoutProps) =>
      layouts.find((t) => t.id === layoutType)?.renderer?.(layoutProps) ?? {};
  }, [layouts]);

  return (
    <StylesheetContext.Provider value={stylesheetConfig}>
      <BlockDefinitionsContext.Provider value={blocks}>
        <BlockMetaContext.Provider value={blockMeta}>
          <BlockRegistryContext.Provider value={blockRegistry}>
            <OverlayTemplatesContext.Provider value={overlays}>
              <LayoutRendererContext.Provider value={derivedRenderer}>
                {children}
              </LayoutRendererContext.Provider>
            </OverlayTemplatesContext.Provider>
          </BlockRegistryContext.Provider>
        </BlockMetaContext.Provider>
      </BlockDefinitionsContext.Provider>
    </StylesheetContext.Provider>
  );
}
