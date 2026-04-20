/**
 * @file Icon.tsx
 * @description kebab-case 아이콘 이름을 받아 Lucide 아이콘을 렌더링하는 범용 컴포넌트.
 *
 * @example
 * <Icon name="chevron-right" className="size-4" />
 * <Icon name="landmark" />
 */
import type { IconProps } from "./IconProps.type";
import { ICON_REGISTRY } from "./iconRegistry";

export default function Icon({ name, className, ...rest }: IconProps) {
  const Component = ICON_REGISTRY[name];
  if (!Component) return null;
  return <Component className={className} {...rest} />;
}
