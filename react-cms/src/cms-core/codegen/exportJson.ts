// JSON 내보내기
// CMSPage를 JSON 파일로 다운로드하거나 문자열로 직렬화합니다.
import type { CMSPage } from "../types";

export function pageToJson(page: CMSPage): string {
  return JSON.stringify(page, null, 2);
}

export function downloadPageJson(page: CMSPage, filename = "page.json") {
  const json = pageToJson(page);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function parsePageJson(json: string): CMSPage {
  return JSON.parse(json) as CMSPage;
}
