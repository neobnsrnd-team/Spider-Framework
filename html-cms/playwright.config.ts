// playwright.config.ts
// Playwright E2E 테스트 설정 (Issue #295)

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',

    // 테스트 파일 패턴
    testMatch: '**/*.spec.ts',

    // CI 환경에서만 재시도 1회
    retries: process.env.CI ? 1 : 0,

    // Oracle 세션 충돌 방지 — 병렬 실행 비활성화
    fullyParallel: false,
    workers: 1,

    // 리포트 설정 — HTML + JUnit (CI 아티팩트용)
    reporter: [
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
        ['junit', { outputFile: 'test-results/results.xml' }],
        ['list'],
    ],

    use: {
        baseURL: 'http://localhost:3100',

        // 실패 시 트레이스 수집
        trace: 'on-first-retry',

        // 실패 시 스크린샷 자동 저장
        screenshot: 'only-on-failure',
    },

    // 뷰포트 프로파일 3종 (금융 컴포넌트 반응형 검증)
    projects: [
        {
            name: 'mobile',
            use: {
                ...devices['iPhone 14'],
                // iPhone 14 기본 뷰포트: 390×844
                // WebKit 실행파일 누락 시 Chromium으로 폴백 (로컬 환경 대응)
                defaultBrowserType: process.env.CI ? 'webkit' : 'chromium',
            },
        },
        {
            name: 'web',
            use: {
                viewport: { width: 1280, height: 800 },
            },
        },
        {
            name: 'responsive',
            use: {
                viewport: { width: 768, height: 1024 },
            },
        },
    ],

    // Next.js 개발 서버 자동 실행
    webServer: {
        command: 'npm run dev -- -p 3100',
        env: {
            AUTH_BYPASS: 'true',
            NEXT_PUBLIC_CMS_BASE_PATH: '',
            // Oracle DB 연결 정보 — 실행 환경의 .env 또는 환경변수에서 전달
            // Oracle Instant Client가 설치되어 있어야 함
            // Client 없는 환경에서만 예외적으로 ORACLE_DISABLED=true 사용
            ...(process.env.ORACLE_DISABLED === 'true' && { ORACLE_DISABLED: 'true' }),
        },
        // 헬스 엔드포인트로 확인 — DB 없는 환경(ORACLE_DISABLED)에서도 항상 200 반환
        url: 'http://localhost:3100/api/health',
        // 로컬 개발 시 기존 서버 재사용, CI에서는 항상 새로 실행
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        stdout: 'ignore',
        stderr: 'pipe',
    },
});
