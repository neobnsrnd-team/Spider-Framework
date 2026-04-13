/**
 * @file types.ts
 * @description UserManagementPage 컴포넌트 타입 정의.
 */

/** 인터넷뱅킹 이용자 상태 코드 */
export type UserStatusCode = 'normal' | 'terminated';

/** 사용자 목록 단일 항목 */
export interface UserItem {
  id: string;
  /** 사용자 ID */
  userId: string;
  /** 사용자명 */
  userName: string;
  /** 비밀번호 오류 횟수 */
  pwErrorCount: number;
  /** 인터넷뱅킹 이용자 상태 */
  status: UserStatusCode;
}

/** 사용자 추가 폼 데이터 */
export interface AddUserForm {
  userId: string;
  password: string;
  userName: string;
  /** 인터넷뱅킹이용자상태코드 */
  statusCode: UserStatusCode;
  /** 권한: 조회 */
  permInquiry: boolean;
  /** 권한: 결제 */
  permPayment: boolean;
  /** 권한: 사용자관리 */
  permUserMgmt: boolean;
  /** 트랜잭션 오류 CASE */
  txErrorCase: boolean;
}

/** 사용자 수정 폼 데이터 — 추가 폼에 비밀번호 입력 오류 횟수(읽기전용) 포함 */
export interface EditUserForm extends AddUserForm {
  /** 비밀번호 입력 오류 횟수 (읽기전용 표시용) */
  pwErrorCount: number;
}

export interface UserManagementPageProps {
  /** 뒤로가기 클릭 */
  onBack?: () => void;
  /** 헤더 우측 메뉴 클릭 */
  onMenuClick?: () => void;
  /** 사용자 목록 */
  users?: UserItem[];
  /** 사용자 추가 저장 클릭 */
  onAddUser?: (form: AddUserForm) => void;
  /** 사용자 수정 저장 클릭 */
  onEditUser?: (form: EditUserForm) => void;
  /** 사용자 삭제 확인 클릭 */
  onDeleteUser?: (userId: string) => void;
}
