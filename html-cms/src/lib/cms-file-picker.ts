/**
 * @file cms-file-picker.ts
 * @description
 *   승인된 CMS 이미지 선택기(`/cms/files`)를 에디터 내 iframe 모달로 띄우는 유틸.
 *
 *   이전에는 `window.open` 기반 팝업 창을 사용했으나 다음 문제가 있었다:
 *     - 주소창에 `/cms/files` URL이 그대로 노출
 *     - 브라우저 팝업 차단에 막힐 수 있음
 *     - 에디터와 분리된 독립 창이라 수명 관리가 불편
 *
 *   현재 구현은 `document.body`에 오버레이 + iframe 을 직접 주입해
 *   에디터 DOM 내부 모달로 표시한다. iframe 안의 AssetBrowser 가
 *   선택 완료 시 `window.parent.postMessage({type:'ASSETS_SELECTED',urls})`를,
 *   닫기(X) 시 `PICKER_CLOSE` 를 부모에 전달한다.
 *
 *   호출부 API(`openCmsFilesPicker(onSelect) => cleanup`)는 이전과 동일하므로
 *   6개 에디터(EventBanner, PopupBanner, AuthCenterIcon, ProductMenuIcon,
 *   SlideEditor, FlexList)의 기존 호출 코드는 수정 없이 iframe 모달로 전환된다.
 *
 * @example
 *   const cleanup = openCmsFilesPicker((url) => {
 *     updateSlide(idx, { imageUrl: url });
 *   });
 *   // 필요 시 수동 취소: cleanup();
 */
import { nextApi } from '@/lib/api-url';
import { attachResizeHandles, centerInitialBox } from '@/lib/resizable-box';

/** 단건 URL만 콜백으로 전달하기 위해 postMessage payload에서 첫 URL을 추출 */
function extractFirstAssetUrl(data: unknown): string | null {
    if (!data || typeof data !== 'object') return null;

    const message = data as { type?: string; url?: string; urls?: string[] };

    if (message.type === 'ASSET_SELECTED' && typeof message.url === 'string' && message.url) {
        return message.url;
    }

    if (message.type === 'ASSETS_SELECTED' && Array.isArray(message.urls) && message.urls[0]) {
        return message.urls[0];
    }

    return null;
}

/** 이중 오픈 방지를 위한 모달 DOM id — 한 번에 하나만 존재 */
const MODAL_ID = 'spw-cms-file-picker-modal';

/**
 * 승인된 이미지 선택 모달을 연다.
 * @param onSelect 이미지 선택 시 호출되는 콜백 (URL 1건)
 * @returns cleanup 함수 — 호출 시 모달을 즉시 닫고 리스너 제거
 */
export function openCmsFilesPicker(onSelect: (url: string) => void) {
    // 이미 열려 있는 모달이 있으면 제거 (예: 연타로 열기 시도)
    const existing = document.getElementById(MODAL_ID);
    if (existing) existing.remove();

    // 오버레이 — 반투명 배경. 외곽 클릭 시 닫기.
    // z-index: 편집 패널(EventBanner 등)이 99998/99999, TableEditorModal이 100001을 사용 →
    // 이들 모두 위에 뜨도록 1,000,000 부여. (picker는 편집 패널에서 호출되므로 반드시 최상위)
    // 박스를 absolute 로 띄우기 위해 flex 중앙배치는 제거 — 중앙 배치는 centerInitialBox 가 담당.
    const overlay = document.createElement('div');
    overlay.id = MODAL_ID;
    overlay.style.cssText = ['position:fixed', 'inset:0', 'z-index:1000000', 'background:rgba(0,0,0,0.5)'].join(';');

    // 모달 컨테이너 — 절대 위치, 크기·좌표는 centerInitialBox 에서 px 단위로 직접 설정
    const box = document.createElement('div');
    box.style.cssText = [
        'position:absolute',
        'background:#ffffff',
        'border-radius:8px',
        'overflow:hidden',
        'box-shadow:0 20px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04)',
    ].join(';');

    // iframe — AssetBrowser 렌더. src는 basePath 반영된 절대 경로.
    const iframe = document.createElement('iframe');
    iframe.src = nextApi('/files');
    iframe.title = '이미지 선택';
    iframe.style.cssText = 'width:100%;height:100%;border:0;display:block';

    box.appendChild(iframe);
    overlay.appendChild(box);

    // 오버레이(iframe 바깥) 클릭 시 닫기 — iframe 내부 클릭은 이벤트가 올라오지 않음
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) cleanup();
    });

    const handleMessage = (event: MessageEvent) => {
        // iframe 내부 X 버튼 → 선택 없이 닫기
        if (typeof event.data === 'object' && event.data !== null) {
            const type = (event.data as { type?: string }).type;
            if (type === 'PICKER_CLOSE') {
                cleanup();
                return;
            }
        }

        const url = extractFirstAssetUrl(event.data);
        if (!url) return;

        cleanup();
        onSelect(url);
        window.focus();
    };

    // 드래그 리사이즈 핸들 detach 함수 — cleanup 시 호출하여 핸들 DOM 제거
    // (overlay 자체를 remove 하면 핸들도 같이 사라지지만, 명시적으로 정리)
    let detachResize: (() => void) | null = null;

    function cleanup() {
        window.removeEventListener('message', handleMessage);
        detachResize?.();
        overlay.remove();
    }

    window.addEventListener('message', handleMessage);
    document.body.appendChild(overlay);

    // DOM에 붙인 뒤 초기 중앙 배치 + 8방향 드래그 리사이즈 활성화
    centerInitialBox(box, { width: 1280, height: 900 });
    detachResize = attachResizeHandles(box, { minWidth: 480, minHeight: 360 });

    return cleanup;
}
