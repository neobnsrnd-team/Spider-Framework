/**
 * @file exportJson.ts
 * @description CMSPage JSON 직렬화 및 파일 다운로드 유틸리티.
 * CMS의 저장 포맷은 항상 JSON이며, 이 모듈은 내보내기/가져오기 기능을 제공합니다.
 *
 * - pageToJson: CMSPage → JSON 문자열
 * - downloadPageJson: CMSPage → 브라우저 파일 다운로드 (page.json)
 * - parsePageJson: JSON 문자열 → CMSPage (가져오기용)
 */
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
