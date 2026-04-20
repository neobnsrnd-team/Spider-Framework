/**
 * @file main.tsx
 * @description React CMS 빌더 앱의 진입점.
 * CMSApp을 루트 DOM 요소(#root)에 마운트합니다.
 * blocks / overlays / layouts는 cms.config.ts에서, 스타일은 user-scope.css?inline으로 주입합니다.
 *
 * 개발 시 주의사항:
 * - onSave: DB 저장(/__cms/api/save) + 파일 시스템 저장(/__cms/create-page) 병행 수행.
 * - stylesheetContent에 user-scope.css를 인라인으로 전달해 캔버스 영역에만 외부 스타일을 격리합니다.
 */
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { CMSApp } from "@cms-core"
import { blocks, overlays, layouts } from "./cms.config"
import { savePage } from "./savePage"
import userScopeCSS from "./user-scope.css?inline"

// BASE_URL은 Vite가 vite.config.ts의 base 설정값으로 주입한다.
// VITE_BASE=/cms/ 로 실행 시 '/cms/' — 프록시 연동에서 React Router basename으로 사용.
// 단독 개발 시 기본값 '/' → basename 미설정으로 현재 동작 유지.
const basename = import.meta.env.BASE_URL !== '/'
  ? import.meta.env.BASE_URL.replace(/\/$/, '')
  : undefined;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CMSApp
      blocks={blocks}
      overlays={overlays}
      layouts={layouts}
      basename={basename}
      codegenConfig={{ blockImportFrom: "@cl", layoutImportFrom: "@cl" }}
      stylesheetContent={userScopeCSS}
      onSave={savePage}
    />
  </StrictMode>
)
