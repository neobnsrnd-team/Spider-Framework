/**
 * @file main.tsx
 * @description React CMS 빌더 앱의 진입점.
 * CMSApp을 루트 DOM 요소(#root)에 마운트합니다.
 * blocks / overlays / layouts는 cms.config.ts에서, 스타일은 user-scope.css?inline으로 주입합니다.
 *
 * 개발 시 주의사항:
 * - onSave는 현재 주석 처리됨 (defaultSave 사용). 페이지 저장 커스터마이징이 필요하면 savePage.ts 참고.
 * - stylesheetContent에 user-scope.css를 인라인으로 전달해 캔버스 영역에만 외부 스타일을 격리합니다.
 */
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { CMSApp } from "@cms-core"
import { blocks, overlays, layouts } from "./cms.config"
// import { savePage } from "./savePage"
import userScopeCSS from "./user-scope.css?inline"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CMSApp
      blocks={blocks}
      overlays={overlays}
      layouts={layouts}
      codegenConfig={{ blockImportFrom: "@cl", layoutImportFrom: "@cl" }}
      stylesheetContent={userScopeCSS}
      // onSave={savePage}
    />
  </StrictMode>
)
