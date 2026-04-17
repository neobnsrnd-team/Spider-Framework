/**
 * @file UserScopeWrapper.tsx
 * @description 외부 프로젝트 스타일 격리 래퍼.
 * stylesheetContent(인라인 문자열) 또는 stylesheet(URL fetch) 방식으로 CSS를 로드하고
 * CSS @scope 규칙으로 모든 선택자를 [data-cms-user-scope] 하위에만 적용합니다.
 * CMS 빌더 UI(모달, 사이드바 등)에 외부 프로젝트 스타일이 누출되지 않도록 격리합니다.
 */
import { useContext, useEffect, useRef, useState } from "react";
import { StylesheetContext } from "./context";

// ─── @import url() 추출 ──────────────────────────────────────────────────────

/**
 * @description CSS 텍스트에서 `@import url(...)` 규칙을 추출합니다.
 * CSS 스펙상 `@import`는 최상위 레벨에만 허용되므로, `@scope` 블록 안에 포함되면
 * 브라우저가 `@scope` 전체를 무시하거나 전역으로 적용하는 문제가 발생합니다.
 * (Google Fonts 등 외부 URL import가 대표적인 사례)
 *
 * @param css 원본 CSS 문자열
 * @returns imports: 최상위에 둬야 할 @import 규칙, rest: 나머지 CSS
 */
function extractTopLevelImports(css: string): { imports: string; rest: string } {
  const imports: string[] = [];
  const rest = css.replace(
    /^(@import\s+url\([^)]*\)[^;]*;)[ \t]*\n?/gm,
    (_match, rule: string) => {
      imports.push(rule);
      return "";
    },
  );
  return { imports: imports.join("\n"), rest };
}

// ─── CSS @scope 래핑 ──────────────────────────────────────────────────────────

/**
 * @description CSS 텍스트를 @scope ([data-cms-user-scope]) 블록으로 감싸
 * 모든 선택자가 [data-cms-user-scope] 하위 요소에만 적용되도록 격리합니다.
 * :root는 :scope로 변환해 스코프 루트 요소(UserScopeWrapper div)에 CSS 변수가 설정됩니다.
 * 이를 통해 외부 프로젝트의 button, input 등 전역 선택자가 CMS 빌더 UI에 누출되는 것을 방지합니다.
 * @param css @import url()이 이미 제거된 CSS 문자열
 * @returns @scope 블록으로 래핑된 CSS 문자열
 */
function scopeCss(css: string): string {
  // 주석(/* */), 문자열 리터럴("", '')은 원본 유지하고, :root만 :scope로 변환
  const scoped = css.replace(
    /(\/\*[\s\S]*?\*\/|"[^"]*"|'[^']*')|:root\b/g,
    (match, skip) => (skip ? skip : ":scope"),
  );
  return `@scope ([data-cms-user-scope]) {\n${scoped}\n}`;
}

// ─── 인라인 CSS 주입 ──────────────────────────────────────────────────────────

/**
 * @description 컴파일된 CSS 문자열을 두 개의 <style> 태그로 분리 주입합니다.
 * 1. @import url() 규칙 → 최상위 <style> (fonts 등 전역 리소스)
 * 2. 나머지 CSS → @scope로 래핑한 <style> (캔버스 내부에만 적용)
 * @param content 컴파일된 CSS 문자열
 */
function useInlineStylesheet(content: string | undefined) {
  useEffect(() => {
    if (!content) return;

    const { imports, rest } = extractTopLevelImports(content);
    const elements: HTMLStyleElement[] = [];

    // @import url()은 @scope 밖에서 최상위로 주입
    if (imports) {
      const importEl = document.createElement("style");
      importEl.setAttribute("data-cms-user-stylesheet", "fonts");
      importEl.textContent = imports;
      document.head.appendChild(importEl);
      elements.push(importEl);
    }

    // 나머지 스타일은 @scope로 격리
    const scopedEl = document.createElement("style");
    scopedEl.setAttribute("data-cms-user-stylesheet", "inline");
    scopedEl.textContent = scopeCss(rest);
    document.head.appendChild(scopedEl);
    elements.push(scopedEl);

    return () => {
      elements.forEach((el) => el.remove());
    };
  }, [content]);
}

