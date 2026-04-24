# Springware CMS — 금융 UI 스타일 가이드

> 이 문서는 금융 컴포넌트 UI를 기준으로 작성된 디자인 시스템 가이드입니다.
> 기존 innova 스타일을 금융 UI 스타일로 통일할 때, 그리고 새 UI를 만들 때 이 문서를 기준으로 삼습니다.

---

## 목차

1. [디자인 원칙](#1-디자인-원칙)
2. [색상 시스템](#2-색상-시스템)
3. [타이포그래피](#3-타이포그래피)
4. [간격 & 레이아웃](#4-간격--레이아웃)
5. [보더 & 그림자](#5-보더--그림자)
6. [컴포넌트별 스타일](#6-컴포넌트별-스타일)
7. [인터랙션 & 애니메이션](#7-인터랙션--애니메이션)
8. [아이콘](#8-아이콘)
9. [다크 모드](#9-다크-모드)
10. [CMS 에디터 패널 스타일](#10-cms-에디터-패널-스타일)

---

## 1. 디자인 원칙

- **모바일 퍼스트**: 기준 너비 `390px` (일반 스마트폰 화면)
- **터치 친화적**: 터치 대상 최소 `44px × 44px` 보장
- **금융 신뢰감**: 파란 계열 주색, 깔끔한 흰 배경, 명확한 정보 계층
- **일관된 곡률**: 카드·컨테이너 `20px`, 내부 요소 `12–16px`, 배지 `20px`

---

## 2. 색상 시스템

### 2.1 주색 (Brand Primary)

| 역할 | 색상값 | 사용처 |
|------|--------|--------|
| 주색 | `#0046A4` | 버튼 배경, 강조 텍스트, 헤더 하단 보더 |
| 주색 밝음 | `#2563EB` | 보조 강조, 링크 |
| 주색 배경 | `#E8F0FC` | 아이콘 래퍼 배경, 결과 섹션 배경 |
| 주색 연배경 | `#F0F4FF` | 현재 상태 배지 배경 |
| 주색 보더 | `#C7D8F4` | 배지 보더 |

### 2.2 중성색 (Neutral)

| 역할 | 색상값 | 사용처 |
|------|--------|--------|
| 배경 (컴포넌트) | `#FFFFFF` | 카드, 패널 배경 |
| 배경 (섹션) | `#F5F7FA` | 탭 배경, 상품 갤러리 배경 |
| 배경 (아이콘) | `#F3F4F6` | 아이콘 래퍼 기본 상태 |
| 배경 (페이지) | `#F9FAFB` | 푸터, 전체 페이지 배경 |
| 보더 기본 | `#E5E7EB` | 카드 구분선, 입력 보더 |
| 보더 연함 | `#F3F4F6` | 섹션 내부 구분선 |
| 텍스트 기본 | `#1A1A2E` | 제목, 본문 주요 텍스트 |
| 텍스트 보조 | `#6B7280` | 설명, 라벨 텍스트 |
| 텍스트 연함 | `#9CA3AF` | 비활성, 힌트 텍스트 |
| 텍스트 UI | `#374151` | CMS 패널 일반 텍스트 |

### 2.3 강조색 (Accent)

| 역할 | 색상값 | 사용처 |
|------|--------|--------|
| 주황 (ATM, 대출 강조) | `#FF6600` | ATM 아이콘, 대출 배지 |
| 상승 (환율 상승) | `#DC2626` | 환율 상승률 배지 |
| 하강 (환율 하강) | `#2563EB` | 환율 하강률 배지 |
| 녹색 (예금 강조) | `#059669` | 예금 배지 |
| 공지 배경 | `#FEF9C3` | 노란 공지 배너 |
| 공지 보더 | `#FEF08A` | 노란 공지 보더 |

### 2.4 관리자 테마 (Admin)

| 역할 | 색상값 | 사용처 |
|------|--------|--------|
| 관리자 주색 | `#1e3a5f` | 관리자 헤더 배경, 필터/페이지네이션 활성, 승인 버튼, 타이틀 컬러 바 |
| 관리자 배경 | `#eaedf0` | 관리자 대시보드 본문 배경 |
| 관리자 뱃지 | `#b45309` (앰버) | 관리자 역할 뱃지 |

### 2.5 색상 사용 원칙

- **배경 그라데이션**: 슬라이드 배너는 `135deg` 방향 그라데이션 사용
- **그림자는 주색 기반**: `rgba(0, 70, 164, 0.07–0.3)` (순수 검정 그림자 지양)
- **배지/태그**: 배경 `rgba(255,255,255,0.25)` (반투명 흰색) 또는 지정 강조색

---

## 3. 타이포그래피

### 3.1 폰트 스택

```css
font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
```

모든 금융 컴포넌트에서 동일하게 사용합니다.

### 3.2 텍스트 크기 계층

| 레벨 | 크기 | 굵기 | 사용처 |
|------|------|------|--------|
| Display | `40px` | `800` | 금리·이율 등 핵심 숫자 강조 |
| H1 | `22px` | `800` | 배너 슬라이드 주 제목 |
| H2 | `17–18px` | `700–800` | 섹션 제목, 앱 헤더 은행명 |
| H3 | `15px` | `700` | 카드 제목, 인증 항목명 |
| Body Large | `14px` | `500–600` | 상품 설명, 환율 값 |
| Body | `13px` | `400–500` | 일반 본문, 배너 설명 |
| Caption | `12px` | `400–500` | 보조 설명 |
| Label | `11px` | `500–700` | 배지, 태그, 변화율 |
| Micro | `10px` | `500` | 최소 단위 라벨 |

### 3.3 자간 & 행간

- 큰 숫자 (`Display`): `letter-spacing: -1px` (타이트하게)
- 일반 제목: `letter-spacing: 0` 또는 기본값
- 본문 행간: `line-height: 1.4–1.8`
- 제목 행간: `line-height: 1–1.3`

---

## 4. 간격 & 레이아웃

### 4.1 기준 너비

- 모바일 캔버스: `390px`
- 배경(캔버스): `#DDE1E7`

### 4.2 패딩 표준

| 적용 위치 | 값 |
|----------|-----|
| 컴포넌트 좌우 패딩 | `20px` |
| 컴포넌트 상하 패딩 | `16–24px` |
| 헤더 영역 | `18–20px 20px 12–14px` |
| 카드 내부 | `24px 20px` |
| 리스트 아이템 | `14px 20px` |
| 배지/태그 | `3–4px 8–10px` |
| 버튼 (CTA) | `0` (height로 제어, 풀너비) |
| 탭 버튼 | `6px (container), 내부 height: 44px` |

### 4.3 아이템 간격

| 상황 | 값 |
|------|-----|
| 요소 간 (인라인) | `4–8px` |
| 리스트 아이템 간 | `6–8px` |
| 섹션 간 | `12–16px` |
| 그리드 gap | `4px` |

### 4.4 그리드

- **메뉴 그리드**: `grid-template-columns: repeat(3, 1fr)` / gap `4px`
- **슬라이드**: `scroll-snap-type: x mandatory` + `scroll-snap-align: start`

### 4.5 주요 고정 크기

| 요소 | 크기 |
|------|------|
| 앱 헤더 높이 | `54px` |
| 탭 높이 | `44px` |
| CTA 버튼 높이 | `48–52px` |
| 입력 필드 높이 | `52px` |
| 리스트 아이템 높이 | `64px` |
| 아이콘 래퍼 (메뉴) | `60px × 60px` |
| 아이콘 래퍼 (리스트) | `48px × 48px` |
| 슬라이드 배너 높이 | `200px` |
| 지도 영역 높이 | `240px` |
| 16:9 영상 비율 | `padding-top: 56.25%` |

---

## 5. 보더 & 그림자

### 5.1 보더 반경 (Border Radius)

| 레벨 | 값 | 적용 대상 |
|------|-----|----------|
| 최대 (Large) | `20px` | 카드 컴포넌트, 환율 보드, 계산기 |
| 중상 (Medium-Large) | `16px` | 슬라이드 카드 |
| 중간 (Medium) | `14px` | 아이콘 래퍼, 결과 박스, 계산기 버튼 |
| 중소 (Medium-Small) | `12px` | 입력 필드, CTA 버튼, 필터 버튼 |
| 캡슐 (Pill) | `20px` | 배지, 배너 카운터, 필터 탭 |
| 최소 (Small) | `6px` | CMS 패널 버튼, 배지 변화율 |
| 상단만 | `20px 20px 0 0` | 바텀시트 |

### 5.2 그림자

| 용도 | 값 |
|------|-----|
| 카드 기본 | `0 4px 20px rgba(0, 70, 164, 0.08)` |
| 컴포넌트 기본 | `0 2px 16px rgba(0, 70, 164, 0.07)` |
| CMS 상단 바 | `0 1px 4px rgba(0, 0, 0, 0.06)` |
| 버튼 강조 | `0 2px 12px rgba(0, 70, 164, 0.3)` |
| 바텀시트 (위쪽) | `0 -4px 24px rgba(0, 0, 0, 0.08)` |
| 지도 검색바 | `0 2px 12px rgba(0, 0, 0, 0.1)` |
| 슬라이더 썸 | `0 2px 8px rgba(0, 0, 0, 0.15)` |

> **원칙**: 순수 검정(`rgba(0,0,0,…)`) 그림자는 최소화, 주색 기반(`rgba(0, 70, 164, …)`) 그림자를 우선 사용합니다.

### 5.3 보더 선

| 용도 | 값 |
|------|-----|
| 일반 구분선 | `1px solid #E5E7EB` |
| 연한 구분선 | `1px solid #F3F4F6` |
| 강조 하단선 (헤더) | `2.5px solid #0046A4` |
| 결과 박스 구분 | `1px solid rgba(0, 70, 164, 0.15)` |

---

## 6. 컴포넌트별 스타일

### 6.1 앱 헤더 (`app-header`)

- 높이: `54px`, 배경: `#fff`
- 레이아웃: `flex`, 중앙 정렬
- 로고 이미지: `34px × 34px`, `border-radius: 6px`
- 은행명: `17px`, `font-weight: 800`, `color: #0046A4`
- 하단 강조선: `2.5px solid #0046A4`

### 6.2 퀵뱅킹 메뉴 (`product-menu`)

- 배경: `#fff`, `border-radius: 16px`
- 그림자: `0 2px 12px rgba(0,0,0,0.08)`
- 헤더: `padding: 18px 18px 4px`
- 그리드: `3열 × N행`, gap `4px`, 패딩 `8px 8px 20px`
- 아이템: flex column, `padding: 14px 6px`, `border-radius: 12px`
- 아이콘: `60px × 60px`, `background: #F3F4F6`, `border-radius: 14px`
- 호버: 아이콘 배경 `#EBF4FF`

### 6.3 금융 상품 갤러리 (`product-gallery`)

- 배경: `#F5F7FA`, `border-radius: 20px`
- 헤더: `padding: 20px 20px 12px`
- 슬라이드 카드: 배경 `#fff`, `border-radius: 16px`, `padding: 24px 20px`
- 그림자: `0 4px 20px rgba(0, 70, 164, 0.08)`
- 이율 값: `40px`, `font-weight: 800`, `letter-spacing: -1px`
- 타입 배지: `11px`, `padding: 4px 10px`, `border-radius: 20px`
- CTA 버튼: `height: 48px`, `border-radius: 12px`
- 점 내비게이션: 기본 `8px` 원형 → 활성 `24px`, `border-radius: 4px`

### 6.4 환율 보드 (`exchange-board`)

- 배경: `#fff`, `border-radius: 20px`
- 그림자: `0 2px 16px rgba(0, 70, 164, 0.07)`
- 헤더: `padding: 18px 20px 14px`, 하단 보더
- 리스트 아이템: `min-height: 64px`, `padding: 14px 20px`
- 통화 플래그: `font-size: 28px` (이모지)
- 변화율 배지: `11px`, `padding: 2px 8px`, `border-radius: 6px`
  - 상승: 배경 `#FEE2E2`, 텍스트 `#DC2626`
  - 하강: 배경 `#DBEAFE`, 텍스트 `#2563EB`
- 환전 버튼: `height: 48px`, `border-radius: 12px`, 풀너비

### 6.5 영업점·ATM 찾기 (`branch-locator`)

- 지도 영역: `height: 240px`
- 검색바: `position: absolute`, `top: 12px`, 좌우 `12px`
  - 입력: `height: 44px`, `border-radius: 12px`
  - 버튼: `44px × 44px`, 원형 (`border-radius: 50%`)
- 필터: `height: 32px`, `border-radius: 20px`
- 바텀시트: `border-radius: 20px 20px 0 0`, 그림자 위쪽
  - 핸들바: `40px × 4px`, `border-radius: 2px`, 배경 `#E5E7EB`
- 영업점 아이콘: `40px × 40px`, 배경 `#0046A4`
- ATM 아이콘: `40px × 40px`, 배경 `#FF6600`

### 6.6 홍보 배너 (`promo-banner`)

- 슬라이드: `height: 200px`, 그라데이션 배경 (`135deg`)
- 배지: `11px`, `padding: 3px 10px`, `border-radius: 20px`, `rgba(255,255,255,0.25)`
- 제목: `22px`, `font-weight: 800`, `color: #fff`
- 설명: `13px`, `rgba(255,255,255,0.85)`
- CTA: `13px`, `padding: 8px 16px`, `rgba(255,255,255,0.2)`
- 카운터: `position: absolute`, `top: 12px`, `right: 14px`, `border-radius: 20px`
- 점: 기본 `6px` → 활성 `20px`, `border-radius: 3px`

### 6.7 금융 계산기 (`loan-calculator`)

- 배경: `#fff`, `border-radius: 20px`
- 탭 컨테이너: 배경 `#F5F7FA`, 패딩 `6px`, gap `4px`
- 탭 활성: 배경 `#fff`, 텍스트 `#0046A4`, 그림자
- 입력 필드: 배경 `#F5F7FA`, `height: 52px`, `border-radius: 12px`
  - 숫자 폰트: `18px`, `font-weight: 700`
  - 포커스: `border: 2px solid #0046A4`
- 슬라이더 트랙: `height: 4px`, `border-radius: 2px`
- 슬라이더 썸: `22px`, 원형, 활성 시 `transform: scale(1.25)`
- 결과 박스: 배경 `#E8F0FC`, `border-radius: 14px`, `padding: 16px`
- 신청 버튼: `height: 52px`, `border-radius: 14px`, `background: #0046A4`

### 6.8 보안·인증센터 (`auth-center`)

- 헤더: `padding: 20px 20px 12px`, 하단 보더
- 리스트 아이템: `height: 64px`, `padding: 14px 20px`
- 아이콘: `48px × 48px`, `background: #E8F0FC`, `border-radius: 14px`
- 제목: `15px`, `font-weight: 700`
- 설명: `12px`, 회색
- 화살표: 호버 시 `translateX(3px)` 이동
- 공지 배너: `background: #FEF9C3`, `border-top: 1px solid #FEF08A`

### 6.9 미디어·영상 (`media-video`)

- 패딩: `16px 20px 20px`
- 레이블: `15px`, `font-weight: 700`
- 영상 래퍼: `padding-top: 56.25%` (16:9 비율 유지), `border-radius: 14px`

### 6.10 사이트 푸터 (`site-footer`)

- 배경: `#F9FAFB`, 패딩 `16px 16px 20px`
- 링크: `11px`, 기본 `#374151`, 호버 `#0046A4`
- TOP 버튼: `36px × 36px`, 원형, 호버 시 배경 `#0046A4`

### 6.11 페이지 카드 (`page-card`)

> 공통 컴포넌트: `src/components/ui/PageCard.tsx`
> 사용처: 사용자 대시보드(`/[userId]`), 관리자 대시보드(`/approve`)

- 배경: `#fff`, `border-radius: 12px` (rounded-xl), `border: 1px solid #E5E7EB`
- 그림자 기본: `0 2px 8px rgba(0,0,0,0.06)`
- 그림자 호버: `0 8px 24px rgba(0,70,164,0.12)`, `translateY(-2px)`
- 썸네일 영역: `height: 140px`, 폴백 배경 `#f0f4ff`, 이모지 `36px` (뷰 모드별)
- 호버 오버레이: 눈 아이콘(`22px`) + 라벨, `opacity 0→1` 트랜지션
  - 사용자: `rgba(0,70,164,0.45)` + "편집하기"
  - 관리자: `rgba(30,58,95,0.45)` + "미리보기"
- 제목: `14px`, `font-weight: 600`, `truncate` 1줄
- 뱃지: 뷰 모드 + 승인상태 (공유 스타일 상수 `VIEW_MODE_STYLE`, `APPROVE_STYLE`)
- 푸터: `border-top: 1px solid #F3F4F6`, 패딩 `8px 16px`, 우측 정렬 버튼

---

## 7. 인터랙션 & 애니메이션

### 7.1 트랜지션 표준

| 용도 | 값 |
|------|-----|
| 배경 색상 변환 | `transition: background 0.15s ease` |
| 색상 + 변형 | `transition: transform 0.2s ease, color 0.2s ease` |
| 슬라이드 애니메이션 | `transition: all 0.25s ease` |

### 7.2 활성 상태 (`:active`)

- 버튼: `transform: scale(0.97)` 또는 `opacity: 0.85`
- 슬라이더 썸: `transform: scale(1.25)`

### 7.3 터치 최적화

```css
-webkit-tap-highlight-color: transparent;
-webkit-overflow-scrolling: touch;
```

### 7.4 점 내비게이션 (슬라이드)

- 기본: 원형 `8px` (높이/너비 동일)
- 활성: `width: 24px` 캡슐 형태로 확장 (border-radius: `3–4px`)

---

## 8. 아이콘

### 8.1 SVG 기본 설정

```css
svg {
  width: 18px;      /* 소형 (버튼 내, 배지) */
  height: 18px;
  /* 또는 */
  width: 24px;      /* 표준 (리스트 아이템) */
  height: 24px;
  fill: currentColor;     /* 또는 'white' */
  stroke: currentColor;   /* 라인 아이콘 */
  stroke-width: 1.5;      /* 또는 2 */
}
```

### 8.2 아이콘 색상

| 상태 | 색상 |
|------|------|
| 기본 | `#374151` (회색) |
| 활성 / 강조 | `#0046A4` (주색) |
| 흰 배경 위 | `#FFFFFF` |

### 8.3 아이콘 래퍼

```css
.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F3F4F6;      /* 기본 */
  /* 또는 */
  background: #E8F0FC;      /* 파란 테마 */
  border-radius: 14px;
}
/* 크기 */
.icon-wrapper--large { width: 60px; height: 60px; } /* 메뉴 그리드 */
.icon-wrapper--medium { width: 48px; height: 48px; } /* 리스트 */
.icon-wrapper--small { width: 40px; height: 40px; }  /* 영업점/ATM */
```

---

## 9. 다크 모드

선택자: `[data-cb-skin="dark"]`

### 9.1 배경 매핑

| 라이트 | 다크 |
|--------|------|
| `#ffffff` | `#1F2937` |
| `#F5F7FA` | `#111827` |
| `#F3F4F6` | `#374151` |
| `#E8F0FC` | `#1E3A5F` |

### 9.2 텍스트 매핑

| 라이트 | 다크 |
|--------|------|
| `#1A1A2E` | `#F9FAFB` |
| `#374151` | `#D1D5DB` |
| `#6B7280` | `#9CA3AF` |

### 9.3 그림자 조정

라이트: `rgba(0, 70, 164, 0.08)` → 다크: `rgba(0, 0, 0, 0.3)`

---

## 10. CMS 에디터 패널 스타일

> `src/app/edit/EditClient.tsx` 및 패널 컴포넌트에 적용되는 스타일

### 10.1 상단 네비바

```css
height: 52px;
background: #ffffff;
border-bottom: 1px solid #e5e7eb;
box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
```

### 10.2 탭 버튼

```css
/* 기본 */
background: transparent;
color: #374151;
padding: 5px 14px;
border-radius: 6px;

/* 활성 */
background: #0046A4;
color: #ffffff;

transition: background 0.15s;
```

### 10.3 일반 버튼

```css
padding: 6px 14px;
border-radius: 6px;
border: 1px solid #e5e7eb;
background: #ffffff;
color: #374151;
font-size: 13px;
font-weight: 500;
cursor: pointer;
white-space: nowrap;
```

### 10.4 상태 배지

```css
background: #f0f4ff;
border: 1px solid #c7d8f4;
color: #0046A4;
padding: 3px 10px;
border-radius: 12px;
font-size: 12px;
```

---

## 부록: 자주 쓰는 값 치트시트

```
/* 주색 */
--color-primary: #0046A4;
--color-primary-bg: #E8F0FC;
--color-primary-bg-light: #F0F4FF;

/* 보더 */
--border-default: 1px solid #E5E7EB;
--border-light: 1px solid #F3F4F6;
--border-primary: 2.5px solid #0046A4;

/* 그림자 */
--shadow-card: 0 4px 20px rgba(0, 70, 164, 0.08);
--shadow-component: 0 2px 16px rgba(0, 70, 164, 0.07);
--shadow-button: 0 2px 12px rgba(0, 70, 164, 0.3);

/* 보더라운드 */
--radius-xl: 20px;   /* 대형 카드, 컴포넌트 */
--radius-lg: 16px;   /* 슬라이드 카드 */
--radius-md: 14px;   /* 아이콘 래퍼, 결과 박스 */
--radius-sm: 12px;   /* 버튼, 입력 필드 */
--radius-pill: 20px; /* 배지, 필터 탭 */
--radius-xs: 6px;    /* CMS 패널 버튼 */

/* 타이포그래피 */
--font-display: 40px / 800;
--font-h1: 22px / 800;
--font-h2: 18px / 700;
--font-h3: 15px / 700;
--font-body: 13px / 400;
--font-caption: 12px / 400;
--font-label: 11px / 700;

/* 간격 */
--spacing-component-x: 20px;
--spacing-component-y: 16px 24px;
--spacing-header: 18px 20px 12px;
--spacing-item: 14px 20px;
```
