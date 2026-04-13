import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    /* 빌드 시 dist/index.d.ts 자동 생성.
     * rollupTypes: true → 분산된 .d.ts를 단일 파일로 번들링하여 배포 크기 최소화 */
    dts({
      include:     ['packages/component-library', 'lib'],
      outDir:      'dist',
      rollupTypes: true,
    }),
  ],

  build: {
    /* 라이브러리 모드: 단일 진입점 → dist/index.js */
    lib: {
      entry:    resolve(__dirname, 'packages/component-library/index.ts'),
      name:     'ReactPageForgeComponentLibrary',
      formats:  ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      /* React/lucide는 고객 프로젝트에서 제공하므로 번들에서 제외 */
      external: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react'],
      output: {
        globals: {
          react:          'React',
          'react-dom':    'ReactDOM',
          'lucide-react': 'LucideReact',
        },
      },
    },
    sourcemap: false,
  },

  resolve: {
    alias: {
      '@lib': resolve(__dirname, 'lib'),
    },
  },
});