/**
 * @file componentRegistry.ts
 * @description 생성 코드에서 사용하는 모듈을 window.__components에 전역 노출.
 *
 * Renderer.tsx가 eval한 사용자 코드는 모든 import 구문이
 * `const { X } = window.__components` 접근으로 교체된 채 실행된다.
 * import 소스(reactive-springware, lucide-react 등)에 관계없이
 * 단일 전역 객체에서 이름으로 찾으므로, 생성 코드가 쓸 수 있는 심볼은 모두 등록해야 한다.
 *
 * 이 모듈을 앱 진입 전(main.tsx)에 import하여 전역을 초기화해 두어야 한다.
 *
 * @example
 * // 생성 코드: import { Button } from '@cl'
 * // 교체 후:   const { Button } = window.__components
 * // 생성 코드: import { Eye } from 'lucide-react'
 * // 교체 후:   const { Eye } = window.__components
 */
import * as RSW from '@cl'
import * as LucideIcons from 'lucide-react'

// reactive-springware 컴포넌트와 lucide-react 아이콘을 하나의 맵으로 합친다.
// 이름 충돌 시 lucide-react보다 reactive-springware가 우선한다.
window.__components = {
  ...LucideIcons,
  ...RSW,
} as Record<string, unknown>
