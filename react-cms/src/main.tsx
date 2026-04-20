/**
 * @file main.tsx
 * @description React CMS 빌더 앱의 진입점.
 *
 * Router를 직접 소유하고 admin 컴포넌트(CmsAuthGuard, NotAuthorizedPage)를 조립합니다.
 * CMSApp은 CMS 컨텍스트만 제공하며, RouterProvider를 children으로 받습니다.
 *
 * 라우트 구성:
 *   - /not-authorized  : 권한 없는 사용자용 공개 페이지 (인증 가드 밖)
 *   - /                : CmsAuthGuard (REACT-CMS:R 검증)
 *   - /builder         : CMS 에디터
 *   - /preview         : 페이지 미리보기
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "./index.css";
import { CMSApp } from "@cms-core";
import { CMSBuilder } from "@cms-core/CMSBuilder";
import PreviewPage from "@cms-core/preview/PreviewPage";
import CmsAuthGuard from "./admin/CmsAuthGuard";
import NotAuthorizedPage from "./admin/NotAuthorizedPage";
import { blocks, overlays, layouts } from "./cms.config";
import { savePage } from "./savePage";
import userScopeCSS from "./user-scope.css?inline";

// BASE_URL은 Vite가 vite.config.ts의 base 설정값으로 주입한다.
// VITE_BASE=/cms/ 로 실행 시 '/cms/' — 프록시 연동에서 React Router basename으로 사용.
// 단독 개발 시 기본값 '/' → basename 미설정으로 현재 동작 유지.
const basename = import.meta.env.BASE_URL !== "/"
  ? import.meta.env.BASE_URL.replace(/\/$/, "")
  : undefined;

const router = createBrowserRouter(
  [
    // 공개 경로 — 인증 가드 밖
    {
      path: "not-authorized",
      element: <NotAuthorizedPage />,
    },
    {
      path: "/",
      // CmsAuthGuard: REACT-CMS:R 검증 후 자식 라우트 렌더링
      element: <CmsAuthGuard />,
      children: [
        { index: true, element: <Navigate to="/builder" replace /> },
        {
          path: "builder",
          element: <CMSBuilder onSave={savePage} />,
        },
        {
          path: "preview",
          element: <PreviewPage />,
        },
        // 대시보드 추가 예정:
        // {
        //   path: "dashboard",
        //   element: <DashboardPage />,
        // },
      ],
    },
  ],
  { basename },
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CMSApp
      blocks={blocks}
      overlays={overlays}
      layouts={layouts}
      codegenConfig={{ blockImportFrom: "@cl", layoutImportFrom: "@cl" }}
      stylesheetContent={userScopeCSS}
    >
      <RouterProvider router={router} />
    </CMSApp>
  </StrictMode>,
);
