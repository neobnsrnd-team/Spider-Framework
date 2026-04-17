/**
 * @file builderStore.ts
 * @description 빌더 상태 관리 훅.
 * 블록 추가/삭제/수정/정렬 + 레이아웃 타입/props + 오버레이 CRUD 관리.
 * editingOverlayId가 설정된 경우 블록 조작은 해당 오버레이의 blocks를 대상으로 합니다.
 */
import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import type {
  BlockInteraction,
  BlockMeta,
  BlockPadding,
  CMSBlock,
  CMSOverlay,
  CMSPage,
} from "../types";

export interface BuilderState {
  blocks: CMSBlock[];
  overlays: CMSOverlay[];
  /** 현재 캔버스에서 편집 중인 overlay id. null이면 페이지 편집 모드 */
  editingOverlayId: string | null;
  /** 현재 활성 블록 목록 — editingOverlayId가 있으면 해당 overlay의 blocks */
  activeBlocks: CMSBlock[];
  selectedBlockId: string | null;
  layoutType: string | undefined;
  layoutProps: Record<string, unknown>;
}

export interface BuilderActions {
  // 블록 (page/overlay 컨텍스트 자동 적용)
  addBlock: (type: string, atIndex?: number) => void;
  removeBlock: (id: string) => void;
  updateBlockProps: (id: string, newProps: Record<string, unknown>) => void;
  updateBlockPadding: (id: string, padding: BlockPadding) => void;
  updateBlockInteraction: (id: string, interaction: BlockInteraction) => void;
  reorderBlocks: (oldIndex: number, newIndex: number) => void;
  selectBlock: (id: string | null) => void;
  // 레이아웃
  updateLayoutType: (type: string | undefined, defaultProps?: Record<string, unknown>) => void;
  updateLayoutProps: (props: Record<string, unknown>) => void;
  // 오버레이
  addOverlay: (type: CMSOverlay["type"]) => void;
  addOverlayFromTemplate: (type: CMSOverlay["type"], templateBlocks: CMSBlock[], defaultId?: string, defaultProps?: Record<string, unknown>) => void;
  removeOverlay: (id: string) => void;
  renameOverlay: (oldId: string, newId: string) => void;
  updateOverlayProps: (id: string, props: Record<string, unknown>) => void;
  enterOverlay: (id: string) => void;
  exitOverlay: () => void;
  // 페이지 전체
  getPage: () => CMSPage;
  loadPage: (page: CMSPage) => void;
  clearBlocks: () => void;
}

const DEFAULT_LAYOUT_PROPS: Record<string, unknown> = {};

/**
 * @description CMS 빌더 전체 상태를 관리하는 훅.
 * @param blockMeta 블록 메타데이터 맵 (defaultProps 초기화에 사용)
 * @param initialPage 초기 페이지 데이터
 * @returns BuilderState & BuilderActions
 */
