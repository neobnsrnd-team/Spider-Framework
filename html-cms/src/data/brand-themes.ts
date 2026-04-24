// src/data/brand-themes.ts
// .env BANK_BRAND 값에 따라 금융 컴포넌트에 주입할 bank별 색상 팔레트

export interface BrandTheme {
    /** 버튼·강조 텍스트·아이콘 배경 */
    primary: string;
    /** 대출·ATM 등 보조 강조 */
    secondary: string;
    /** primary 연색 배경 */
    primaryLight: string;
    /** secondary 연색 배경 */
    secondaryLight: string;
}

export const BRAND_THEMES: Record<string, BrandTheme> = {
    // IBK 기업은행: 신뢰를 주는 딥 블루
    IBK: {
        primary: '#00539C',
        secondary: '#0090D9',
        primaryLight: '#F2F7FA',
        secondaryLight: '#EBF5FC',
    },

    // 하나은행: 건강하고 활기찬 그린
    HANA: {
        primary: '#008485',
        secondary: '#00A3A4',
        primaryLight: '#F0F8F8',
        secondaryLight: '#E6F7F7',
    },

    // KB 국민은행: 따뜻함과 신뢰의 옐로우 & 그레이
    KB: {
        primary: '#FFBC00',
        secondary: '#60584C',
        primaryLight: '#FFFCF2',
        secondaryLight: '#F2F0EE',
    },

    // iM뱅크 (구 대구은행): 민트 그린
    IM: {
        primary: '#29A984',
        secondary: '#A3D139',
        primaryLight: '#F4FAF8',
        secondaryLight: '#EBF6FC',
    },
};
