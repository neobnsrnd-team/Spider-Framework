import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { cmsBankPlugin } from './src/vite-plugin/cmsBankPlugin';

// ESM 환경에서 __dirname 미정의 — import.meta.url로 직접 파생
const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Vite 5+에서 loadEnv는 더 이상 process.env에 자동 주입하지 않음.
  // prefix '' = VITE_ 접두사 없는 변수(ORACLE_*)도 포함해 전부 로드한 뒤 직접 주입.
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
  // VITE_BASE 환경변수로 base 경로를 제어한다.
  // 프록시 연동 시: VITE_BASE=/react-cms/ npm run dev
  // 단독 개발 시: 기본값 '/' 유지 (평소 동작 그대로)
  base: process.env.VITE_BASE ?? '/',
  server: {
    // 모든 네트워크 인터페이스에 바인딩 — Docker(nginx)에서 host.docker.internal로 접근하기 위해 필요
    host: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    // CMS 빌더에서 저장 시 demo/front 앱에 페이지 파일과 라우트를 자동 생성한다.
    cmsBankPlugin({
      routerPath: '../demo/front/src/routes/index.tsx',
      pagesDir:   '../demo/front/src/pages/cms',
    }),
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
  }
})
