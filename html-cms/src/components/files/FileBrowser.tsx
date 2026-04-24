// src/components/files/FileBrowser.tsx
// 승인된 이미지 선택 전용 브라우저 — 업로드·삭제·폴더 생성 기능 제거
// 클릭=선택 토글, 완료 버튼을 눌러야 에디터에 전송 (팝업/iframe 양쪽 지원)
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircle2, RefreshCw, CheckSquare, Square } from 'lucide-react';

import Sidebar from '@/components/files/Sidebar';
import FileCard from '@/components/files/FileCard';
import Breadcrumbs from '@/components/files/Breadcrumbs';
import type { FileItem } from '@/components/files/types';
import { nextApi } from '@/lib/api-url';

export type { FileItem } from '@/components/files/types';

interface FolderNode {
    name: string;
    path: string;
    children?: FolderNode[];
    isExpanded?: boolean;
}

/** 외부 API 엔드포인트 — 조회용 2개만 유지 (업로드·삭제·폴더생성은 제거됨) */
export interface ApiEndpoints {
    folders: string;
    files: string;
}

export interface FileBrowserProps {
    apiEndpoints?: Partial<ApiEndpoints>;
    className?: string;
}

const DEFAULT_ENDPOINTS: ApiEndpoints = {
    folders: nextApi('/api/manage/folders'),
    files: nextApi('/api/manage/files'),
};

