/**
 * @file vite.lib.config.js
 * @description 컴포넌트 라이브러리 npm 배포용 빌드 설정.
 *
 * - 진입점: packages/component-library/index.ts
 * - 출력: dist/index.js (ESM), dist/index.d.ts (타입 선언)
 * - @lib alias: lib/ 폴더를 빌드 시 resolve → dist에 인라인 번들됨
 * - react, react-dom: 번들에서 제외 (고객사 프로젝트에 이미 존재)
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    dts({
      include: ['packages/component-library', 'lib'],
      // Storybook 파일은 배포 결과물에 불필요하므로 타입 선언 생성에서 제외
      exclude: ['**/*.stories.tsx', '**/*.stories.ts'],
      outDir: 'dist',
      // IDE/typecheck용 tsconfig.json(noEmit:true)와 분리된 빌드 전용 설정 사용
      tsconfigPath: './tsconfig.build.json',
      // 분산된 .d.ts 파일들을 dist/index.d.ts 단일 파일로 번들링
      // → package.json의 "types": "./dist/index.d.ts"가 실제 파일을 가리키게 됨
      rollupTypes: true,
    }),
  ],
  resolve: {
    alias: {
      // lib/cn.ts 등 내부 유틸리티 경로 — 빌드 시 dist에 인라인 번들됨
      '@lib': resolve(__dirname, 'lib'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'packages/component-library/index.ts'),
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      // 고객사 프로젝트에 반드시 존재하는 패키지는 번들에서 제외
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
