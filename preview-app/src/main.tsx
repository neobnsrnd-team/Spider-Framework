/**
 * @file main.tsx
 * @description Preview App 진입점.
 *
 * Spring Boot Thymeleaf 페이지의 iframe으로 삽입되며,
 * 부모 페이지로부터 postMessage로 Claude 생성 React 코드를 수신해 렌더링한다.
 *
 * @example
 * // 부모 페이지(react-generate-script.html)에서 코드 전달
 * frame.contentWindow.postMessage({ type: 'UPDATE_CODE', code: tsxCode }, '*')
 */
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
// componentRegistry를 진입점에서 import해 window.__components를 앱 실행 전에 초기화한다
import './componentRegistry'
import Renderer from './Renderer'

function App() {
  const [code, setCode] = useState<string | null>(null)

  // 부모 페이지로부터 UPDATE_CODE 메시지 수신 → 코드 상태 갱신
  useEffect(() => {
    const handler = (event: MessageEvent<{ type: string; code: string }>) => {
      if (event.data?.type === 'UPDATE_CODE') {
        setCode(event.data.code)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  if (code === null) {
    // 아직 코드를 수신하기 전 초기 상태 — 안내 문구 표시
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          color: '#aaa',
          fontFamily: 'sans-serif',
          fontSize: '14px',
        }}
      >
        코드 생성 후 미리보기가 여기에 표시됩니다.
      </div>
    )
  }

  return <Renderer code={code} />
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