export default function FileBrowser({ apiEndpoints = {}, className = '' }: FileBrowserProps) {
    const endpoints = { ...DEFAULT_ENDPOINTS, ...apiEndpoints };

    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [currentPath, setCurrentPath] = useState('');
    const [folderTree, setFolderTree] = useState<FolderNode[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

    const loaderRef = useRef<HTMLDivElement>(null);
    const isFetchingRef = useRef(false);

    // ── 폴더 트리 조회 ──────────────────────────────────────────
    const fetchFolderTree = useCallback(async () => {
        try {
            const res = await fetch(endpoints.folders);
            if (!res.ok) throw new Error('폴더 목록을 불러오지 못했습니다.');
            const data = await res.json();
            setFolderTree(data.folders || []);
        } catch (err: unknown) {
            console.error('폴더 트리 로드 실패:', err);
        }
    }, [endpoints.folders]);

    // ── 파일 목록 조회 (페이지네이션) ───────────────────────────
    const fetchFiles = useCallback(
        async (pageNum: number, path: string) => {
            if (isFetchingRef.current) return;

            try {
                isFetchingRef.current = true;
                const pathParam = path ? `&path=${encodeURIComponent(path)}` : '';
                const res = await fetch(`${endpoints.files}?page=${pageNum}${pathParam}`);
                if (!res.ok) throw new Error('파일 목록을 불러오지 못했습니다.');
                const data = await res.json();

                setFiles((prev) => (pageNum === 1 ? data.files : [...prev, ...data.files]));
                setHasMore(data.hasMore);
                setPage(pageNum);
            } catch (err: unknown) {
                setError('파일 로드 실패');
                console.error('파일 로드 오류:', err);
            } finally {
                isFetchingRef.current = false;
                setLoading(false);
            }
        },
        [endpoints.files],
    );

    // ── 선택 토글 ───────────────────────────────────────────────
    const toggleFileSelection = (fileUrl: string) => {
        setSelectedFiles((prev) => {
            const next = new Set(prev);
            if (next.has(fileUrl)) next.delete(fileUrl);
            else next.add(fileUrl);
            return next;
        });
    };

    // 현재 페이지 전체 선택/해제 토글
    const toggleSelectAll = () => {
        const imageUrls = files.filter((f) => !f.isDirectory).map((f) => f.url);
        const allSelected = imageUrls.every((url) => selectedFiles.has(url));

        setSelectedFiles((prev) => {
            const next = new Set(prev);
            if (allSelected) {
                imageUrls.forEach((url) => next.delete(url));
            } else {
                imageUrls.forEach((url) => next.add(url));
            }
            return next;
        });
    };

    // ── 파일 카드 클릭 — 선택 토글만 수행 (팝업 자동 닫기 없음) ──
    const handleFileClick = (file: FileItem, e: React.MouseEvent) => {
        e.preventDefault();
        if (file.isDirectory) {
            // 서버 응답의 상대 경로 사용 — URL 파싱 불필요
            setCurrentPath(file.path);
            return;
        }
        toggleFileSelection(file.url);
    };

    // ── 완료 — 선택한 이미지 URL 들을 에디터로 전송 ─────────────
    const handleConfirm = () => {
        const urls = Array.from(selectedFiles);
        if (urls.length === 0) return;

        const msg = { type: 'ASSETS_SELECTED', urls };

        // 팝업으로 열렸으면 opener, iframe이면 parent 로 전송
        if (window.opener) {
            window.opener.postMessage(msg, '*');
            window.close();
        } else if (window.parent && window.parent !== window) {
            window.parent.postMessage(msg, '*');
        } else {
            // 정상 케이스는 아님 — 단독 창 접근 시 콘솔 경고만
            console.warn('부모 창을 찾지 못해 이미지를 전송할 수 없습니다.', msg);
        }
    };

    // 브레드크럼 경로 이동
    const navigateToBreadcrumb = (index: number) => {
        if (index === 0) {
            setCurrentPath('');
            return;
        }
        const pathParts = currentPath.split('/');
        setCurrentPath(pathParts.slice(0, index).join('/'));
    };

    const handleRefresh = async () => {
        setLoading(true);
        setFiles([]);
        setPage(1);
        setHasMore(true);
        isFetchingRef.current = false;
        await fetchFiles(1, currentPath);
        await fetchFolderTree();
    };

    // 폴더 트리 최초 로드
    useEffect(() => {
        fetchFolderTree();
    }, [fetchFolderTree]);

    // 경로 변경 시 파일 리로드 (선택 상태는 유지 — 폴더 이동해도 선택은 누적)
    useEffect(() => {
        setLoading(true);
        setFiles([]);
        setPage(1);
        setHasMore(true);
        isFetchingRef.current = false;
        fetchFiles(1, currentPath);
    }, [currentPath, fetchFiles]);

    // 무한 스크롤
    useEffect(() => {
        const currentLoader = loaderRef.current;
        if (!currentLoader || !hasMore || loading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isFetchingRef.current) {
                    fetchFiles(page + 1, currentPath);
                }
            },
            { threshold: 0.1 },
        );

        observer.observe(currentLoader);

        return () => {
            if (currentLoader) {
                observer.unobserve(currentLoader);
            }
        };
    }, [page, hasMore, loading, currentPath, fetchFiles]);

    // 현재 페이지의 (디렉토리 제외) 이미지가 모두 선택되었는지
    const currentImageUrls = files.filter((f) => !f.isDirectory).map((f) => f.url);
    const allSelected = currentImageUrls.length > 0 && currentImageUrls.every((url) => selectedFiles.has(url));

    if (loading && page === 1) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500">이미지 불러오는 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className={`h-screen bg-gray-50 flex ${className}`}>
            {/* 사이드바 — 폴더 트리 */}
            <div className="h-full w-64 shrink-0 overflow-hidden">
                <div
                    className={`h-full bg-white shadow transition-transform duration-300 ease-in-out ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <Sidebar
                        folderTree={folderTree}
                        currentPath={currentPath}
                        onFolderClick={setCurrentPath}
                        expandedFolders={expandedFolders}
                        onToggleFolder={(path) => {
                            setExpandedFolders((prev) => {
                                const newSet = new Set(prev);
                                if (newSet.has(path)) newSet.delete(path);
                                else newSet.add(path);
                                return newSet;
                            });
                        }}
                    />
                </div>
            </div>

            {/* 메인 영역 */}
            <div className="flex flex-col flex-1">
                {/* 상단 헤더 — 브레드크럼 + 액션 버튼 */}
                <div className="shrink-0 pt-4 pb-2 px-4 md:pt-8 md:pb-4 md:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Breadcrumbs
                                currentPath={currentPath}
                                navigateToBreadcrumb={navigateToBreadcrumb}
                                rootName={folderTree[0]?.name ?? ''}
                            />
                            {selectedFiles.size > 0 && (
                                <span className="text-sm font-medium text-[#0046A4] bg-[#EBF4FF] px-3 py-1 rounded-full">
                                    {selectedFiles.size}개 선택됨
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Refresh */}
                            <button
                                onClick={handleRefresh}
                                className="flex items-center gap-2 px-4 py-2 bg-[#F0F4FF] text-[#0046A4] border border-[#C7D8F4] rounded-lg hover:bg-[#EBF4FF] hover:border-[#0046A4] transition-colors cursor-pointer"
                                title="새로고침"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span className="text-sm">새로고침</span>
                            </button>

                            {/* 전체 선택 토글 */}
                            {currentImageUrls.length > 0 && (
                                <button
                                    onClick={toggleSelectAll}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#F0F4FF] text-[#0046A4] border border-[#C7D8F4] rounded-lg hover:bg-[#EBF4FF] hover:border-[#0046A4] transition-colors cursor-pointer"
                                >
                                    {allSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                                    <span className="text-sm">{allSelected ? '전체 해제' : '전체 선택'}</span>
                                </button>
                            )}

                            {/* 완료 */}
                            <button
                                onClick={handleConfirm}
                                disabled={selectedFiles.size === 0}
                                className="flex items-center gap-2 px-4 py-2 bg-[#0046A4] text-white rounded-lg hover:bg-[#003399] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-sm">완료</span>
                            </button>

                            {/* 사이드바 토글 햄버거 */}
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="text-gray-600 hover:text-gray-900 p-2 cursor-pointer"
                                title="사이드바 토글"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 파일 그리드 (스크롤) */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {files.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                            <p className="font-medium">승인된 이미지가 없습니다.</p>
                            <p className="text-sm mt-1">Spider Admin에서 이미지를 승인한 뒤 다시 시도해주세요.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
                                {files.map((file, index) => (
                                    <FileCard
                                        key={`${file.url}-${index}`}
                                        file={file}
                                        isSelected={selectedFiles.has(file.url)}
                                        selectionMode={true}
                                        onClick={handleFileClick}
                                        priority={index < 5}
                                    />
                                ))}
                            </div>

                            {hasMore && (
                                <div ref={loaderRef} className="flex justify-center py-8">
                                    <div className="text-gray-500 text-sm">더 불러오는 중...</div>
                                </div>
                            )}

                            {!hasMore && files.length > 0 && (
                                <div className="flex justify-center py-8 text-gray-400 text-sm">
                                    모든 이미지를 불러왔습니다.
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
