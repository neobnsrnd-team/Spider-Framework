import { generateJSX } from "../codegen/exportCode";
import type { CMSPage } from "../types";
import type { SavePageParams } from "../SavePageModal";

export async function defaultSave(page: CMSPage, params: SavePageParams): Promise<void> {
  const { pageName, uri } = params;
  const code = params.code ?? generateJSX(page);

  const res = await fetch("/__cms/create-page", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uri, code, pageName }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? "페이지 저장에 실패했습니다.");
  }
}
