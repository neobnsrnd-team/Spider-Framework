/**
 * @file useCMSContextValues.ts
 * @description CMSApp과 CMSRuntimeProvider가 공유하는 컨텍스트 값 파생 훅.
 * blocks 배열에서 blockMeta/blockRegistry를, layouts 배열에서 derivedRenderer를 생성합니다.
 * @param blocks 외부 프로젝트가 제공하는 BlockDefinition 목록
 * @param layouts 레이아웃 템플릿 목록
 * @returns blockMeta, blockRegistry, derivedRenderer
 */
import { useMemo } from "react";
import type { BlockDefinition, LayoutRenderer, LayoutTemplate } from "./types";

export function useCMSContextValues(
  blocks: BlockDefinition[],
  layouts: LayoutTemplate[],
) {
  const blockMeta = useMemo(
    () => Object.fromEntries(blocks.map((b) => [b.meta.name, b.meta])),
    [blocks],
  );

  const blockRegistry = useMemo(
    () => Object.fromEntries(blocks.map((b) => [b.meta.name, b.component])),
    [blocks],
  );

  // layouts 배열에서 LayoutRenderer 파생: id로 템플릿을 찾아 renderer 호출
  const derivedRenderer = useMemo<LayoutRenderer | undefined>(() => {
    if (!layouts.length) return undefined;
    return (layoutType, layoutProps) =>
      layouts.find((t) => t.id === layoutType)?.renderer?.(layoutProps) ?? {};
  }, [layouts]);

  return { blockMeta, blockRegistry, derivedRenderer };
}
