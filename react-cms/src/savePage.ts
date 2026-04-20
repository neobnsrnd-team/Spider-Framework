/**
 * @file savePage.ts
 * @description CMS 빌더 페이지 저장 핸들러.
 * 두 가지 저장을 병행합니다:
 *   1. Oracle DB 저장 (/__cms/api/save) — 재편집·이력 관리용 JSON
 *   2. 파일 시스템 저장 (/__cms/create-page) — demo/front 앱 라우트 등록용 JSX
 *
 * DB 저장 시 pageId를 localStorage에 캐싱합니다.
 * pageName이 같으면 재저장 시 동일 pageId로 UPDATE합니다.
 *
 * @param page 저장할 CMSPage 데이터
 * @param params pageName(PascalCase), uri(라우트 경로), code(JSX 코드 문자열)
 */
import { generateJSX } from "@cms-core"
import type { CMSPage, SavePageParams } from "@cms-core"

/** localStorage key: pageName → pageId 매핑 */
const PAGE_ID_KEY_PREFIX = "cms_page_id_"

// BASE_URL 기준 /__cms/ 접두사 생성.
// 프록시 모드(BASE_URL=/react-cms/): '/react-cms/__cms' → nginx가 Vite로 라우팅
// 단독 모드(BASE_URL=/):             '/__cms'           → Vite 직접 처리
const cmsBase = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/__cms`

export async function savePage(page: CMSPage, params: SavePageParams): Promise<void> {
  const { pageName, uri } = params
  // CMSBuilder에서 Context 정보를 포함해 사전 생성한 코드 우선 사용.
  // 없으면(직접 호출 시) generateJSX로 폴백 — Context 정보 미포함 주의.
  const code = params.code ?? generateJSX(page)

  // ── 1. DB 저장 ───────────────────────────────────────────────
  const storedPageId = localStorage.getItem(`${PAGE_ID_KEY_PREFIX}${pageName}`) ?? undefined

  const dbRes = await fetch(`${cmsBase}/api/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pageId:   storedPageId,
      pageName,
      pageJson: JSON.stringify(page),
      pageCode: code,           // 생성된 React JSX 코드 — PAGE_DESC 컬럼에 저장
    }),
  })

  if (!dbRes.ok) {
    const data = await dbRes.json().catch(() => ({}))
    throw new Error((data as { error?: string }).error ?? "DB 저장에 실패했습니다.")
  }

  const { pageId } = (await dbRes.json()) as { pageId: string }
  // 반환된 pageId를 캐싱 — 재저장 시 UPDATE로 처리
  localStorage.setItem(`${PAGE_ID_KEY_PREFIX}${pageName}`, pageId)

  // ── 2. 파일 시스템 저장 ─────────────────────────────────────
  // 기존 Vite 플러그인 방식 유지 — demo/front 앱 라우트 자동 등록
  const fsRes = await fetch(`${cmsBase}/create-page`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uri, code, pageName }),
  })

  if (!fsRes.ok) {
    const data = await fsRes.json().catch(() => ({}))
    throw new Error((data as { error?: string }).error ?? "파일 저장에 실패했습니다.")
  }
}
