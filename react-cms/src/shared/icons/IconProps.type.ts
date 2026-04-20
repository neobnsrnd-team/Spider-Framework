/**
 * @file IconProps.type.ts
 * @description Icon 컴포넌트 props 타입 정의.
 */
import type { BaseIconProps, IconName } from "./iconRegistry";

export interface IconProps extends BaseIconProps {
  /** kebab-case 아이콘 이름 (예: "chevron-right", "landmark") */
  name: IconName;
  className?: string;
}
