/**
 * @file types.ts
 * @description TransferInputPage 컴포넌트의 TypeScript 타입 정의.
 */

/**
 * 이체 수신 방식 탭.
 * - 'account': 계좌번호로 이체 (기본)
 * - 'contact': 연락처 송금
 */
export type TransferInputTab = 'account' | 'contact';

/**
 * 수신 필터 칩.
 * 계좌번호 탭에서 자주/최근/내계좌 중 선택하는 빠른 필터.
 */
export type RecipientFilter = 'frequent' | 'recent' | 'myAccount';

export interface TransferInputPageProps {
  /**
   * 초기 활성 탭.
   * @default 'account'
   */
  initialTab?: TransferInputTab;
  /**
   * 통장표시내용/CMS 섹션 초기 펼침 여부.
   * @default false
   */
  cmsSectionExpanded?: boolean;
}
