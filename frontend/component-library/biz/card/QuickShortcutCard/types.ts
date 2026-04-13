/**
 * @file types.ts
 * @description QuickShortcutCard 컴포넌트 타입 정의.
 */
import React from 'react'

export interface QuickShortcutCardProps {
  /** 메인 타이틀 (e.g. "내 쿠폰", "카드 신청") */
  title: string
  /** 서브 텍스트 (e.g. "3장 사용가능", "맞춤형 추천") */
  subtitle: string
  /**
   * 우측 아이콘 슬롯 (lucide-react ReactNode)
   * 전달하지 않으면 아이콘 영역이 렌더링되지 않는다.
   */
  icon?: React.ReactNode
  /** 카드 클릭 핸들러 */
  onClick?: () => void
  className?: string
}
