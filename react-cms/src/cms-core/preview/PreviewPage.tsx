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
