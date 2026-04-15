/**
 * @file vite.config.ts
 * @description Preview App 빌드 설정.
 *
 * reactive-springware 컴포넌트를 소스 직접 참조(alias)로 번들링하여
 * admin Spring Boot 정적 리소스 경로로 출력한다.
 * demo/front/vite.config.ts와 동일한 alias 전략을 사용하므로 dist 빌드가 불필요하다.
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [tailwindcss(), react()],
  // Spring Boot가 /preview-app/** 경로로 정적 파일을 서빙
  base: '/preview-app/',
  build: {
    outDir: '../admin/src/main/resources/static/preview-app',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      // component-library 디렉토리 alias — demo/front와 동일
      '@cl': resolve(__dirname, '../reactive-springware/component-library'),
      // component-library 내부 유틸 경로
      '@lib': resolve(__dirname, '../reactive-springware/lib'),
    },
  },
})
