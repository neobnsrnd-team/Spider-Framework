// src/lib/page-file.ts
// 페이지 HTML 파일 읽기 유틸리티 (서버 전용 — API Route, 서버 컴포넌트에서만 사용)
// 기존 데이터 호환용 폴백 — PAGE_HTML NULL인 레거시 페이지 지원
//
// ※ fs/promises, path는 함수 내부에서 dynamic import — webpack 정적 번들 포함 방지
//   (instrumentation.ts → scheduler.ts → page.repository.ts → 이 파일 체인에서 빌드 오류 방지)

/** FILE_PATH 기반 HTML 파일 읽기. 파일 없으면 null 반환. */
export async function readPageHtml(filePath: string): Promise<string | null> {
    const { default: fs } = await import('fs/promises');
    const { default: path } = await import('path');
    const fullPath = path.join(process.cwd(), 'public', filePath);
    try {
        return await fs.readFile(fullPath, 'utf-8');
    } catch {
        return null;
    }
}
