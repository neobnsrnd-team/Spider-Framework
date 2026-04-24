// src/components/files/types.ts

export interface FileItem {
    name: string;
    url: string;
    /** 이미지 루트 기준 상대 경로 — 하위 폴더 이동 시 사용 (정규식 파싱 불필요) */
    path: string;
    isDirectory: boolean;
    size: number;
}