// ─── URL fetch CSS 로더 ───────────────────────────────────────────────────────

/**
 * @description stylesheet URL을 fetch해 스코프 변환 후 <style> 태그를 head에 삽입합니다.
 * `stylesheetContent`가 제공된 경우에는 실행되지 않습니다.
 * @param stylesheet CSS URL
 * @param skip true이면 아무것도 하지 않음
 */
function useExternalStylesheet(stylesheet: string | undefined, skip: boolean) {
  const [ready, setReady] = useState(!stylesheet || skip);

  useEffect(() => {
    if (!stylesheet || skip) {
      setReady(true);
      return;
    }

    setReady(false);
    let cancelled = false;
    const elements: HTMLStyleElement[] = [];

    fetch(stylesheet)
      .then((r) => r.text())
      .then((css) => {
        if (cancelled) return;

        const { imports, rest } = extractTopLevelImports(css);

        if (imports) {
          const importEl = document.createElement("style");
          importEl.setAttribute("data-cms-user-stylesheet", `${stylesheet}:fonts`);
          importEl.textContent = imports;
          document.head.appendChild(importEl);
          elements.push(importEl);
        }

        const scopedEl = document.createElement("style");
        scopedEl.setAttribute("data-cms-user-stylesheet", stylesheet);
        scopedEl.textContent = scopeCss(rest);
        document.head.appendChild(scopedEl);
        elements.push(scopedEl);

        setReady(true);
      })
      .catch(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
      elements.forEach((el) => el.remove());
    };
  }, [stylesheet, skip]);

  return ready;
}

// ─── UserScopeWrapper ────────────────────────────────────────────────────────

interface UserScopeWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * @description 외부 프로젝트 CSS를 격리해 자식 컴포넌트에만 적용합니다.
 * StylesheetContext에서 설정을 읽어 두 가지 방식 중 하나로 CSS를 주입합니다.
 *
 * - `stylesheetContent` (우선): 컴파일된 CSS 문자열 → 개발 환경에서 Vite `?inline` 사용
 * - `stylesheet` (폴백): 외부 CSS URL → fetch 후 스코프 변환 (프로덕션 URL용)
 *
 * 두 방식 모두 @import url()은 최상위 <style>로 분리하고,
 * 나머지 스타일은 CSS @scope로 [data-cms-user-scope] 범위로 제한합니다.
 *
 * @param children 스타일을 적용할 자식 컴포넌트
 * @param className 추가 className
 * @param style 추가 인라인 스타일
 */
export function UserScopeWrapper({ children, className, style }: UserScopeWrapperProps) {
  const { stylesheet, stylesheetContent, stylesheetScope } = useContext(StylesheetContext);
  const ref = useRef<HTMLDivElement>(null);

  const hasContent = !!stylesheetContent;

  // stylesheetContent 우선 — 인라인 문자열 직접 주입
  useInlineStylesheet(stylesheetContent);
  // stylesheet URL은 stylesheetContent가 없을 때만 fetch
  useExternalStylesheet(stylesheet, hasContent);

  // stylesheetScope data 속성 적용
  useEffect(() => {
    const el = ref.current;
    if (!el || !stylesheetScope) return;
    for (const [key, value] of Object.entries(stylesheetScope)) {
      el.setAttribute(key, value);
    }
    return () => {
      if (!el || !stylesheetScope) return;
      for (const key of Object.keys(stylesheetScope)) {
        el.removeAttribute(key);
      }
    };
  }, [stylesheetScope]);

  const hasStylesheet = hasContent || !!stylesheet;

  if (!hasStylesheet) {
    // 스타일시트가 없으면 래퍼 없이 그대로 렌더링
    return <>{children}</>;
  }

  return (
    <div ref={ref} data-cms-user-scope className={className} style={style}>
      {children}
    </div>
  );
}
