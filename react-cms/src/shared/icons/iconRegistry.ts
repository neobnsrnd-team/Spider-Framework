/**
 * @file iconRegistry.ts
 * @description Lucide 아이콘 전체를 kebab-case 이름으로 등록하는 동적 레지스트리.
 * "chevron-right", "arrow-left" 등 kebab-case 이름으로 아이콘을 조회할 수 있다.
 */
import * as LucideIcons from "lucide-react";
import type React from "react";

/** 아이콘(SVG)이 공통으로 받는 속성 */
export type BaseIconProps = React.ComponentPropsWithoutRef<'svg'>;

/** PascalCase → kebab-case 변환 (예: ChevronRight → chevron-right) */
const normalizeIconName = (name: string) =>
  name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

/** 모든 Lucide 아이콘을 kebab-case 이름으로 인덱싱한 레지스트리 */
export const ICON_REGISTRY = (Object.entries(LucideIcons) as [string, unknown][])
  .filter(([originalName, val]) =>
    /^[A-Z]/.test(originalName) &&
    typeof val === 'object' &&
    val !== null &&
    '$$typeof' in (val as object) &&
    typeof (val as Record<string, unknown>).displayName === 'string'
  )
  .reduce((acc, [originalName, Component]) => {
    acc[normalizeIconName(originalName)] = Component as React.ComponentType<BaseIconProps>;
    return acc;
  }, {} as Record<string, React.ComponentType<BaseIconProps>>);

export type IconName = keyof typeof ICON_REGISTRY;
