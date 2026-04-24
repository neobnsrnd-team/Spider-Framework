// e2e/fixtures/locale.ts
// UI 텍스트 중앙 관리 — 셀렉터 문자열 변경 시 이 파일만 수정 (Issue #295)

export const LABEL = {
    // 에디터 하단 버튼
    editor: {
        save:    'Save',
        preview: 'Preview',
        html:    'HTML',
    },

    // 우측 패널 — 금융 컴포넌트 탭
    component: {
        panel:          '금융 컴포넌트',
        eventBanner:    '이벤트 배너',
        quickMenu:      '퀵뱅킹 메뉴',
        productGallery: '금융 상품 갤러리',
        exchangeBoard:  '환율 및 금융 지수',
        branchLocator:  '영업점/ATM 위치',
        calculator:     '금융 계산기',
        authCenter:     '보안·인증센터',
        appHeader:      '상단 네비게이션',
    },

    // 승인 플로우 버튼
    approval: {
        request:  '승인 요청',
        approve:  '승인',
        reject:   '반려',
        block:    '긴급 차단',
        unblock:  '차단 해제',
        rollback: '롤백',
    },

    // 공통 액션
    action: {
        save:   '저장',
        cancel: '취소',
        delete: '삭제',
        add:    '추가',
        apply:  '적용',
    },
} as const;
