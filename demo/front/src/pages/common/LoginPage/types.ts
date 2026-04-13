/**
 * @file types.ts
 * @description LoginPage 컴포넌트 타입 정의.
 */

export interface LoginPageProps {
  /** true 시 비밀번호 에러 상태(빨간 테두리 + 안내 문구) 표시 */
  hasError?: boolean;
  /** true 시 비밀번호 평문 표시 */
  showPassword?: boolean;
  /** 비밀번호 표시/숨김 토글 핸들러 */
  onTogglePassword?: () => void;
  /** 로그인 버튼 클릭 핸들러 */
  onLogin?: () => void;
}
