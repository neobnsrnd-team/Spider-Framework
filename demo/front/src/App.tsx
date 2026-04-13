import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import routes from '@/router/routes'

/**
 * QueryClient 전역 설정.
 * - staleTime 5분: 금융 잔액·거래내역은 자주 변하지 않으므로 캐시 유지
 * - retry 2: 네트워크 오류 시 2회 재시도 후 에러 상태로 전환
 * - refetchOnWindowFocus false: 탭 포커스 시 자동 재조회 비활성
 *   (금융앱 특성상 사용자가 직접 새로고침하는 것이 적합)
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:           1000 * 60 * 5,
      retry:               2,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* 기본 경로는 홈으로 리다이렉트 */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
