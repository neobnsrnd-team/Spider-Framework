import type { NextConfig } from 'next';

const cmsBasePath = process.env.NEXT_PUBLIC_CMS_BASE_PATH ?? '/cms';

const nextConfig: NextConfig = {
    ...(cmsBasePath
        ? {
              basePath: cmsBasePath,
              assetPrefix: cmsBasePath,
          }
        : {}),
    // oracledb native 모듈을 번들링하지 않고 외부에서 로드 (Thick 모드 지원)
    serverExternalPackages: ['oracledb', 'node-cron'],
    // Docker 배포용 standalone 빌드 — .next/standalone/server.js 생성
    output: 'standalone',
    // basePath('/cms') 없이 접근하는 외부 시스템(spider-admin 배치 실행) 경로 우회
    async rewrites() {
        return [{ source: '/api/batch/execute', destination: '/cms/api/batch/execute' }];
    },
    webpack(config, { nextRuntime }) {
        // edge 런타임 빌드 시 Node.js 전용 모듈 번들 오류 방지
        // instrumentation.ts → scheduler.ts → (repository 체인) 경로에서
        // serverExternalPackages는 nodejs 런타임에만 적용되므로 edge용으로 별도 처리
        if (nextRuntime === 'edge') {
            // Node.js 내장 모듈 — 빈 모듈(false)로 처리하여 resolve 오류 방지
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                'fs/promises': false,
                path: false,
                stream: false,
                'stream/promises': false,
                crypto: false,
                os: false,
                events: false,
                util: false,
                buffer: false,
                net: false,
                tls: false,
                http: false,
                https: false,
                zlib: false,
                assert: false,
                url: false,
                worker_threads: false,
            };

            // Node.js 전용 npm 패키지 — commonjs external로 처리
            // (실제 edge 실행은 instrumentation.ts register() 상단 NEXT_RUNTIME 가드로 차단)
            const nodeOnlyPackages = new Set(['oracledb', 'node-cron']);
            const existingExternals = config.externals;
            config.externals = [
                ...(Array.isArray(existingExternals)
                    ? existingExternals
                    : existingExternals
                      ? [existingExternals]
                      : []),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (data: { request?: string }, callback: (err?: Error | null, result?: string) => void) => {
                    if (data.request && nodeOnlyPackages.has(data.request.split('/')[0])) {
                        return callback(null, `commonjs ${data.request}`);
                    }
                    callback();
                },
            ];
        }
        return config;
    },
};

export default nextConfig;
