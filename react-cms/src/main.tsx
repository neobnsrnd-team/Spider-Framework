import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
// Tailwind 유틸리티 전역 주입 — 빌더 셸(모달·사이드바 등)에 bg-primary 등 커스텀 클래스 적용
// user-scope.css?inline 은 @scope 로 스코프되어 모달 등 빌더 UI에 적용되지 않으므로 별도 전역 import 필요
// import "./globals.css"
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
