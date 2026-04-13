/**
 * @file vite.config.js
 * @description Vite 개발 환경 설정.
 *
 *   - @shared alias: src/@shared (junction) → packages/@shared
 *   - resolve.dedupe: junction 경유 시 react/react-dom 중복 로드 방지
 *   - themeWatcherPlugin: 브랜드 JSON 변경 감지 → globals.css 자동 재생성
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * 브랜드 JSON 파일 변경 감지 시 globals.css를 자동 재생성하는 Vite 플러그인.
 *
 * - 감시 대상: packages/@shared/styles/themes 하위 모든 .json 파일
 * - CSS 갱신 전략:
 *     1. execSync 로 globals.css 재생성 (동기 블로킹 — 쓰기 완료 보장)
 *     2. server.watcher.emit('change', globalsPath) 로 Tailwind HMR 파이프라인 수동 트리거
 *        → @tailwindcss/vite 플러그인이 CSS-only 업데이트를 브라우저에 전송
 *        → 페이지 전체 새로고침 없이 스타일만 교체됨
 *     3. Tailwind HMR이 동작하지 않는 환경(예: 플러그인 버전 차이)에 대비해
 *        full-reload를 fallback으로 주석 처리하여 보존
 */
const themeWatcherPlugin = {
  name: 'theme-watcher',

  configureServer(server) {
    const themesDir  = path.resolve(__dirname, 'packages/@shared/styles/themes');
    // globals.css 물리 경로 — watcher.emit 의 인수로 사용
    const globalsPath = path.resolve(__dirname, 'packages/@shared/styles/globals.css');

    // Vite 기본 감시 범위 밖에 있으므로 명시적으로 추가
    server.watcher.add(path.join(themesDir, '**/*.json'));

    server.watcher.on('change', (file) => {
      const isThemeJson =
        file.startsWith(themesDir) && file.endsWith('.json');

      if (!isThemeJson) return;

      const rel = path.relative(__dirname, file);
      console.log(`[theme-watcher] 변경 감지: ${rel}`);

      try {
        // tsx는 packages/plop에 설치되어 있으므로 npm run build:css-all 경유
        execSync('npm run build:css-all', {
          cwd: __dirname,
          stdio: 'pipe', // 빌드 출력을 서버 로그에 혼입시키지 않음
        });
        console.log('[theme-watcher] globals.css 재생성 완료');

        // globals.css 변경을 Vite 모듈 그래프에 전달 → Tailwind CSS HMR 트리거
        // full-reload 없이 브라우저의 스타일시트만 교체됨
        server.watcher.emit('change', globalsPath);

        // fallback: Tailwind HMR이 동작하지 않을 경우 아래 주석 해제
        // server.ws.send({ type: 'full-reload' });
      } catch (err) {
        // 생성 실패 시 서버를 중단시키지 않고 경고만 출력
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[theme-watcher] CSS 재생성 실패: ${message}`);
      }
    });
  },
};

export default defineConfig({
  plugins: [tailwindcss(), react(), themeWatcherPlugin],
  resolve: {
    alias: {
      // src/@shared 는 packages/@shared 의 junction — 루트 앱과 demo 앱 동일 패턴 유지
      '@shared': path.resolve(__dirname, 'src/@shared'),
    },
    // junction을 통해 react/react-dom이 두 번 로드되는 것을 방지
    dedupe: ['react', 'react-dom'],
  },
  server: {
    proxy: {
      // 도메인별 독립 Mock API 서버로 요청을 라우팅한다.
      // 브라우저의 CORS 정책을 우회하기 위해 Vite 개발 서버가 프록시 역할을 한다.
      //
      // 서버 포트 매핑:
      //   banking-server  → 8081  (GET /accounts, /transactions, /accounts/{id}, /home, POST /transfer/execute, /auth/login)
      //   card-server     → 8082  (GET /benefits)
      //   insurance-server→ 8083  (GET /policies)
      //   giro-server     → 8084  (GET /billings)
        
      '/api/banking': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/api/card': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/api/insurance': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/api/giro': {
        target: 'http://localhost:8084',
        changeOrigin: true,
      },
    },
  },
});