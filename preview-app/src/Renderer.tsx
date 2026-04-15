/**
 * @file Renderer.tsx
 * @description Claude 생성 TSX 코드를 트랜스파일해 브라우저에서 렌더링하는 컴포넌트.
 *
 * 처리 흐름:
 *   1. import 구문 → window.__components 접근으로 교체 (named / default / namespace)
 *   2. export default → var __Component = ... 으로 교체
 *   3. window.Babel(CDN)으로 TSX → JS 트랜스파일
 *   4. new Function으로 컴포넌트 추출 → ReactDOM.createRoot로 렌더링
 *
 * 오류 처리 두 단계:
 *   - 트랜스파일 오류 (Babel, new Function 등): 동기 → try-catch로 포착
 *   - 런타임 렌더링 오류 (undefined 컴포넌트 등): 비동기 → ErrorBoundary로 포착
 *     (React 18의 createRoot().render()는 비동기이므로 try-catch로 포착 불가)
 *
 * @param code - Claude가 생성한 TSX 코드 문자열
 */
import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom/client'
import { ErrorBoundary } from './ErrorBoundary'

interface RendererProps {
  code: string
}

/**
 * import 구문을 window.__components 접근으로 교체한다.
 *
 * 처리 순서가 중요하다: type → namespace → named → default → side-effect 순으로
 * 진행해야 앞선 패턴이 뒤 패턴과 충돌하지 않는다.
 *
 * @param src - 원본 TSX 코드
 * @returns import 구문이 교체된 코드
 */
function patchImports(src: string): string {
  return (
    src
      // type import는 런타임에 불필요하므로 제거
      .replace(/import\s+type\b[^\n]+/g, '')
      // namespace: import * as X from '...' → const X = window.__components
      .replace(
        /import\s+\*\s+as\s+(\w+)\s+from\s+['"][^'"]*['"]/g,
        (_m, name: string) => `const ${name} = window.__components`,
      )
      // named: import { A, B } from '...' → const { A, B } = window.__components
      .replace(
        /import\s+\{([^}]+)\}\s+from\s+['"][^'"]*['"]/g,
        (_m, names: string) => `const {${names}} = window.__components`,
      )
      // default: import X from '...' → const X = window.__components['X'] ?? window.__components
      // 패키지에 동명의 named export가 없는 경우 객체 전체를 fallback으로 제공한다
      .replace(
        /import\s+(\w+)\s+from\s+['"][^'"]*['"]/g,
        (_m, name: string) =>
          `const ${name} = window.__components['${name}'] ?? window.__components`,
      )
      // side-effect only: import '...' → (제거)
      .replace(/import\s+['"][^'"]*['"]/g, '')
  )
}

/**
 * export default를 __Component 변수 대입으로 교체한다.
 * new Function 내부에서 `return __Component` 로 컴포넌트를 추출하기 위함이다.
 *
 * @param src - import가 패치된 코드
 * @returns export default가 교체된 코드
 */
function patchExport(src: string): string {
  return (
    src
      // export default function Name(...) — 함수 이름 보존
      .replace(/export\s+default\s+function\s+(\w+)/, 'var __Component = function $1')
      // export default class Name — 클래스 이름 보존
      .replace(/export\s+default\s+class\s+(\w+)/, 'var __Component = class $1')
      // export default <expr> — 화살표 함수, 변수 참조 등 나머지 케이스
      .replace(/export\s+default\s+/, 'var __Component = ')
  )
}

/** 렌더링 오류를 서버 오류 이력에 비동기로 전송한다 (fire-and-forget). */
function reportRenderError(message: string): void {
  fetch('/api/react-generate/render-error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ errorMessage: message }),
  }).catch(() => {
    // 로깅 실패가 UI 흐름을 방해하면 안 됨
  })
}

export default function Renderer({ code }: RendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // ReactDOM.Root를 ref로 보관해 code 변경 시 unmount 없이 재렌더링한다
  const rootRef = useRef<ReturnType<typeof ReactDOM.createRoot> | null>(null)
  // code가 바뀔 때마다 ErrorBoundary를 리셋하기 위한 카운터
  const renderKeyRef = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    try {
      const patched = patchExport(patchImports(code))

      // window.Babel: index.html CDN 스크립트로 로드된 @babel/standalone (global.d.ts 참조)
      const { code: compiled } = window.Babel.transform(patched, {
        presets: ['react', 'typescript'],
        filename: 'component.tsx',
      })

      // React를 매개변수로 주입 — Babel이 JSX를 React.createElement(...)로 변환하므로
      // new Function 스코프 안에서 React가 참조 가능해야 한다
      // eslint-disable-next-line no-new-func
      const Component = new Function(
        'React',
        `${compiled}\nreturn __Component`,
      )(React) as React.ComponentType

      if (!rootRef.current) {
        rootRef.current = ReactDOM.createRoot(container)
      }

      // key를 증가시켜 ErrorBoundary를 리셋 — 새 코드 렌더링 시 이전 오류 상태 초기화
      renderKeyRef.current += 1

      // ErrorBoundary로 런타임 렌더링 오류 포착
      // try-catch는 동기 오류(Babel, new Function)만 잡을 수 있으므로,
      // React 컴포넌트 트리 내부의 비동기 오류는 ErrorBoundary가 담당한다
      rootRef.current.render(
        React.createElement(
          ErrorBoundary,
          {
            key: renderKeyRef.current,
            onError: (error: Error) => reportRenderError(error.message),
          },
          React.createElement(Component),
        ),
      )
    } catch (e) {
      // 트랜스파일 오류 (Babel 변환 실패, new Function 실패 등) — 동기 오류
      reportRenderError(String(e))

      // 이전 React 렌더 결과를 언마운트한 뒤 오류 메시지를 직접 DOM에 삽입
      rootRef.current?.unmount()
      rootRef.current = null
      container.innerHTML = `
        <div style="padding:16px;color:#d32f2f;font-family:monospace;background:#fff3f3;border-radius:4px;border:1px solid #ffcdd2;margin:16px">
          <strong>렌더링 오류</strong>
          <pre style="margin-top:8px;white-space:pre-wrap;font-size:12px">${String(e).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        </div>
      `
    }
  }, [code])

  return <div ref={containerRef} style={{ width: '100%', minHeight: '100%' }} />
}
