// 드래그&드롭 정렬 훅 (dnd-kit 기반)
// 블록 순서 변경만 지원합니다 (중첩 구조 없음).
import type { DragEndEvent } from "@dnd-kit/core";

interface UseDragSortOptions {
  onReorder: (oldIndex: number, newIndex: number) => void;
  ids: string[];
}

export function useDragSort({ onReorder, ids }: UseDragSortOptions) {
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ids.indexOf(active.id as string);
    const newIndex = ids.indexOf(over.id as string);

    if (oldIndex !== -1 && newIndex !== -1) {
      onReorder(oldIndex, newIndex);
    }
  }

  return { handleDragEnd };
}
