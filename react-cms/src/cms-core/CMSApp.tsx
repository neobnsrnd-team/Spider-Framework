/**
 * @file CMSApp.tsx
 * @description CMS 앱 진입점. 외부 프로젝트가 제공하는 blocks/overlays/layouts를 컨텍스트로 제공합니다.
 */
import { useMemo } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { CMSBuilder } from "@cms-core/CMSBuilder";
import type { BlockDefinition, LayoutRenderer, LayoutTemplate, OverlayTemplate, CMSCodegenConfig } from "./types";
import type { CMSPage } from "./types";
import type { SavePageParams } from "@cms-core/SavePageModal";
import PreviewPage from "@cms-core/preview/PreviewPage";
import { defaultSave } from "@cms-core/api/defaultSave";
import {
  BlockRegistryContext,
  BlockMetaContext,
  BlockDefinitionsContext,
  LayoutRendererContext,
  LayoutTemplatesContext,
  OverlayTemplatesContext,
  StylesheetContext,
  CodegenConfigContext,
} from "./context";

export interface CMSAppProps {
  /** 팔레트에 표시할 블록 목록 — 필수 */
  blocks: BlockDefinition[];
  /** 오버레이 템플릿 목록 */
  overlays?: OverlayTemplate[];
  /**
   * 레이아웃 템플릿 목록.
   * 각 템플릿의 renderer 함수로 레이아웃 크롬(header/footer)을 렌더링합니다.
   */
  layouts?: LayoutTemplate[];
  /** 페이지 저장 핸들러 */
  onSave?: (page: CMSPage, params: SavePageParams) => void | Promise<void>;
  /** React Router basename */
  basename?: string;
  /**
   * 외부 프로젝트 컴파일된 CSS 문자열 — 캔버스/썸네일/미리보기 영역에만 스코프 적용.
   * 개발 환경에서 Vite의 `?inline` import로 얻은 CSS를 전달합니다. `stylesheet`보다 우선합니다.
   * @example
   * import userCSS from "./user-scope.css?inline";
   * <CMSApp stylesheetContent={userCSS} />
   */
  stylesheetContent?: string;
  /**
   * 외부 프로젝트 CSS URL — 런타임 fetch 후 캔버스/썸네일/미리보기 영역에만 로드.
   * 주로 프로덕션에서 배포된 CSS URL을 지정할 때 사용합니다.
   */
  stylesheet?: string;
  /** CSS 변수 활성화용 data 속성 (예: { "data-brand": "kb" }) */
  stylesheetScope?: Record<string, string>;
  /**
   * generateJSX 코드 생성 설정.
   * blockImportFrom으로 블록 컴포넌트 import 소스를 지정합니다.
   * 미정의 시 "@neobnsrnd-team/cms-ui"를 기본값으로 사용합니다.
   */
  codegenConfig?: CMSCodegenConfig;
}

export function CMSApp({ blocks, overlays = [], layouts = [], onSave, basename, stylesheetContent, stylesheet, stylesheetScope, codegenConfig = {} }: CMSAppProps) {
  const blockMeta = useMemo(
    () => Object.fromEntries(blocks.map((b) => [b.meta.name, b.meta])),
    [blocks],
  );

  const blockRegistry = useMemo(
    () => Object.fromEntries(blocks.map((b) => [b.meta.name, b.component])),
    [blocks],
  );

  const onSaveFn = useMemo(
    () => onSave ?? defaultSave,
    [onSave],
  );

  // layouts 배열에서 LayoutRenderer 파생: id로 템플릿을 찾아 renderer 호출
  const derivedRenderer = useMemo<LayoutRenderer | undefined>(() => {
    if (!layouts.length) return undefined;
    return (layoutType, layoutProps) =>
      layouts.find((t) => t.id === layoutType)?.renderer?.(layoutProps) ?? {};
  }, [layouts]);

  const router = useMemo(
    () =>
      createBrowserRouter(
        [
          {
            path: "/",
            children: [
              { index: true, element: <Navigate to="/builder" replace /> },
              {
                path: "builder",
                element: <CMSBuilder onSave={onSaveFn} />,
              },
              {
                path: "preview",
                element: <PreviewPage />,
              },
            ],
          },
        ],
        { basename },
      ),
    [basename, onSaveFn],
  );

  const stylesheetConfig = useMemo(
    () => ({ stylesheetContent, stylesheet, stylesheetScope }),
    [stylesheetContent, stylesheet, stylesheetScope],
  );

  const codegenConfigMemo = useMemo(() => codegenConfig, [codegenConfig]);

  return (
    <StylesheetContext.Provider value={stylesheetConfig}>
      <BlockDefinitionsContext.Provider value={blocks}>
        <BlockMetaContext.Provider value={blockMeta}>
          <BlockRegistryContext.Provider value={blockRegistry}>
            <OverlayTemplatesContext.Provider value={overlays}>
              <LayoutTemplatesContext.Provider value={layouts}>
                <LayoutRendererContext.Provider value={derivedRenderer}>
                  <CodegenConfigContext.Provider value={codegenConfigMemo}>
                    <RouterProvider router={router} />
                  </CodegenConfigContext.Provider>
                </LayoutRendererContext.Provider>
              </LayoutTemplatesContext.Provider>
            </OverlayTemplatesContext.Provider>
          </BlockRegistryContext.Provider>
        </BlockMetaContext.Provider>
      </BlockDefinitionsContext.Provider>
    </StylesheetContext.Provider>
  );
}
