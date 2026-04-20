/**
 * @file defaultSave.ts
 * @description CMSApp의 기본 페이지 저장 핸들러.
 * cmsBankPlugin이 등록한 `/__cms/create-page` Vite dev 서버 엔드포인트에 POST 요청을 보냅니다.
 * CMSBuilder가 이미 Context 정보를 포함한 코드를 params.code에 주입하므로,
 * 이 함수는 별도 코드 생성 없이 params.code를 그대로 사용합니다.
 * params.code가 없는 경우(직접 호출)에는 generateJSX로 기본 코드를 생성합니다.
 *
 * @param page 저장할 CMSPage 데이터
 * @param params pageName(PascalCase), uri(라우트 경로), code(JSX 코드 문자열)
 */
import { generateJSX } from "../codegen/exportCode";
import type { CMSPage } from "../types";
import type { SavePageParams } from "../SavePageModal";

// BASE_URL 기준 /__cms/ 접두사 생성.
// 프록시 모드(BASE_URL=/react-cms/): '/react-cms/__cms' → nginx가 Vite로 라우팅
// 단독 모드(BASE_URL=/):             '/__cms'           → Vite 직접 처리
const cmsBase = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/__cms`;

export async function defaultSave(page: CMSPage, params: SavePageParams): Promise<void> {
  const { pageName, uri } = params;
  // CMSBuilder에서 layouts/codegenConfig/overlayTemplates Context를 포함해 사전 생성한 코드 우선 사용.
  // params.code가 없는 경우(직접 호출 시) generateJSX로 폴백 — Context 정보 미포함 주의.
  const code = params.code ?? generateJSX(page);

  const res = await fetch(`${cmsBase}/create-page`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uri, code, pageName }),
  });

  if (!res.ok) {
    // 서버 응답이 JSON이 아닌 경우(예: Vite 오류 페이지)에 대비해 catch로 빈 객체 반환
    const data = await res.json().catch(() => ({}));
    // data가 { error?: string } 형태임을 단언 — cmsBankPlugin 응답 포맷에 의존
    throw new Error((data as { error?: string }).error ?? "페이지 저장에 실패했습니다.");
  }
}
