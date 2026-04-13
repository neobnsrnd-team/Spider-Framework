/**
 * @file types.ts
 * @description InfoRow 컴포넌트의 TypeScript 타입 정의.
 *
 * 이체 확인·계좌 상세 등의 화면에서 레이블(좌)과 값(우)을 한 행으로 표시하는 컴포넌트.
 * CardRow와의 차이:
 *   - CardRow: 라벨 text-xs(12px) + 값 text-sm bold — 카드 내부 소형 요약 정보용
 *   - InfoRow: 라벨 text-sm(14px) + 값 text-sm normal — 이체 확인처럼 본문 수준 정보 나열용
 */

export interface InfoRowProps {
  /** 행 좌측 레이블 텍스트 (예: "출금계좌") */
  label: string;
  /** 행 우측 값 텍스트 (예: "하나 123-456-789012") */
  value: string;
  /**
   * 값 텍스트에 추가할 Tailwind 클래스.
   * 수수료 0원처럼 특정 행 값에 브랜드·강조 색상을 적용할 때 사용한다.
   * @example valueClassName="text-brand-text"
   * @example valueClassName="text-base"  — 금액처럼 한 단계 큰 텍스트
   */
  valueClassName?: string;
  /**
   * 하단 구분선 표시 여부. 기본값: true
   * 목록 마지막 행이나 구분선이 불필요한 경우 false로 설정한다.
   */
  showBorder?: boolean;
  /** 추가 Tailwind 클래스 */
  className?: string;
}
