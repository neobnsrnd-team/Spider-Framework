import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { pageRoutes, modalRoutes } from '@/routes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:            1000 * 60 * 5,
      retry:                2,
      refetchOnWindowFocus: false,
    },
  },
})

/**
 * Route 기반 모달 패턴.
 *
 * navigate('/card/menu', { state: { background: location } }) 로 이동하면
 * - background 위치에 기존 페이지를 유지한 채
 * - modalRoutes 에 등록된 컴포넌트(ModalSlideOver 포함)를 오버레이로 렌더링한다.
 *
 * 새 모달이 필요하면 routes.tsx 의 modalRoutes 에만 추가하면 된다.
 */
function AppRoutes() {
  const location = useLocation()
  const background = (location.state as { background?: Location })?.background

  return (
    <>
      {/* 일반 페이지 라우트 — 모달 열린 동안에는 background 위치로 고정 */}
      <Routes location={background ?? location}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        {pageRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>

      {/* 모달 라우트 — background 가 있을 때만 렌더링 */}
      {background && (
        <Routes>
          {modalRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      )}
    </>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
