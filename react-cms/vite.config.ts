import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ESM 환경에서 __dirname 미정의 — import.meta.url로 직접 파생
const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      /* src/ 절대 경로 alias */
      '@': resolve(__dirname, 'src'),
      /* 컴포넌트 라이브러리 루트 (deep import용: @cl/modules/common/BankSelectGrid 등) */
      '@cl': resolve(__dirname, '../reactive-springware/component-library'),
      /* CMS 엔진 / 메타 단축 경로 */
      '@cms-core': resolve(__dirname, 'src/cms-core'),
      '@cms-meta': resolve(__dirname, 'src/cms-meta'),
      /* 컴포넌트 라이브러리 내부 유틸 경로 */
      '@lib': resolve(__dirname, '../reactive-springware/lib'),
    },
  },
})
