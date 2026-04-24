// src/components/files/FileCard.tsx
'use client';

import Image from 'next/image';
import { Check, Folder } from 'lucide-react';
import type { FileItem } from '@/components/files/types';

export interface FileCardProps {
    file: FileItem;
    isSelected: boolean;
    selectionMode: boolean;
    onClick: (file: FileItem, e: React.MouseEvent) => void;
    priority?: boolean;
}

export default function FileCard({ file, isSelected, selectionMode, onClick, priority }: FileCardProps) {
    const getFileIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase() || '';
        const iconClass = 'w-16 h-16 text-gray-400';

        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
            return null;
        }

        if (['mp4', 'mov', 'avi', 'webm'].includes(ext)) {
            return (
                <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                </svg>
            );
        }

        if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
            return (
                <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
            );
        }

        if (['pdf'].includes(ext)) {
            return (
                <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
            );
        }

        return (
            <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
        );
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const parent = target.parentElement;
        if (parent) {
            parent.innerHTML =
                '<div class="w-full h-full flex items-center justify-center"><svg class="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>';
        }
    };

    return (
        <div
            onClick={(e) => onClick(file, e)}
            className={`group cursor-pointer rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 relative ${
                isSelected ? 'ring-2 ring-[#0046A4] bg-[#EBF4FF]' : 'bg-white'
            }`}
        >
            {/* 선택 체크 배지 — 디렉토리 제외, 선택 모드 ON 시 표시 */}
            {selectionMode && !file.isDirectory && (
                <div className="absolute top-2 left-2 z-10">
                    <div
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shadow ${
                            isSelected ? 'bg-[#0046A4] border-[#0046A4]' : 'bg-white border-gray-300'
                        }`}
                    >
                        {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                    </div>
                </div>
            )}

            <div className="aspect-square flex items-center justify-center bg-gray-100 relative">
                {file.isDirectory ? (
                    <Folder className="w-16 h-16 text-black-300" strokeWidth={1} />
                ) : (
                    getFileIcon(file.name) || (
                        <Image
                            src={file.url}
                            alt={file.name}
                            width={300}
                            height={300}
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                            // 승인 이미지는 nginx 가 직접 서빙(운영) 또는 public 정적 서빙(로컬).
                            // Next.js 최적화 endpoint(/_next/image)가 컨테이너 내부에서 파일을
                            // 다시 fetch 할 때 운영 nginx 리라이트 경로를 통과하지 못해
                            // 미리보기가 깨짐 → unoptimized 로 브라우저가 원본 URL 을 직접 로드하게 함
                            unoptimized
                            priority={priority}
                        />
                    )
                )}
            </div>
            <div className="p-2">
                <p className="text-xs text-gray-600 truncate group-hover:text-gray-900 transition-colors">
                    {file.name}
                </p>
            </div>
        </div>
    );
}
