import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      /* src/ 절대 경로 alias */
      '@': resolve(__dirname, 'src'),
      /* 컴포넌트 라이브러리 루트 alias (pages 내 상대경로 '../../../' 대체) */
      '@cl': resolve(__dirname, '../../reactive-springware/component-library'),
      /* 컴포넌트 라이브러리 소스를 직접 참조 (별도 빌드 불필요) */
      '@neobnsrnd-team/reactive-springware': resolve(__dirname, '../../reactive-springware/component-library/index.ts'),
      /* 컴포넌트 라이브러리 내부 유틸 경로 */
      '@lib': resolve(__dirname, '../../reactive-springware/lib'),
    },
  },
  server: {
    proxy: {
      /* /api/notices/* 요청을 Demo Backend로 프록시
         SSE(EventSource)는 브라우저가 GET 요청을 직접 보내므로
         CORS 없이 프록시를 통해 연결한다. */
      '/api/notices': {
        target:      'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
