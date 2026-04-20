/**
 * @file savePage.ts
 * @description CMS 빌더 페이지 저장 핸들러 (프로젝트별 커스텀 구현 예시).
 * cmsBankPlugin이 등록한 `/__cms/create-page` Vite dev 서버 엔드포인트에 POST 요청을 보냅니다.
 * main.tsx에서 CMSApp의 onSave prop에 전달합니다.
 *
 * 주의: 현재 main.tsx에서는 주석 처리되어 있으며 defaultSave가 사용됩니다.
 * 레이아웃/오버레이 Context 정보가 필요한 경우 CMSBuilder에서 생성한 params.code를 그대로 사용하세요.
 *
 * @param page 저장할 CMSPage 데이터
 * @param params pageName(PascalCase), uri(라우트 경로)
 */
import { generateJSX } from "@cms-core"
import type { CMSPage, SavePageParams } from "@cms-core"

export async function savePage(page: CMSPage, params: SavePageParams): Promise<void> {
  const { pageName, uri } = params
  // params.code에 CMSBuilder가 Context 정보를 포함해 생성한 코드가 있으면 그대로 사용.
  // 없으면(직접 호출 시) generateJSX로 기본 코드 생성 — layouts/overlayTemplates 미포함 주의.
  const code = generateJSX(page)

  const res = await fetch("/__cms/create-page", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uri, code, pageName }),
  })

  if (!res.ok) {
    // 서버 응답이 JSON이 아닌 경우(예: Vite 오류 페이지)에 대비해 catch로 빈 객체 반환
    const data = await res.json().catch(() => ({}))
    // data가 { error?: string } 형태임을 단언 — cmsBankPlugin 응답 포맷에 의존
    throw new Error((data as { error?: string }).error ?? "페이지 저장에 실패했습니다.")
  }
}
