/**
 * @file global.d.ts
 * @description 브라우저 전역 타입 확장 선언.
 *
 * - window.Babel: index.html의 CDN <script>로 로드되는 @babel/standalone
 * - window.__components: componentRegistry.ts가 노출하는 reactive-springware 컴포넌트 맵
 */

interface BabelStandalone {
  /**
   * TSX/TypeScript 코드를 JS로 트랜스파일한다.
   * @param code 원본 소스 코드 문자열
   * @param options 트랜스파일 옵션 (presets, filename 등)
   */
  transform(
    code: string,
    options: { presets?: string[]; filename?: string },
  ): { code: string }
}

interface Window {
  /** index.html CDN 스크립트로 주입되는 Babel standalone 인스턴스 */
  Babel: BabelStandalone
  /** componentRegistry.ts가 초기화하는 reactive-springware 컴포넌트 전역 맵 */
  __components: Record<string, unknown>
}
