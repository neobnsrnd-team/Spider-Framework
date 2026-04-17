import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
// 컴포넌트 라이브러리 전역 테마 — 디자인 토큰 + Tailwind preflight/utilities
// CMS 빌더 셸 전용 추가 변수 (툴바 높이, 캔버스 패딩 등)
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
