/**
 * @file RightSidebar.tsx
 * @description 우측 인스펙터 사이드바.
 * 속성 / 레이아웃(또는 오버레이) / JSON 탭 구조.
 * 오버레이 편집 모드에서는 레이아웃 탭이 오버레이 탭으로 전환됩니다.
 * 각 탭 콘텐츠는 PropsEditor / LayoutEditor / OverlayEditor로 분리됩니다.
 */
import React from "react";
import type {
  BlockInteraction,
  BlockPadding,
  CMSBlock,
  CMSOverlay,
  OverlayTemplate,
} from "../types";
import type { BlockMeta } from "../types";
import type { CMSPage } from "../types";
import PropsEditor from "./PropsEditor";
import LayoutEditor from "./LayoutEditor";
import OverlayEditor from "./OverlayEditor";
import { pageToJson } from "../codegen/exportJson";

export type RightSidebarTab = "props" | "layout" | "json";

interface RightSidebarProps {
  selectedBlock: CMSBlock | null;
  layoutType: string | undefined;
  layoutProps: Record<string, unknown>;
  page: CMSPage;
  overlays: CMSOverlay[];
  overlayTemplates: OverlayTemplate[];
  editingOverlay?: CMSOverlay;
  activeTab: RightSidebarTab;
  /** 오버레이 편집 모드일 때 true — 레이아웃 탭을 오버레이 탭으로 전환 */
  isEditingOverlay: boolean;
  onTabChange: (tab: RightSidebarTab) => void;
  onPropsChange: (newProps: Record<string, unknown>) => void;
  onPaddingChange: (padding: BlockPadding) => void;
  onInteractionChange: (interaction: BlockInteraction) => void;
  onOverlayPropsChange: (props: Record<string, unknown>) => void;
  onLayoutTypeChange: (type: string | undefined, defaultProps?: Record<string, unknown>) => void;
  onLayoutPropsChange: (props: Record<string, unknown>) => void;
  blockMeta: Record<string, BlockMeta>;
}

/**
 * 속성/레이아웃/JSON 탭 인스펙터.
 * React.memo로 감싸 selectedBlock 등 관련 props가 바뀌지 않으면 리렌더링을 건너뜁니다.
 */
const RightSidebar = React.memo(function RightSidebar({
  selectedBlock,
  layoutType,
  layoutProps,
  page,
  overlays,
  overlayTemplates,
  editingOverlay,
  activeTab,
  isEditingOverlay,
  onTabChange,
  onPropsChange,
  onPaddingChange,
  onInteractionChange,
  onOverlayPropsChange,
  onLayoutTypeChange,
  onLayoutPropsChange,
  blockMeta,
}: RightSidebarProps) {
  const overlayTemplate = editingOverlay
    ? overlayTemplates.find((t) => t.defaultId === editingOverlay.id)
    : undefined;

  return (
    <aside className="w-72 flex-shrink-0 border-l border-gray-200 bg-white flex flex-col overflow-hidden">
      {/* 탭 헤더 */}
      <div className="flex border-b border-gray-200">
        <TabButton active={activeTab === "props"} onClick={() => onTabChange("props")}>
          속성
        </TabButton>
        {/* 오버레이 편집 모드: 레이아웃 탭 → 오버레이 탭 */}
        <TabButton active={activeTab === "layout"} onClick={() => onTabChange("layout")}>
          {isEditingOverlay ? "오버레이" : "레이아웃"}
        </TabButton>
        <TabButton active={activeTab === "json"} onClick={() => onTabChange("json")}>
          JSON
        </TabButton>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="flex-1 overflow-y-auto">
        {/* 속성 탭: 블록 선택 시 블록 편집, 미선택 시 안내 */}
        {activeTab === "props" && (
          selectedBlock ? (
            <PropsEditor
              block={selectedBlock}
              onChange={onPropsChange}
              onPaddingChange={onPaddingChange}
              blockMeta={blockMeta}
              overlays={overlays}
              onInteractionChange={onInteractionChange}
            />
          ) : (
            <PropsEmpty
              message={
                isEditingOverlay
                  ? <>블록을 클릭하면<br />속성을 편집할 수 있습니다</>
                  : undefined
              }
            />
          )
        )}

        {/* 레이아웃 탭 (일반 모드) */}
        {activeTab === "layout" && !isEditingOverlay && (
          <LayoutEditor
            layoutType={layoutType}
            layoutProps={layoutProps}
            onLayoutTypeChange={onLayoutTypeChange}
            onLayoutPropsChange={onLayoutPropsChange}
          />
        )}

        {/* 오버레이 탭 (오버레이 편집 모드) */}
        {activeTab === "layout" && isEditingOverlay && editingOverlay && (
          <OverlayEditor
            overlay={editingOverlay}
            template={overlayTemplate}
            onChange={onOverlayPropsChange}
          />
        )}

        {activeTab === "json" && <JsonView json={pageToJson(page)} />}
      </div>
    </aside>
  );
});

export default RightSidebar;

// ── 탭 버튼 ──────────────────────────────────────────────────
const TabButton = React.memo(function TabButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
        active ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
});

// ── 블록 미선택 안내 ─────────────────────────────────────────
function PropsEmpty({ message }: { message?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-48 text-center gap-2 p-4">
      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-lg">
        ↖
      </div>
      <p className="text-sm text-gray-400">
        {message ?? (
          <>
            블록을 클릭하면
            <br />
            속성을 편집할 수 있습니다
          </>
        )}
      </p>
    </div>
  );
}

// ── JSON 뷰 ─────────────────────────────────────────────────
function JsonView({ json }: { json: string }) {
  return (
    <div className="relative h-full">
      <button
        className="absolute top-2 right-2 z-10 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600"
        onClick={() => navigator.clipboard.writeText(json)}
      >
        복사
      </button>
      <pre className="p-4 text-xs text-gray-600 overflow-auto h-full font-mono whitespace-pre-wrap break-words leading-relaxed">
        {json}
      </pre>
    </div>
  );
}
