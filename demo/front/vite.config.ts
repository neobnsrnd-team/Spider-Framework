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
      /* 컴포넌트 라이브러리 소스를 직접 참조 (별도 빌드 불필요) */
      '@neobnsrnd-team/reactive-springware': resolve(__dirname, '../../packages/component-library/index.ts'),
      /* 컴포넌트 라이브러리 내부에서 사용하는 유틸 경로 */
      '@lib': resolve(__dirname, '../../lib'),
    },
  },
})
