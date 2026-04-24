// src/instrumentation.ts
// Next.js 15 계측 훅 — 서버 시작 시 내장 스케줄러 초기화

export async function register() {
    // Node.js 런타임에서만 실행 (Edge Runtime·빌드 타임 제외)
    if (process.env.NEXT_RUNTIME !== 'nodejs') return;

    const { initScheduler } = await import('@/lib/scheduler');
    await initScheduler();
}
