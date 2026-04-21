/**
 * @file NotAuthorizedPage.tsx
 * @description CMS 접근 권한이 없는 사용자에게 표시되는 페이지.
 *
 * CMS:R 권한이 없을 때 `/not-authorized` 경로로 리다이렉트되어 렌더링된다.
 * Spider Admin에서 CMS 메뉴 권한을 부여받아야 접근할 수 있음을 안내한다.
 */
import { Link } from "react-router-dom";

export default function NotAuthorizedPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold text-[#111827]">CMS access is not allowed.</h1>
      <p className="text-sm text-[#6b7280]">
        Ask your spider-admin administrator for CMS menu permission.
      </p>
      {/* 홈으로 돌아가기 — 권한 부여 후 재시도 시 사용 */}
      <Link
        to="/"
        className="rounded-lg bg-[#0046A4] px-4 py-2 text-sm font-semibold text-white"
      >
        Go to CMS home
      </Link>
    </main>
  );
}
