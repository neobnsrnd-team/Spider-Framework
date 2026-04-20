# react-cms: admin 분리 리팩토링 계획

관련 이슈: #99 (react-cms 인증·권한 처리 구현)

---

## 배경

이슈 #99 구현 결과, admin 연동 코드(인증 가드, 미인가 페이지)가 `cms-core/` 안에 섞였다.
`cms-core`는 순수 CMS 엔진이어야 하므로, admin 관련 코드를 별도 디렉토리로 분리한다.
동시에 Router를 `CMSApp` 밖으로 꺼내 라우트 구성의 유연성을 확보한다.

---

## 현재 구조의 문제

```
src/
├── cms-core/
│   ├── CMSApp.tsx          ← Router + Context 혼재, CmsAuthGuard 인라인 정의
│   └── NotAuthorizedPage.tsx  ← admin 전용 페이지인데 cms-core 안에 있음
├── lib/
│   └── current-user.ts     ← admin 연동 파일인데 lib/ 에 있음
└── vite-plugin/
    └── cmsBankPlugin.ts    ← ../lib/current-user 참조
```

---

## 목표 구조

```
src/
├── admin/                      ← 신규: admin 연동 전용
│   ├── current-user.ts         ← lib/current-user.ts 에서 이동
│   ├── CmsAuthGuard.tsx        ← CMSApp.tsx 인라인에서 추출
│   └── NotAuthorizedPage.tsx   ← cms-core/에서 이동
├── cms-core/
│   └── CMSApp.tsx              ← Context Provider만, Router·admin 의존성 제거
├── lib/
│   └── env.ts                  ← 그대로 유지 (AUTH_BYPASS, SPIDER_ADMIN_API_URL 포함)
├── vite-plugin/
│   └── cmsBankPlugin.ts        ← import 경로만 변경
└── main.tsx                    ← Router 소유, admin과 cms-core 연결 지점
```

---

## 변경 내용

### 1. `src/admin/current-user.ts` (이동)

`src/lib/current-user.ts` → `src/admin/current-user.ts`

내용 변경 없음. 경로만 이동.

---

### 2. `src/admin/CmsAuthGuard.tsx` (신규 추출)

`CMSApp.tsx` 안에 인라인으로 정의된 `CmsAuthGuard` 함수를 별도 파일로 분리.

```tsx
/**
 * @file CmsAuthGuard.tsx
 * @description Spider Admin 권한 검증 레이아웃 가드.
 * 마운트 시 /__cms/api/me 를 호출해 REACT-CMS:R 권한을 확인한다.
 * 권한 없으면 /not-authorized 로 리다이렉트, 있으면 Outlet 렌더링.
 */
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function CmsAuthGuard() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const cmsBase = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/__cms`;
    fetch(`${cmsBase}/api/me`, { credentials: "include" })
      .then(r => r.json())
      .then((data: { canRead?: boolean }) => setAuthorized(data.canRead ?? false))
      .catch(() => setAuthorized(false));
  }, []);

  if (authorized === null) return null;
  if (!authorized) return <Navigate to="/not-authorized" replace />;
  return <Outlet />;
}
```

---

### 3. `src/admin/NotAuthorizedPage.tsx` (이동)

`src/cms-core/NotAuthorizedPage.tsx` → `src/admin/NotAuthorizedPage.tsx`

내용 변경 없음. 경로만 이동.

---

### 4. `src/cms-core/CMSApp.tsx` (수정)

Router 제거, `children` prop 수락, admin import 제거.

**제거되는 prop:**
- `onSave` → main.tsx에서 `<CMSBuilder onSave={savePage}>` 에 직접 전달
- `basename` → main.tsx의 `createBrowserRouter(..., { basename })` 에 직접 전달

**유지되는 prop:**
- `blocks`, `overlays`, `layouts`, `codegenConfig` (context용)
- `stylesheetContent`, `stylesheet`, `stylesheetScope` (캔버스 스타일용)

**변경 후 CMSApp:**

```tsx
export interface CMSAppProps {
  blocks: BlockDefinition[];
  overlays?: OverlayTemplate[];
  layouts?: LayoutTemplate[];
  stylesheetContent?: string;
  stylesheet?: string;
  stylesheetScope?: Record<string, string>;
  codegenConfig?: CMSCodegenConfig;
  children?: ReactNode;   // ← Router를 children으로 받음
}

export function CMSApp({ blocks, overlays, layouts, children, ... }: CMSAppProps) {
  // ... context 설정 ...
  return (
    <StylesheetContext.Provider value={...}>
      <BlockDefinitionsContext.Provider value={blocks}>
        ...
        {children}   // ← RouterProvider가 여기 들어옴
      </BlockDefinitionsContext.Provider>
    </StylesheetContext.Provider>
  );
}
```

---

### 5. `src/main.tsx` (수정)

Router를 직접 소유. admin 컴포넌트를 조립하는 연결 지점이 된다.

```tsx
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { StrictMode, createRoot } from "react";
import { CMSApp } from "@cms-core";
import { CMSBuilder } from "@cms-core/CMSBuilder";
import PreviewPage from "@cms-core/preview/PreviewPage";
import CmsAuthGuard from "./admin/CmsAuthGuard";
import NotAuthorizedPage from "./admin/NotAuthorizedPage";
import { blocks, overlays, layouts } from "./cms.config";
import { savePage } from "./savePage";
import userScopeCSS from "./user-scope.css?inline";

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
      element: <CmsAuthGuard />,   // admin 가드
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
  </StrictMode>
);
```

---

### 6. `src/vite-plugin/cmsBankPlugin.ts` (import 경로 변경)

```ts
// 변경 전
import { ... } from "../lib/current-user";

// 변경 후
import { ... } from "../admin/current-user";
```

---

## 작업 순서

1. `src/admin/` 디렉토리 생성
2. `src/lib/current-user.ts` → `src/admin/current-user.ts` 이동
3. `src/admin/CmsAuthGuard.tsx` 신규 생성 (CMSApp에서 추출)
4. `src/cms-core/NotAuthorizedPage.tsx` → `src/admin/NotAuthorizedPage.tsx` 이동
5. `src/vite-plugin/cmsBankPlugin.ts` import 경로 수정
6. `src/cms-core/CMSApp.tsx` 수정 (Router 제거, children prop 추가, admin import 제거)
7. `src/main.tsx` 수정 (Router 직접 정의, admin 컴포넌트 조립)
8. `npx tsc --noEmit` 로 타입 오류 확인

---

## 향후 대시보드 추가 방법

```
src/admin/DashboardPage.tsx  생성
  └── /__cms/api/pages GET 호출로 저장된 페이지 목록 표시
```

`main.tsx`의 router에 한 줄만 추가:
```tsx
{ path: "dashboard", element: <DashboardPage /> }
```

`cms-core`는 건드리지 않음.
