/**
 * @file PreviewPage.tsx
 * @description CMS 빌더 미리보기 페이지 컴포넌트.
 * CMS 빌더의 "미리보기" 버튼 클릭 시 새 탭(`/preview`)으로 열리며,
 * localStorage의 "cms_preview" 키에 저장된 CMSPage JSON을 읽어 PageRenderer로 렌더링합니다.
 * 미리보기 데이터가 없거나 파싱 실패 시 안내 메시지를 표시합니다.
 */
import { useState } from "react";
import type { CMSPage } from "../types";
import PageRenderer from "../runtime/renderPage";
import { UserScopeWrapper } from "../UserScopeWrapper";

const PREVIEW_KEY = "cms_preview";

export default function PreviewPage() {
  const [page] = useState<CMSPage | null>(() => {
    const raw = localStorage.getItem(PREVIEW_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as CMSPage;
    } catch {
      return null;
    }
  });

  if (!page) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <p className="text-sm text-gray-400">미리보기 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <UserScopeWrapper className="bg-white">
      <PageRenderer page={page} />
    </UserScopeWrapper>
  );
}
