/**
 * @file main.tsx
 * @description React CMS 빌더 앱의 진입점.
 *
 * Router를 직접 소유하고 admin 컴포넌트(CmsAuthGuard, NotAuthorizedPage)를 조립합니다.
 * CMSApp은 CMS 컨텍스트만 제공하며, RouterProvider를 children으로 받습니다.
 *
 * 라우트 구성:
 *   - /not-authorized  : 권한 없는 사용자용 공개 페이지 (인증 가드 밖)
 *   - /                : admin 연동 모드 → CmsAuthGuard (REACT-CMS:R 검증)
 *                        단독 실행 모드 → 인증 없이 바로 자식 라우트 렌더링
 *   - /builder         : CMS 에디터
 *   - /preview         : 페이지 미리보기
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import "./index.css";
import { CMSApp } from "@cms-core";
import { CMSBuilder } from "@cms-core/CMSBuilder";
import PreviewPage from "@cms-core/preview/PreviewPage";
import CmsAuthGuard from "./cms-admin/CmsAuthGuard";
import NotAuthorizedPage from "./cms-admin/NotAuthorizedPage";
import { blocks, overlays, layouts } from "./cms.config";
import { savePage } from "./savePage";
import userScopeCSS from "./user-scope.css?inline";
import { isAdminMode } from "./lib/client-env";

// BASE_URL은 Vite가 vite.config.ts의 base 설정값으로 주입한다.
// VITE_BASE=/react-cms/ 로 실행 시 '/react-cms/' — nginx 프록시를 거쳐 admin과 연동되는 모드.
// 단독 개발 시 기본값 '/' → admin 연동 없이 builder/preview 직접 접근 허용.
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
      // admin 연동 모드: CmsAuthGuard로 REACT-CMS:R 권한 검증 후 자식 라우트 렌더링
      // 단독 실행 모드: 인증 없이 Outlet으로 바로 자식 라우트 렌더링
      element: isAdminMode ? <CmsAuthGuard /> : <Outlet />,
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
