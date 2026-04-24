// src/components/files/Breadcrumbs.tsx
'use client';

import { ChevronRight } from 'lucide-react';

export interface BreadcrumbsProps {
    currentPath: string;
    navigateToBreadcrumb: (index: number) => void;
    /** 루트 폴더 표시명 (env.DEPLOYED_IMG_SUBDIR 가 folders API 응답에서 주입됨) */
    rootName: string;
}

export default function Breadcrumbs({ currentPath, navigateToBreadcrumb, rootName }: BreadcrumbsProps) {
    // 루트 이름은 폴더 트리 루트 노드와 동일 — 파일시스템 이름 그대로
    // 하위 폴더가 생기면 '<rootName> > sub1 > sub2' 형태로 누적 표시
    const getBreadcrumbs = () => (currentPath ? [rootName, ...currentPath.split('/')] : [rootName]);

    return (
        <div className="flex items-center gap-2 text-sm text-gray-500">
            {getBreadcrumbs().map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                    {index > 0 && <ChevronRight className="w-4 h-4" />}
                    <button
                        onClick={() => navigateToBreadcrumb(index)}
                        className={`hover:text-[#0046A4] transition-colors ${
                            index === getBreadcrumbs().length - 1 ? 'text-[#0046A4] font-medium' : 'cursor-pointer'
                        }`}
                    >
                        {crumb}
                    </button>
                </div>
            ))}
        </div>
    );
}
