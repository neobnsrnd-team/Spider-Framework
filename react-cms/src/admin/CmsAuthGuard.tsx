/**
 * @file CmsAuthGuard.tsx
 * @description Spider Admin 권한 검증 레이아웃 가드.
 *
 * 마운트 시 `/__cms/api/me`를 호출해 REACT-CMS:R 권한을 확인한다.
 * - 로딩 중: 빈 화면 유지 (레이아웃 플래시 방지)
 * - canRead=false: `/not-authorized`로 리다이렉트
 * - canRead=true: 자식 라우트 렌더링 (Outlet)
 */
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function CmsAuthGuard() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // BASE_URL 기반으로 cmsBase 경로 산출 — 프록시 모드(/react-cms/)도 대응
    const cmsBase = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/__cms`;

    fetch(`${cmsBase}/api/me`, { credentials: "include" })
      .then(r => r.json())
      .then((data: { canRead?: boolean }) => {
        setAuthorized(data.canRead ?? false);
      })
      .catch(() => {
        // 네트워크 오류 시 미인가 처리
        setAuthorized(false);
      });
  }, []);

  // 권한 확인 완료 전 — 빈 화면 유지해 레이아웃 플래시 방지
  if (authorized === null) return null;
  // 권한 없음 — not-authorized 페이지로 이동 (replace로 뒤로가기 차단)
  if (!authorized) return <Navigate to="/not-authorized" replace />;
  return <Outlet />;
}
