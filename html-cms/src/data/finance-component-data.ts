// 금융 도메인 컴포넌트 — 타입 정의
// 컴포넌트 데이터는 DB(SPW_CMS_COMPONENT)에서 관리

export interface FinanceComponent {
    id: string;
    label: string;
    description: string;
    preview: string; // SVG 미리보기 경로
    html: string; // ContentBuilder 삽입용 HTML (raw — EditClient에서 row/column으로 래핑)
    viewMode: 'mobile' | 'web' | 'responsive';
}
