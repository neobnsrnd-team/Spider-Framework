// 블록 컨트롤 UI
// - SortableBlockWrapper: 캔버스 블록 (선택/삭제/정렬)

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CMSBlock } from "../types";
import type { BlockMeta } from "../types";

// ─── 캔버스 정렬 래퍼 ────────────────────────────────────────

interface SortableBlockWrapperProps {
  block: CMSBlock;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  children: React.ReactNode;
  blockMeta: Record<string, BlockMeta>;
}

export function SortableBlockWrapper({
  block,
  isSelected,
  onSelect,
  onRemove,
  children,
  blockMeta,
}: SortableBlockWrapperProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const pd = block.padding;
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };
  const innerPaddingStyle: React.CSSProperties = pd
    ? {
        paddingTop: pd.top,
        paddingBottom: pd.bottom,
        paddingLeft: pd.left,
        paddingRight: pd.right,
      }
    : {};

  const meta = blockMeta[block.component];
  const displayName = meta?.name ?? block.component;

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation(); // main의 deselect로 버블링 방지
    onSelect();
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group border-2 rounded-lg transition-colors ${
        isSelected ? "border-primary" : "border-transparent hover:border-gray-200"
      }`}
      onClick={handleClick}
    >
      {/* 드래그 핸들 + 블록명 + 삭제 */}
      <div className="absolute -top-6 left-0 right-0 hidden group-hover:flex items-center justify-between px-2 h-6 bg-primary rounded-t text-white text-xs z-10">
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing px-1 select-none flex-1"
          onClick={(e) => e.stopPropagation()}
        >
          ⠿ {displayName}
        </span>
        <button
          className="hover:text-red-300 px-1"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          ✕
        </button>
      </div>

      <div style={innerPaddingStyle}>{children}</div>
    </div>
  );
}