export function useBuilderState(
  blockMeta: Record<string, BlockMeta>,
  initialPage?: CMSPage,
): BuilderState & BuilderActions {
  const [blocks, setBlocks] = useState<CMSBlock[]>(initialPage?.blocks ?? []);
  const [overlays, setOverlays] = useState<CMSOverlay[]>(initialPage?.overlays ?? []);
  const [editingOverlayId, setEditingOverlayId] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [layoutType, setLayoutType] = useState<string | undefined>(initialPage?.layoutType);
  const [layoutProps, setLayoutProps] = useState<Record<string, unknown>>(
    initialPage?.layoutProps ?? DEFAULT_LAYOUT_PROPS,
  );

  // ─── 내부 헬퍼: 현재 컨텍스트(page/overlay) 블록 조작 ─────────────────────

  function patchPageBlock(id: string, patch: (b: CMSBlock) => CMSBlock) {
    setBlocks((prev) => prev.map((b) => (b.id === id ? patch(b) : b)));
  }

  function patchOverlayBlock(overlayId: string, blockId: string, patch: (b: CMSBlock) => CMSBlock) {
    setOverlays((prev) =>
      prev.map((o) =>
        o.id === overlayId
          ? { ...o, blocks: o.blocks.map((b) => (b.id === blockId ? patch(b) : b)) }
          : o,
      ),
    );
  }

  // ─── 블록 ────────────────────────────────────────────────────────────────────

  function addBlock(type: string, atIndex?: number) {
    const meta = blockMeta[type];
    const newBlock: CMSBlock = {
      id: crypto.randomUUID(),
      component: type,
      props: meta ? { ...meta.defaultProps } : {},
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
    };

    if (editingOverlayId) {
      setOverlays((prev) =>
        prev.map((o) => {
          if (o.id !== editingOverlayId) return o;
          const next = [...o.blocks];
          if (atIndex === undefined || atIndex >= next.length) {
            next.push(newBlock);
          } else {
            next.splice(atIndex, 0, newBlock);
          }
          return { ...o, blocks: next };
        }),
      );
    } else {
      setBlocks((prev) => {
        if (atIndex === undefined || atIndex >= prev.length) return [...prev, newBlock];
        const next = [...prev];
        next.splice(atIndex, 0, newBlock);
        return next;
      });
    }
  }

  function removeBlock(id: string) {
    if (editingOverlayId) {
      setOverlays((prev) =>
        prev.map((o) =>
          o.id === editingOverlayId ? { ...o, blocks: o.blocks.filter((b) => b.id !== id) } : o,
        ),
      );
    } else {
      setBlocks((prev) => prev.filter((b) => b.id !== id));
    }
    setSelectedBlockId((prev) => (prev === id ? null : prev));
  }

  function updateBlockProps(id: string, newProps: Record<string, unknown>) {
    const patch = (b: CMSBlock): CMSBlock => ({ ...b, props: { ...b.props, ...newProps } });
    if (editingOverlayId) patchOverlayBlock(editingOverlayId, id, patch);
    else patchPageBlock(id, patch);
  }

  function updateBlockPadding(id: string, padding: BlockPadding) {
    const patch = (b: CMSBlock): CMSBlock => ({ ...b, padding });
    if (editingOverlayId) patchOverlayBlock(editingOverlayId, id, patch);
    else patchPageBlock(id, patch);
  }

  function updateBlockInteraction(id: string, interaction: BlockInteraction) {
    const patch = (b: CMSBlock): CMSBlock => ({ ...b, interaction });
    if (editingOverlayId) patchOverlayBlock(editingOverlayId, id, patch);
    else patchPageBlock(id, patch);
  }

  function reorderBlocks(oldIndex: number, newIndex: number) {
    if (editingOverlayId) {
      setOverlays((prev) =>
        prev.map((o) =>
          o.id === editingOverlayId
            ? { ...o, blocks: arrayMove(o.blocks, oldIndex, newIndex) }
            : o,
        ),
      );
    } else {
      setBlocks((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  }

  function selectBlock(id: string | null) {
    setSelectedBlockId(id);
  }

  // ─── 레이아웃 ─────────────────────────────────────────────────────────────

  function updateLayoutType(type: string | undefined, defaultProps?: Record<string, unknown>) {
    setLayoutType(type);
    // 레이아웃 변경 시 새 템플릿의 defaultProps로 초기화하고 blockGap은 유지
    setLayoutProps((prev) => ({ ...defaultProps, blockGap: prev.blockGap }));
  }

  function updateLayoutProps(props: Record<string, unknown>) {
    setLayoutProps(props);
  }

  // ─── 오버레이 ─────────────────────────────────────────────────────────────

  function addOverlay(type: CMSOverlay["type"]) {
    const id = `overlay_${crypto.randomUUID().slice(0, 8)}`;
    setOverlays((prev) => [...prev, { id, type, blocks: [] }]);
  }

  function addOverlayFromTemplate(
    type: CMSOverlay["type"],
    templateBlocks: CMSBlock[],
    defaultId?: string,
    defaultProps?: Record<string, unknown>,
  ) {
    const id = defaultId ?? `overlay_${crypto.randomUUID().slice(0, 8)}`;
    const blocks = templateBlocks.map((b) => ({ ...b, id: crypto.randomUUID() }));
    setOverlays((prev) => [...prev, { id, type, blocks, props: defaultProps }]);
  }

  function updateOverlayProps(id: string, props: Record<string, unknown>) {
    setOverlays((prev) =>
      prev.map((o) => (o.id === id ? { ...o, props: { ...o.props, ...props } } : o)),
    );
  }

  function renameOverlay(oldId: string, newId: string) {
    const trimmed = newId.trim();
    if (!trimmed || oldId === trimmed) return;

    // 모든 블록의 interaction에서 openOverlay target 참조 업데이트
    const updateRefs = (blockList: CMSBlock[]): CMSBlock[] =>
      blockList.map((b) => {
        if (!b.interaction) return b;
        const updated = Object.fromEntries(
          Object.entries(b.interaction).map(([key, action]) => [
            key,
            action.type === "openOverlay" && action.target === oldId
              ? { ...action, target: trimmed }
              : action,
          ]),
        );
        return { ...b, interaction: updated };
      });

    setBlocks((prev) => updateRefs(prev));
    setOverlays((prev) =>
      prev.map((o) => {
        const updatedBlocks = updateRefs(o.blocks);
        if (o.id === oldId) return { ...o, id: trimmed, blocks: updatedBlocks };
        return { ...o, blocks: updatedBlocks };
      }),
    );
    if (editingOverlayId === oldId) setEditingOverlayId(trimmed);
  }

  function removeOverlay(id: string) {
    setOverlays((prev) => prev.filter((o) => o.id !== id));
    if (editingOverlayId === id) setEditingOverlayId(null);
  }

  function enterOverlay(id: string) {
    setEditingOverlayId(id);
    setSelectedBlockId(null);
  }

  function exitOverlay() {
    setEditingOverlayId(null);
    setSelectedBlockId(null);
  }

  // ─── 페이지 전체 ────────────────────────────────────────────────────────

  function getPage(): CMSPage {
    const page: CMSPage = { blocks };
    if (layoutType) page.layoutType = layoutType;
    if (Object.keys(layoutProps).length > 0) page.layoutProps = layoutProps;
    if (overlays.length > 0) page.overlays = overlays;
    return page;
  }

  function loadPage(page: CMSPage) {
    setBlocks(page.blocks);
    setOverlays(page.overlays ?? []);
    setSelectedBlockId(null);
    setEditingOverlayId(null);
    setLayoutType(page.layoutType);
    setLayoutProps(page.layoutProps ?? DEFAULT_LAYOUT_PROPS);
  }

  function clearBlocks() {
    setBlocks([]);
    setOverlays([]);
    setSelectedBlockId(null);
    setEditingOverlayId(null);
    setLayoutType(undefined);
    setLayoutProps(DEFAULT_LAYOUT_PROPS);
  }

  // ─── activeBlocks 계산 ──────────────────────────────────────────────────

  const activeBlocks: CMSBlock[] = editingOverlayId
    ? (overlays.find((o) => o.id === editingOverlayId)?.blocks ?? [])
    : blocks;

  return {
    blocks,
    overlays,
    editingOverlayId,
    activeBlocks,
    selectedBlockId,
    layoutType,
    layoutProps,
    addBlock,
    removeBlock,
    updateBlockProps,
    updateBlockPadding,
    updateBlockInteraction,
    reorderBlocks,
    selectBlock,
    updateLayoutType,
    updateLayoutProps,
    addOverlay,
    addOverlayFromTemplate,
    removeOverlay,
    renameOverlay,
    updateOverlayProps,
    enterOverlay,
    exitOverlay,
    getPage,
    loadPage,
    clearBlocks,
  };
}
