/**
 * @file builderStore.ts
 * @description 빌더 상태 관리 훅.
 * 블록 추가/삭제/수정/정렬 + 레이아웃 타입/props + 오버레이 CRUD 관리.
 * editingOverlayId가 설정된 경우 블록 조작은 해당 오버레이의 blocks를 대상으로 합니다.
 */
import { useState, useCallback, useMemo } from "react";
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

  // ─── 블록 ────────────────────────────────────────────────────────────────────

  // editingOverlayId를 읽으므로 deps에 포함
  const addBlock = useCallback((type: string, atIndex?: number) => {
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
  }, [editingOverlayId, blockMeta]);

  const removeBlock = useCallback((id: string) => {
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
  }, [editingOverlayId]);

  const updateBlockProps = useCallback((id: string, newProps: Record<string, unknown>) => {
    if (editingOverlayId) {
      setOverlays((prev) =>
        prev.map((o) =>
          o.id === editingOverlayId
            ? { ...o, blocks: o.blocks.map((b) => b.id === id ? { ...b, props: { ...b.props, ...newProps } } : b) }
            : o,
        ),
      );
    } else {
      setBlocks((prev) => prev.map((b) => b.id === id ? { ...b, props: { ...b.props, ...newProps } } : b));
    }
  }, [editingOverlayId]);

  const updateBlockPadding = useCallback((id: string, padding: BlockPadding) => {
    if (editingOverlayId) {
      setOverlays((prev) =>
        prev.map((o) =>
          o.id === editingOverlayId
            ? { ...o, blocks: o.blocks.map((b) => b.id === id ? { ...b, padding } : b) }
            : o,
        ),
      );
    } else {
      setBlocks((prev) => prev.map((b) => b.id === id ? { ...b, padding } : b));
    }
  }, [editingOverlayId]);

  const updateBlockInteraction = useCallback((id: string, interaction: BlockInteraction) => {
    if (editingOverlayId) {
      setOverlays((prev) =>
        prev.map((o) =>
          o.id === editingOverlayId
            ? { ...o, blocks: o.blocks.map((b) => b.id === id ? { ...b, interaction } : b) }
            : o,
        ),
      );
    } else {
      setBlocks((prev) => prev.map((b) => b.id === id ? { ...b, interaction } : b));
    }
  }, [editingOverlayId]);

  const reorderBlocks = useCallback((oldIndex: number, newIndex: number) => {
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
  }, [editingOverlayId]);

  // setSelectedBlockId는 stable한 setter이므로 deps 불필요
  const selectBlock = useCallback((id: string | null) => {
    setSelectedBlockId(id);
  }, []);

  // ─── 레이아웃 ─────────────────────────────────────────────────────────────

  const updateLayoutType = useCallback((type: string | undefined, defaultProps?: Record<string, unknown>) => {
    setLayoutType(type);
    // 레이아웃 변경 시 새 템플릿의 defaultProps로 초기화하고 blockGap은 유지
    setLayoutProps((prev) => ({ ...defaultProps, blockGap: prev.blockGap }));
  }, []);

  const updateLayoutProps = useCallback((props: Record<string, unknown>) => {
    setLayoutProps(props);
  }, []);

  // ─── 오버레이 ─────────────────────────────────────────────────────────────

  const addOverlay = useCallback((type: CMSOverlay["type"]) => {
    const id = `overlay_${crypto.randomUUID().slice(0, 8)}`;
    setOverlays((prev) => [...prev, { id, type, blocks: [] }]);
  }, []);

  const addOverlayFromTemplate = useCallback((
    type: CMSOverlay["type"],
    templateBlocks: CMSBlock[],
    defaultId?: string,
    defaultProps?: Record<string, unknown>,
  ) => {
    const id = defaultId ?? `overlay_${crypto.randomUUID().slice(0, 8)}`;
    const blocks = templateBlocks.map((b) => ({ ...b, id: crypto.randomUUID() }));
    setOverlays((prev) => [...prev, { id, type, blocks, props: defaultProps }]);
  }, []);

  const updateOverlayProps = useCallback((id: string, props: Record<string, unknown>) => {
    setOverlays((prev) =>
      prev.map((o) => (o.id === id ? { ...o, props: { ...o.props, ...props } } : o)),
    );
  }, []);

  const renameOverlay = useCallback((oldId: string, newId: string) => {
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
    // editingOverlayId를 functional update로 안전하게 처리
    setEditingOverlayId((prev) => (prev === oldId ? trimmed : prev));
  }, []);

  const removeOverlay = useCallback((id: string) => {
    setOverlays((prev) => prev.filter((o) => o.id !== id));
    setEditingOverlayId((prev) => (prev === id ? null : prev));
  }, []);

  const enterOverlay = useCallback((id: string) => {
    setEditingOverlayId(id);
    setSelectedBlockId(null);
  }, []);

  const exitOverlay = useCallback(() => {
    setEditingOverlayId(null);
    setSelectedBlockId(null);
  }, []);

  // ─── 페이지 전체 ────────────────────────────────────────────────────────

  const getPage = useCallback((): CMSPage => {
    const page: CMSPage = { blocks };
    if (layoutType) page.layoutType = layoutType;
    if (Object.keys(layoutProps).length > 0) page.layoutProps = layoutProps;
    if (overlays.length > 0) page.overlays = overlays;
    return page;
  }, [blocks, layoutType, layoutProps, overlays]);

  const loadPage = useCallback((page: CMSPage) => {
    setBlocks(page.blocks);
    setOverlays(page.overlays ?? []);
    setSelectedBlockId(null);
    setEditingOverlayId(null);
    setLayoutType(page.layoutType);
    setLayoutProps(page.layoutProps ?? DEFAULT_LAYOUT_PROPS);
  }, []);

  const clearBlocks = useCallback(() => {
    setBlocks([]);
    setOverlays([]);
    setSelectedBlockId(null);
    setEditingOverlayId(null);
    setLayoutType(undefined);
    setLayoutProps(DEFAULT_LAYOUT_PROPS);
  }, []);

  // ─── activeBlocks 계산 ──────────────────────────────────────────────────

  // editingOverlayId나 overlays/blocks가 변경될 때만 재계산
  const activeBlocks = useMemo<CMSBlock[]>(
    () =>
      editingOverlayId
        ? (overlays.find((o) => o.id === editingOverlayId)?.blocks ?? [])
        : blocks,
    [editingOverlayId, overlays, blocks],
  );

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
