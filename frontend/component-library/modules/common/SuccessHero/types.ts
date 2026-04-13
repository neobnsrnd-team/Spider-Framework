/**
 * @file types.ts
 * @description SuccessHero 컴포넌트의 TypeScript 타입 정의.
 * 이체·결제 완료 등 성공 결과 화면의 시각적 히어로 섹션에 사용한다.
 */

export interface SuccessHeroProps {
  /**
   * 받는 사람 이름 (예: "홍길동").
   * 타이틀에 "{recipientName}님께" 형태로 삽입된다.
   */
  recipientName: string;
  /**
   * 이체 금액 문자열 (예: "50,000원").
   * 타이틀에 "{amount} 이체 완료" 형태로 삽입된다.
   */
  amount: string;
  /**
   * 부제목 텍스트.
   * 기본값: "성공적으로 이체되었습니다."
   */
  subtitle?: string;
  /** 추가 CSS className */
  className?: string;
}
