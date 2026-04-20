/**
 * @file useDragSort.ts
 * @description dnd-kit 기반 드래그&드롭 정렬 훅.
 * 블록 순서 변경(단일 레벨 평탄 목록)에만 사용하며, 중첩 구조는 지원하지 않습니다.
 *
 * @param options.onReorder 정렬 완료 시 호출할 콜백 (oldIndex, newIndex)
 * @param options.ids 정렬 대상 아이템 id 배열 (순서 계산에 사용)
 * @returns handleDragEnd dnd-kit DragEndEvent 핸들러
 */
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
