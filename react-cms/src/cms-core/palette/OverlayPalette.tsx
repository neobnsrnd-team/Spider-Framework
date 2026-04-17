/**
 * @file OverlayPalette.tsx
 * @description 오버레이 팔레트 컴포넌트. 오버레이 템플릿 카탈로그와 페이지 오버레이 목록으로 구성됩니다.
 */
import { useState, useRef, useEffect } from "react";
import type { OverlayTemplate, CMSBlock, CMSOverlay } from "../types";

// ── 오버레이 팔레트 (통합) ──────────────────────────────────────────────────────

export interface OverlayPaletteProps {
  overlayTemplates: OverlayTemplate[];
  overlays: CMSOverlay[];
  editingOverlayId: string | null;
  onAddOverlayFromTemplate: (type: CMSOverlay["type"], blocks: CMSBlock[], defaultId?: string, defaultProps?: Record<string, unknown>) => void;
  onRemoveOverlay: (id: string) => void;
  onRenameOverlay: (oldId: string, newId: string) => void;
  onEnterOverlay: (id: string) => void;
  onExitOverlay: () => void;
}

/**
 * @description 오버레이 팔레트.
 * 상단의 템플릿 카탈로그에서 오버레이를 추가하고, 하단의 목록에서 편집·삭제·이름 변경을 할 수 있습니다.
 */
export function OverlayPalette({
  overlayTemplates,
  overlays,
  editingOverlayId,
  onAddOverlayFromTemplate,
  onRemoveOverlay,
  onRenameOverlay,
  onEnterOverlay,
  onExitOverlay,
}: OverlayPaletteProps) {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      <OverlayCatalog
        overlayTemplates={overlayTemplates}
        onAddOverlayFromTemplate={onAddOverlayFromTemplate}
      />
      <OverlayList
        overlays={overlays}
        editingOverlayId={editingOverlayId}
        onEnterOverlay={onEnterOverlay}
        onExitOverlay={onExitOverlay}
        onRemoveOverlay={onRemoveOverlay}
        onRenameOverlay={onRenameOverlay}
      />
    </div>
  );
}

// ── 오버레이 템플릿 카탈로그 ────────────────────────────────────────────────────

interface OverlayCatalogProps {
  overlayTemplates: OverlayTemplate[];
  onAddOverlayFromTemplate: (type: CMSOverlay["type"], blocks: CMSBlock[], defaultId?: string, defaultProps?: Record<string, unknown>) => void;
}

/**
 * @description 오버레이 템플릿 카탈로그.
 * 등록된 OverlayTemplate 목록을 표시하고, 클릭 시 페이지에 오버레이를 추가합니다.
 */
export function OverlayCatalog({ overlayTemplates, onAddOverlayFromTemplate }: OverlayCatalogProps) {
  const [open, setOpen] = useState(true);

  function handleTemplate(tpl: OverlayTemplate) {
    onAddOverlayFromTemplate(tpl.type, tpl.blocks as CMSBlock[], tpl.defaultId, tpl.props);
  }

  if (overlayTemplates.length === 0) {
    return (
      <div className="border-b border-gray-200 px-3 py-3">
        <p className="text-xs text-gray-400 text-center">등록된 오버레이 템플릿이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wide hover:bg-gray-100 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <span>템플릿</span>
        <span className="text-gray-400">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-2 pb-2 flex flex-col gap-1">
          {overlayTemplates.map((tpl) => (
            <button
              key={tpl.id}
              title={tpl.description}
              onClick={() => handleTemplate(tpl)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-dashed border-gray-300 text-left hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <span className="text-base shrink-0">▣</span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-700 leading-tight">{tpl.label}</p>
                {tpl.description && (
                  <p className="text-[10px] text-gray-400 leading-tight truncate">{tpl.description}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── 현재 페이지 오버레이 목록 ────────────────────────────────────────────────

interface OverlayListProps {
  overlays: CMSOverlay[];
  editingOverlayId: string | null;
  onEnterOverlay: (id: string) => void;
  onExitOverlay: () => void;
  onRemoveOverlay: (id: string) => void;
  onRenameOverlay: (oldId: string, newId: string) => void;
}

/**
 * @description 페이지 오버레이 목록.
 * 오버레이를 클릭해 편집 모드로 진입하고, 더블클릭으로 이름 변경, ✕ 버튼으로 삭제합니다.
 */
export function OverlayList({
  overlays,
  editingOverlayId,
  onEnterOverlay,
  onExitOverlay,
  onRemoveOverlay,
  onRenameOverlay,
}: OverlayListProps) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renamingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [renamingId]);

  function startRename(id: string) {
    setRenamingId(id);
    setRenameValue(id);
  }

  function commitRename() {
    if (renamingId) onRenameOverlay(renamingId, renameValue);
    setRenamingId(null);
  }

  function cancelRename() {
    setRenamingId(null);
  }

  return (
    <div className="flex-1 p-2 flex flex-col gap-1">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1 mb-1">
        페이지 오버레이
      </p>

      {overlays.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">
          위 템플릿에서 추가하세요
        </p>
      ) : (
        overlays.map((overlay) => {
          const isEditing = overlay.id === editingOverlayId;
          const isRenaming = overlay.id === renamingId;

          return (
            <div
              key={overlay.id}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                isEditing
                  ? "bg-amber-50 border border-amber-200"
                  : "bg-white hover:bg-gray-50 border border-gray-200"
              }`}
              onClick={() => {
                if (!isRenaming) {
                  isEditing ? onExitOverlay() : onEnterOverlay(overlay.id);
                }
              }}
            >
              <span className={`shrink-0 ${isEditing ? "text-amber-600" : "text-gray-500"}`}>▣</span>

              {isRenaming ? (
                <input
                  ref={inputRef}
                  className="flex-1 text-xs px-1 py-0.5 border border-primary rounded focus:outline-none min-w-0 font-mono"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={commitRename}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitRename();
                    if (e.key === "Escape") cancelRename();
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span
                  className={`flex-1 truncate font-mono ${isEditing ? "text-amber-700" : "text-gray-700"}`}
                  onDoubleClick={(e) => { e.stopPropagation(); startRename(overlay.id); }}
                  title="더블클릭으로 이름 변경"
                >
                  {overlay.id}
                </span>
              )}

              <span className="shrink-0 text-gray-400">{overlay.blocks.length}</span>

              <button
                className="shrink-0 text-gray-300 hover:text-red-400 transition-colors"
                onClick={(e) => { e.stopPropagation(); onRemoveOverlay(overlay.id); }}
                title="삭제"
              >
                ✕
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}
