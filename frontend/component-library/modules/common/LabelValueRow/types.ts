/**
 * @file types.ts
 * @description LabelValueRow 컴포넌트의 TypeScript 타입 정의.
 *
 * 레이블(좌) / 값(우) 한 행 배치 패턴.
 * "잔액 ··· 3,000,000원", "나의자산 현황 ··· 총 4,000,000원" 처럼
 * 두 정보를 좌우로 나란히 표시하는 패턴을 표준화한다.
 */
import type React from 'react';

export interface LabelValueRowProps {
  /** 좌측 레이블 텍스트 (caption 크기, muted 색상) */
  label: string;
  /**
   * 우측 값 영역.
   * 문자열 또는 스타일이 필요한 경우 ReactNode를 전달한다.
   * (예: 금액에 numeric 폰트·색상 적용 시 <span> 전달)
   */
  value: React.ReactNode;
  /** 추가 Tailwind 클래스 */
  className?: string;
}
