import { generateJSX } from "@cms-core"
import type { CMSPage, SavePageParams } from "@cms-core"

export async function savePage(page: CMSPage, params: SavePageParams): Promise<void> {
  const { pageName, uri } = params
  const code = generateJSX(page)

  const res = await fetch("/__cms/create-page", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uri, code, pageName }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error((data as { error?: string }).error ?? "페이지 저장에 실패했습니다.")
  }
}
