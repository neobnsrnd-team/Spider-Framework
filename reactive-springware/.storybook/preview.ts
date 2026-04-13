/**
 * @file preview.ts
 * @description Storybook 전역 미리보기 설정.
 *
 * - 전역 CSS(Tailwind + 브랜드 토큰) 적용
 * - 기본 뷰포트(모바일 390px) 설정
 * - data-brand / data-domain 전역 데코레이터로 CSS 변수 활성화
 *
 * @example
 * // 스토리에서 특정 브랜드로 미리보기
 * export default {
 *   parameters: { brand: 'kb', domain: 'banking' },
 * } satisfies Meta;
 */
import type { Preview } from '@storybook/react';

/* 전역 스타일 — Tailwind CSS v4 + 브랜드/도메인 CSS 변수 포함 */
import '../design-tokens/globals.css';

const preview: Preview = {
  parameters: {
    /* 기본 뷰포트: 모바일(390px) 우선 */
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile (390px)',
          styles: { width: '390px', height: '844px' },
          type: 'mobile',
        },
        tablet: {
          name: 'Tablet (768px)',
          styles: { width: '768px', height: '1024px' },
          type: 'tablet',
        },
        desktop: {
          name: 'Desktop (1280px)',
          styles: { width: '1280px', height: '800px' },
          type: 'desktop',
        },
      },
      defaultViewport: 'mobile',
    },

    backgrounds: {
      default: 'page',
      values: [
        { name: 'page',  value: '#f5f8f8' },
        { name: 'white', value: '#ffffff' },
        { name: 'dark',  value: '#1e293b' },
      ],
    },

    controls: { matchers: {}, sort: 'alpha' },
  },

  /**
   * 전역 데코레이터 — HTML 루트에 data-brand/data-domain 속성을 주입해
   * CSS 변수(--brand-primary 등)가 올바르게 cascade 되도록 한다.
   * 스토리 parameters.brand / parameters.domain 으로 재정의 가능.
   */
  decorators: [
    (Story, context) => {
      const brand  = (context.parameters['brand']  as string | undefined) ?? 'hana';
      const domain = (context.parameters['domain'] as string | undefined) ?? 'banking';

      document.documentElement.setAttribute('data-brand',  brand);
      document.documentElement.setAttribute('data-domain', domain);

      return Story();
    },
  ],
};

export default preview;