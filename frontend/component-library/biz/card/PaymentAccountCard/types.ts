/**
 * @file types.ts
 * @description PaymentAccountCard 컴포넌트 타입 정의.
 */
import type React from 'react';

export interface PaymentAccountCardProps {
  /** 결제 계좌 명칭. 예: '하나은행 결제계좌' */
  title: string;
  /** 출금 가능 시간. 예: '365일 06:00~23:30' */
  hours: string;
  /** 당행/타행을 구분하는 아이콘 (lucide-react 컴포넌트) */
  icon: React.ReactNode;
}
