// cms-tracker.js
// 페이지 조회수(VIEW) + 컴포넌트 클릭수(CLICK) 트래킹 스크립트
// 배포 시 HTML에 자동 주입됨: <script src="/cms-tracker.js" data-page-id="{pageId}" data-cms-url="{cmsUrl}"></script>

(function () {
    const script = document.currentScript;
    const pageId = script && script.getAttribute('data-page-id');
    if (!pageId) return;

    // CMS 서버 URL — 운영 서버 분리 시에도 CMS API로 전송
    const cmsUrl = (script && script.getAttribute('data-cms-url')) || '';
    const viewUrl = cmsUrl + '/api/track/view';
    const clickUrl = cmsUrl + '/api/track/click';

    // 페이지 조회 전송
    // text/plain — CORS simple request이므로 preflight 없이 크로스오리진 전송 가능
    try {
        navigator.sendBeacon(
            viewUrl,
            new Blob([JSON.stringify({ pageId: pageId })], { type: 'text/plain' }),
        );
    } catch (e) {
        console.error('CMS Tracker (view) failed:', e);
    }

    // 컴포넌트 클릭 전송
    document.addEventListener('click', function (e) {
        const el = e.target.closest('[data-component-id]');
        if (!el) return;
        const componentId = el.getAttribute('data-component-id');
        if (!componentId) return;

        try {
            navigator.sendBeacon(
                clickUrl,
                new Blob([JSON.stringify({ pageId: pageId, componentId: componentId })], {
                    type: 'text/plain',
                }),
            );
        } catch (ex) {
            console.error('CMS Tracker (click) failed:', ex);
        }
    });
})();
