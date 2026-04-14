# Design Tokens

> 이 파일은 `scripts/extract-design-tokens.ts`로 자동 생성됩니다. 직접 수정하지 마세요.
> Claude API system prompt에 포함되어 하드코딩 방지용 레퍼런스로 사용됩니다.

## 사용 규칙

- 색상·간격·타이포는 반드시 CSS 변수(`var(--*)`) 또는 Tailwind 토큰 클래스를 사용할 것
- `#FFFFFF`, `16px` 같은 하드코딩 금지
- 브랜드 컬러(`--color-brand-*`)는 prop으로 노출하지 말고 토큰으로 고정할 것

## Semantic Tokens (공통 고정값)

모든 은행 브랜드에서 공통으로 사용되는 시맨틱 컬러. 컴포넌트 내부에 직접 적용.

### color

| CSS 변수 | 참조값 |
|---------|--------|
| `--color-brand` | `{brand.primary}` |
| `--color-danger` | `#e11d48` |
| `--color-text` | `#ffffff` |
| `--color-border` | `#e2e8f0` |
| `--color-surface` | `#ffffff` |
| `--color-success` | `#16a34a` |
| `--color-warning` | `#d97706` |
| `--color-primary` | `#2563eb` |
| `--color-info-surface` | `#eff6ff` |

## Brand Tokens — hana (하나은행)

브랜드별 가변 토큰. `data-brand="hana"` 속성으로 주입됨.
컴포넌트 prop에 색상 값을 직접 전달하지 말 것.

| CSS 변수 | 값 |
|---------|-----|
| `--brand-primary` | `#008485` |
| `--brand-alt` | `#14b8a6` |
| `--brand-fg` | `#ffffff` |
| `--brand-text` | `#008485` |
| `--brand-dark` | `#006e6f` |
| `--brand-darker` | `#005859` |
| `--brand-shadow` | `#00848540` |
| `--brand-bg` | `#f5f8f8` |
| `--brand-name` | `하나은행` |
| `--brand-domain-card-accent` | `#caee5d` |
| `--brand-domain-card-accentText` | `#546b00` |

## Primitive Tokens (참고용 — 직접 사용 금지)

Semantic/Brand 토큰이 참조하는 원시값. 컴포넌트에서 직접 사용하지 말 것.

| CSS 변수 | 값 |
|---------|-----|
