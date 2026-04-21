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
import * as ReactNamespace from 'react'
import * as RSW from '@cl'
import * as LucideIcons from 'lucide-react'

// reactive-springware 컴포넌트, lucide-react 아이콘, React를 하나의 맵으로 합친다.
// 우선순위: reactive-springware > lucide-react > React (이름 충돌 시 앞쪽이 우선)
// React를 등록하는 이유:
//   - window.__components['React']: default import 패턴 fallback (import React from 'react')
//   - ...ReactNamespace: named hooks fallback (window.__components.useState 등)
//     patchImports regex가 예외 케이스를 놓치더라도 hooks에 접근 가능하도록 안전망 역할
// React 19 ESM은 default export가 없으므로 namespace import를 'React' 키로 등록한다.
// `import React from 'react'`는 React 19에서 null을 반환한다.
window.__components = {
  ...ReactNamespace,
  React: ReactNamespace,
  ...LucideIcons,
  ...RSW,
} as Record<string, unknown>
