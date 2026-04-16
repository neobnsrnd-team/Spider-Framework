/**
 * @file types.ts
 * @description LoginPage 컴포넌트 타입 정의.
 */

export interface LoginPageProps {
  /** 아이디 입력값 */
  userId?: string;
  /** 비밀번호 입력값 */
  password?: string;
  /** 아이디 변경 핸들러 */
  onUserIdChange?: (value: string) => void;
  /** 비밀번호 변경 핸들러 */
  onPasswordChange?: (value: string) => void;
  /** true 시 비밀번호 에러 상태(빨간 테두리 + 안내 문구) 표시 */
  hasError?: boolean;
  /** true 시 비밀번호 평문 표시 */
  showPassword?: boolean;
  /** 비밀번호 표시/숨김 토글 핸들러 */
  onTogglePassword?: () => void;
  /** 로그인 버튼 클릭 핸들러 */
  onLogin?: () => void;
  /** 아이디 저장 체크 여부 — true 시 로그인 성공 후 userId를 localStorage에 보관 */
  saveId?: boolean;
  /** 아이디 저장 체크 변경 핸들러 */
  onSaveIdChange?: (checked: boolean) => void;
  /** 자동 로그인 체크 여부 — true 시 다음 방문 시 로그인 화면을 건너뜀 */
  autoLogin?: boolean;
  /** 자동 로그인 체크 변경 핸들러 */
  onAutoLoginChange?: (checked: boolean) => void;
}
