/**
 * @file resizable-box.ts
 * @description
 *   임의의 DOM 박스에 8방향(상·하·좌·우 + 4개 코너) 드래그 리사이즈 핸들을 부착하는 유틸.
 *
 *   박스는 반드시 `position: fixed | absolute` 이고 `left/top/width/height`가 픽셀 단위로
 *   설정되어 있어야 한다(호출 쪽에서 초기 배치 필요). 유틸은 8개의 투명 핸들 div 를 박스
 *   내부에 추가하고, 마우스 드래그로 해당 방향의 변을/모서리를 조절하여 박스 크기를
 *   재계산하고 적용한다.
 *
 *   iframe 위에서 드래그할 때 mousemove 가 부모로 전달되지 않는 문제를 방지하기 위해
 *   드래그 중엔 박스 내부 모든 iframe 에 `pointer-events: none` 을 일시 적용한다.
 *
 * @example
 *   const detach = attachResizeHandles(boxEl, { minWidth: 400, minHeight: 300 });
 *   // 필요 시 핸들 제거: detach();
 */

export interface ResizableOptions {
    /** 최소 너비(px). 기본 400 */
    minWidth?: number;
    /** 최소 높이(px). 기본 300 */
    minHeight?: number;
}

/**
 * 박스 요소에 8방향 리사이즈 핸들을 부착.
 * @returns 핸들·이벤트를 모두 제거하는 cleanup 함수
 */
export function attachResizeHandles(box: HTMLElement, options: ResizableOptions = {}): () => void {
    const minWidth = options.minWidth ?? 400;
    const minHeight = options.minHeight ?? 300;

    // 핸들 정의 — dir 문자에 포함된 n/s/e/w 로 어떤 변·모서리를 움직일지 판별
    const handleDefs: Array<{ dir: 'n' | 's' | 'w' | 'e' | 'nw' | 'ne' | 'sw' | 'se'; cursor: string }> = [
        { dir: 'n', cursor: 'ns-resize' },
        { dir: 's', cursor: 'ns-resize' },
        { dir: 'w', cursor: 'ew-resize' },
        { dir: 'e', cursor: 'ew-resize' },
        { dir: 'nw', cursor: 'nwse-resize' },
        { dir: 'ne', cursor: 'nesw-resize' },
        { dir: 'sw', cursor: 'nesw-resize' },
        { dir: 'se', cursor: 'nwse-resize' },
    ];

    /** 핸들의 위치·크기 인라인 스타일. 변(6px 띠) / 코너(14px 정사각) */
    function handleStyle(dir: string): string {
        const edge = 6;
        const corner = 14;
        switch (dir) {
            case 'n':
                return `top:0;left:0;right:0;height:${edge}px`;
            case 's':
                return `bottom:0;left:0;right:0;height:${edge}px`;
            case 'w':
                return `left:0;top:0;bottom:0;width:${edge}px`;
            case 'e':
                return `right:0;top:0;bottom:0;width:${edge}px`;
            case 'nw':
                return `top:0;left:0;width:${corner}px;height:${corner}px`;
            case 'ne':
                return `top:0;right:0;width:${corner}px;height:${corner}px`;
            case 'sw':
                return `bottom:0;left:0;width:${corner}px;height:${corner}px`;
            case 'se':
                return `bottom:0;right:0;width:${corner}px;height:${corner}px`;
            default:
                return '';
        }
    }

    const createdHandles: HTMLDivElement[] = [];

    function startResize(e: MouseEvent, dir: string) {
        // 오버레이의 click 등 상위 이벤트와 분리
        e.preventDefault();
        e.stopPropagation();

        const startX = e.clientX;
        const startY = e.clientY;
        const rect = box.getBoundingClientRect();
        const startWidth = rect.width;
        const startHeight = rect.height;
        const startLeft = rect.left;
        const startTop = rect.top;

        // 드래그 중 텍스트 선택 깜빡임 방지
        const prevBodyUserSelect = document.body.style.userSelect;
        document.body.style.userSelect = 'none';

        // 박스 내부 iframe 은 mouse 이벤트를 가로채므로 드래그 동안만 pointer-events 차단
        const iframes = Array.from(box.querySelectorAll('iframe'));
        const prevPointerEvents = iframes.map((ifr) => ifr.style.pointerEvents);
        iframes.forEach((ifr) => {
            ifr.style.pointerEvents = 'none';
        });

        function onMove(ev: MouseEvent) {
            const dx = ev.clientX - startX;
            const dy = ev.clientY - startY;

            let newLeft = startLeft;
            let newTop = startTop;
            let newWidth = startWidth;
            let newHeight = startHeight;

            if (dir.includes('e')) {
                newWidth = Math.max(minWidth, startWidth + dx);
            }
            if (dir.includes('w')) {
                // 왼쪽 변을 움직일 때는 width 가 작아지는 만큼 left 가 커진다
                const w = Math.max(minWidth, startWidth - dx);
                newLeft = startLeft + (startWidth - w);
                newWidth = w;
            }
            if (dir.includes('s')) {
                newHeight = Math.max(minHeight, startHeight + dy);
            }
            if (dir.includes('n')) {
                const h = Math.max(minHeight, startHeight - dy);
                newTop = startTop + (startHeight - h);
                newHeight = h;
            }

            // 뷰포트 경계 안으로 보정 (모달이 밖으로 나가 선택 불가 상태가 되는 사고 방지)
            newLeft = Math.max(0, Math.min(window.innerWidth - newWidth, newLeft));
            newTop = Math.max(0, Math.min(window.innerHeight - newHeight, newTop));

            box.style.left = `${newLeft}px`;
            box.style.top = `${newTop}px`;
            box.style.width = `${newWidth}px`;
            box.style.height = `${newHeight}px`;
        }

        function onUp() {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            document.body.style.userSelect = prevBodyUserSelect;
            iframes.forEach((ifr, i) => {
                ifr.style.pointerEvents = prevPointerEvents[i];
            });
        }

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    }

    for (const def of handleDefs) {
        const h = document.createElement('div');
        h.dataset.resizeHandle = def.dir;
        h.style.cssText = [
            'position:absolute',
            handleStyle(def.dir),
            `cursor:${def.cursor}`,
            // z-index 은 iframe(기본 auto) 보다 위, 모달 내부의 다른 절대 배치 요소는 없다고 가정
            'z-index:10',
            // 시각적으로는 투명 — 커서 변화로 존재를 알림
            'background:transparent',
            // 터치 환경에서 스크롤과 충돌하지 않도록 pan-y 만 허용
            'touch-action:none',
        ].join(';');
        h.addEventListener('mousedown', (e) => startResize(e, def.dir));
        box.appendChild(h);
        createdHandles.push(h);
    }

    return () => {
        for (const h of createdHandles) {
            h.remove();
        }
    };
}

/**
 * 박스 초기 중앙 배치 계산 헬퍼.
 * 화면 중앙에 orig 크기로 두되, 화면이 좁으면 95vw/95vh 로 축소.
 */
export function centerInitialBox(
    box: HTMLElement,
    orig: { width: number; height: number },
    maxViewportRatio = 0.95,
): void {
    const width = Math.min(orig.width, window.innerWidth * maxViewportRatio);
    const height = Math.min(orig.height, window.innerHeight * maxViewportRatio);
    const left = Math.max(0, (window.innerWidth - width) / 2);
    const top = Math.max(0, (window.innerHeight - height) / 2);
    box.style.left = `${left}px`;
    box.style.top = `${top}px`;
    box.style.width = `${width}px`;
    box.style.height = `${height}px`;
}
