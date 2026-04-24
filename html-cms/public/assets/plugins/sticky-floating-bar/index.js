// public/assets/plugins/sticky-floating-bar/index.js
// 플로팅 액션 바 — 이벤트·상품 상세 페이지 하단 고정 CTA 버튼

export default {
    name: 'sticky-floating-bar',
    displayName: '플로팅 액션 바',
    version: '1.0.0',

    contentbox: {
        title: false,
        bg: false,
        text: false,
        boxTabs: false,
        sectionHeight: false,
        sectionTabs: false,
    },

    // CMS 운영자 설정 패널 — 코드 수정 없이 변경 가능한 props
    settings: {
        text: {
            type: 'text',
            label: '강조 문구',
            default: '지금 바로 신청하기',
        },
        buttonLabel: {
            type: 'text',
            label: '버튼 문구',
            default: '신청하기',
        },
        buttonUrl: {
            type: 'text',
            label: '이동 URL',
            default: '#',
        },
        bgColor: {
            type: 'color',
            label: '배경색',
            default: '#ffffff',
        },
        buttonColor: {
            type: 'color',
            label: '버튼 색상',
            default: '#0046A4',
        },
    },

    // 뷰어(/view)에서 저장된 HTML 렌더링 시 호출
    mount: function (element, options) {
        // 옵션 추출 — 기본값 적용
        var text        = options.text        || '지금 바로 신청하기';
        var buttonLabel = options.buttonLabel || '신청하기';
        var buttonUrl   = options.buttonUrl   || '#';
        var bgColor     = options.bgColor     || '#ffffff';
        var buttonColor = options.buttonColor || '#0046A4';

        // URL 보안 검증 — javascript: 등 위험 프로토콜 차단, mailto:/tel:/프로토콜 상대경로 허용
        var safeUrl = (typeof buttonUrl === 'string' && /^(https?:\/\/|\/\/|\/|#|mailto:|tel:)/i.test(buttonUrl))
            ? buttonUrl
            : '#';

        // DOM 구성 — XSS 방지: textContent + setAttribute 사용 (innerHTML 직접 삽입 금지)
        element.innerHTML = '<div class="sfb-inner"><span class="sfb-text"></span><a class="sfb-btn"></a></div>';
        element.querySelector('.sfb-text').textContent = text;
        var btn = element.querySelector('.sfb-btn');
        btn.textContent = buttonLabel;
        btn.setAttribute('href', safeUrl);

        // 배경색·버튼색 적용
        element.style.background = bgColor;
        btn.style.background = buttonColor;

        // 바 위치 업데이트 — 하얀 콘텐츠 박스(.is-container) 하단에 맞춤
        // - 박스 하단이 뷰포트 안쪽: 박스 끝에 붙음
        // - 박스 하단이 뷰포트 아래: 뷰포트 최하단에 고정
        function updatePosition() {
            var container = document.querySelector('.is-container');
            if (!container) return;
            var rect = container.getBoundingClientRect();

            // 수평 — 컨테이너 폭/위치에 맞춤
            element.style.left  = rect.left + 'px';
            element.style.width = rect.width + 'px';

            // 수직 — 컨테이너 하단이 뷰포트 안에 있으면 컨테이너 끝에 붙임
            var distFromBottom = window.innerHeight - rect.bottom;
            element.style.bottom = Math.max(0, distFromBottom) + 'px';
        }

        // 콘텐츠 하단 패딩 — 바 높이만큼 추가하여 마지막 콘텐츠가 바에 가려지지 않도록
        function applyContentPadding() {
            if (document.querySelector('.is-builder')) return;
            var container = document.querySelector('.is-container');
            if (!container) return;
            var barHeight = element.offsetHeight;
            if (!barHeight) return;
            container.style.paddingBottom = (barHeight + 20) + 'px';
        }

        // 레이아웃 완료 후 초기 위치·패딩 적용
        requestAnimationFrame(function () {
            updatePosition();
            applyContentPadding();
        });

        window.addEventListener('resize', function () {
            updatePosition();
            applyContentPadding();
        }, { passive: true });

        // 스크롤 핸들러 — 노출 여부 + 위치 동시 업데이트
        function handleScroll() {
            var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (maxScroll < 200 || window.scrollY > 200) {
                element.classList.add('sfb-visible');
            } else {
                element.classList.remove('sfb-visible');
            }
            updatePosition();
        }

        // passive: true — 스크롤을 막지 않으므로 성능 최적화
        window.addEventListener('scroll', handleScroll, { passive: true });

        // 초기 상태 체크
        handleScroll();

        return { handleScroll: handleScroll, updatePosition: updatePosition };
    },
};
