import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// StrictMode 제거 — 개발 환경에서 useEffect를 2회 실행하여 모든 API가 중복 호출되는 문제 방지
createRoot(document.getElementById('root')!).render(
  <App />
)
