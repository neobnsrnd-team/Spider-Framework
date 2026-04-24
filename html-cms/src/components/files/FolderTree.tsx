// src/components/files/FolderTree.tsx

import { ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react';

interface FolderNode {
    name: string;
    path: string;
    children?: FolderNode[];
}

interface FolderTreeProps {
    nodes: FolderNode[];
    currentPath: string;
    onFolderClick: (path: string) => void;
    expandedFolders: Set<string>;
    onToggleFolder: (path: string) => void;
    level?: number;
}

export default function FolderTree({
    nodes,
    currentPath,
    onFolderClick,
    expandedFolders,
    onToggleFolder,
    level = 0,
}: FolderTreeProps) {
    return (
        <>
            {nodes.map((node) => {
                const isExpanded = expandedFolders.has(node.path);
                const isActive = currentPath === node.path;

                return (
                    <div key={node.path}>
                        <div
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
                                isActive
                                    ? 'bg-[#EBF4FF] text-[#0046A4] font-medium'
                                    : 'hover:bg-[#EBF4FF] hover:text-[#0046A4] text-gray-700'
                            }`}
                            style={{ paddingLeft: `${level * 12 + 12}px` }}
                        >
                            {node.children?.length ? (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleFolder(node.path);
                                    }}
                                    className="p-0.5 hover:bg-[#C7D8F4] rounded flex-shrink-0 cursor-pointer"
                                >
                                    {isExpanded ? (
                                        <ChevronDown className="w-4 h-4" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4" />
                                    )}
                                </button>
                            ) : (
                                // 하위 폴더 없을 땐 클릭 불가능한 placeholder (hover 음영 없음)
                                <div className="p-0.5 flex-shrink-0">
                                    <div className="w-4 h-4" />
                                </div>
                            )}
                            <div
                                onClick={() => onFolderClick(node.path)}
                                className="flex items-center gap-2 flex-1 min-w-0"
                            >
                                {isExpanded ? (
                                    <FolderOpen className="w-4 h-4 flex-shrink-0" />
                                ) : (
                                    <Folder className="w-4 h-4 flex-shrink-0" />
                                )}
                                <span className="text-sm truncate">{node.name}</span>
                            </div>
                        </div>
                        {isExpanded && node.children && (
                            <FolderTree
                                nodes={node.children}
                                currentPath={currentPath}
                                onFolderClick={onFolderClick}
                                expandedFolders={expandedFolders}
                                onToggleFolder={onToggleFolder}
                                level={level + 1}
                            />
                        )}
                    </div>
                );
            })}
        </>
    );
}
