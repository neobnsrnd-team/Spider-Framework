/**
 * @file LeftSidebar.tsx
 * @description 좌측 사이드바 — 블록 탭(Components) + 오버레이 탭(Overlays).
 * 상단 탭으로 두 패널을 전환합니다.
 */
import { useState } from "react";
import { BlockPalette } from "./BlockPalette";
import { OverlayPalette } from "./OverlayPalette";
import type { BlockMeta, OverlayTemplate, CMSBlock, CMSOverlay } from "../types";
import React from "react";

interface LeftSidebarProps {
  onAdd: (type: string) => void;
  blockMeta: Record<string, BlockMeta>;
  blockRegistry: Record<string, React.ComponentType<Record<string, unknown>>>;
  // 오버레이
  overlayTemplates: OverlayTemplate[];
  overlays: CMSOverlay[];
  editingOverlayId: string | null;
  onAddOverlayFromTemplate: (type: CMSOverlay["type"], blocks: CMSBlock[], defaultId?: string, defaultProps?: Record<string, unknown>) => void;
  onRemoveOverlay: (id: string) => void;
  onRenameOverlay: (oldId: string, newId: string) => void;
  onEnterOverlay: (id: string) => void;
  onExitOverlay: () => void;
}

type SidebarTab = "blocks" | "overlays";

/**
 * 블록 팔레트 + 오버레이 탭 좌측 사이드바.
 * React.memo로 감싸 관련 props가 바뀌지 않으면 리렌더링을 건너뜁니다.
 */
const LeftSidebar = React.memo(function LeftSidebar({
  onAdd,
  blockMeta,
  blockRegistry,
  overlayTemplates,
  overlays,
  editingOverlayId,
  onAddOverlayFromTemplate,
  onRemoveOverlay,
  onRenameOverlay,
  onEnterOverlay,
  onExitOverlay,
}: LeftSidebarProps) {
  const [activeTab, setActiveTab] = useState<SidebarTab>("blocks");
  const [search, setSearch] = useState("");

  return (
    <aside className="w-60 flex-shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col overflow-hidden">
      {/* ── 탭 헤더 ── */}
      <div className="flex border-b border-gray-200 bg-white flex-shrink-0">
        <SidebarTabButton
          active={activeTab === "blocks"}
          onClick={() => setActiveTab("blocks")}
        >
          블록
        </SidebarTabButton>
        <SidebarTabButton
          active={activeTab === "overlays"}
          onClick={() => setActiveTab("overlays")}
          badge={overlays.length > 0 ? overlays.length : undefined}
        >
          오버레이
        </SidebarTabButton>
      </div>

      {/* ── 블록 탭 ── */}
      {activeTab === "blocks" && (
        <>
          <div className="p-3 border-b border-gray-200 bg-white flex-shrink-0">
            <input
              type="text"
              placeholder="블록 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <BlockPalette
              onAdd={onAdd}
              filter={search || undefined}
              blockMeta={blockMeta}
              blockRegistry={blockRegistry}
            />
          </div>
        </>
      )}

      {/* ── 오버레이 탭 ── */}
      {activeTab === "overlays" && (
        <OverlayPalette
          overlayTemplates={overlayTemplates}
          overlays={overlays}
          editingOverlayId={editingOverlayId}
          onAddOverlayFromTemplate={onAddOverlayFromTemplate}
          onRemoveOverlay={onRemoveOverlay}
          onRenameOverlay={onRenameOverlay}
          onEnterOverlay={onEnterOverlay}
          onExitOverlay={onExitOverlay}
        />
      )}

      {/* ── 하단 힌트 ── */}
      <div className="px-3 py-2 border-t border-gray-200 bg-white text-xs text-gray-400 text-center flex-shrink-0">
        {editingOverlayId
          ? `오버레이 편집 중: ${editingOverlayId}`
          : activeTab === "blocks"
          ? "드래그하거나 클릭해서 추가"
          : "오버레이를 선택해 편집"}
      </div>
    </aside>
  );
});

export default LeftSidebar;

// ── 탭 버튼 ────────────────────────────────────────────────────────────────────

function SidebarTabButton({
  children,
  active,
  onClick,
  badge,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      className={`flex-1 py-2.5 text-xs font-medium transition-colors relative ${
        active ? "text-primary border-b-2 border-primary bg-white" : "text-gray-500 hover:text-gray-700"
      }`}
      onClick={onClick}
    >
      {children}
      {badge !== undefined && (
        <span className="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full font-normal">
          {badge}
        </span>
      )}
    </button>
  );
}
