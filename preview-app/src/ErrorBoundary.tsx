/**
 * @file ErrorBoundary.tsx
 * @description React 런타임 렌더링 오류를 포착하는 에러 경계 컴포넌트.
 *
 * React 18의 createRoot().render()는 비동기이므로,
 * 컴포넌트 트리 내부에서 발생하는 오류는 try-catch로 포착할 수 없다.
 * ErrorBoundary는 componentDidCatch를 통해 이를 포착하고
 * onError 콜백으로 상위에 전달한다.
 *
 * @param children - 렌더링할 사용자 컴포넌트
 * @param onError  - 오류 포착 시 호출되는 콜백 (서버 전송 등에 사용)
 */
import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  onError: (error: Error) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error): void {
    // 런타임 렌더링 오류를 onError 콜백으로 전달 (서버 오류 이력 저장)
    this.props.onError(error)
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: 16,
            color: '#d32f2f',
            fontFamily: 'monospace',
            background: '#fff3f3',
            borderRadius: 4,
            border: '1px solid #ffcdd2',
            margin: 16,
          }}
        >
          <strong>렌더링 오류</strong>
          <pre style={{ marginTop: 8, whiteSpace: 'pre-wrap', fontSize: 12 }}>
            {String(this.state.error)}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
