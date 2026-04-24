/**
 * 공유 컬러 피커 유틸리티
 *
 * ContentBuilder에 등록된 색상 팔레트(window.__cmsColors)를 사용합니다.
 * 플러그인 에디터에서 import해서 재사용합니다.
 *
 * 사용 예:
 *   import { createColorSection } from '../_shared/color-picker.js';
 *
 *   container.appendChild(createColorSection([
 *       { label: '제목색',  value: '#0046A4', onChange: (v) => { el.style.color = v; cb?.(); } },
 *       { label: '배경색',  value: '#ffffff', onChange: (v) => { el.style.background = v; cb?.(); } },
 *   ]));
 */

// EditClient.tsx에서 window.__cmsColors로 노출한 팔레트 — 없으면 기본값 사용
const FALLBACK_COLORS = [
    '#004B9C', '#0064C8', '#5B9BD5', '#BDD7EE',
    '#008C6A', '#00A887', '#5EC4A8', '#B7E3D8',
    '#FFBC00', '#FFD966', '#594A2E', '#C9B07A',
    '#003DA5', '#0046FF', '#5B78D5', '#B4C2F0',
    '#000000', '#404040', '#808080', '#BFBFBF', '#FFFFFF',
    '#FF0000', '#FF6600', '#FFFF00', '#00FF00', '#00FFFF',
    '#0000FF', '#8000FF', '#FF00FF', '#FF0080',
];

function getColors() {
    return (typeof window !== 'undefined' && window.__cmsColors) || FALLBACK_COLORS;
}

/**
 * CSS 색상값(hex, rgb, rgba)을 #RRGGBB hex 문자열로 정규화합니다.
 * 브라우저가 style.color / style.background를 rgb() 형식으로 반환하는 경우를 처리합니다.
 * 변환 불가한 값은 null을 반환합니다.
 *
 * @param {string} value - CSS 색상 문자열
 * @returns {string|null} - '#RRGGBB' 형식 hex 또는 null
 */
export function toHex(value) {
    if (!value) return null;
    const v = value.trim();
    // 이미 #RRGGBB 형식
    if (/^#[0-9a-fA-F]{6}$/.test(v)) return v.toUpperCase();
    // #RGB 단축형 → #RRGGBB
    if (/^#[0-9a-fA-F]{3}$/.test(v)) {
        return ('#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3]).toUpperCase();
    }
    // rgb(r, g, b) 또는 rgba(r, g, b, a)
    const m = v.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (m) {
        return '#' + [m[1], m[2], m[3]]
            .map(n => parseInt(n, 10).toString(16).padStart(2, '0'))
            .join('').toUpperCase();
    }
    return null;
}

// 전역 팝업 — 동시에 하나만 열림
let _activePopup = null;
let _activeHandler = null;

function closePopup() {
    if (_activePopup) { _activePopup.remove(); _activePopup = null; }
    if (_activeHandler) { document.removeEventListener('click', _activeHandler, true); _activeHandler = null; }
}

/**
 * 단일 색상 필드를 생성합니다.
 * 레이블 + 색상 스와치(클릭 → 팔레트 팝업) + hex 직접 입력
 *
 * @param {object}   options
 * @param {string}   options.label     - 레이블 텍스트
 * @param {string}   options.value     - 초기 색상값 (hex, 예: '#0046A4')
 * @param {function} options.onChange  - 색상 변경 콜백 (hex값 문자열 전달)
 * @returns {HTMLElement}
 */
export function createColorField({ label, value = '#000000', onChange }) {
    // rgb() 등 브라우저 정규화 형식을 hex로 변환
    const normalizedValue = toHex(value) || '#000000';

    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:center;gap:6px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:5px 8px;';

    const lbl = document.createElement('span');
    lbl.textContent = label;
    lbl.style.cssText = 'font-size:11px;color:#6b7280;flex:1;white-space:nowrap;min-width:0;overflow:hidden;text-overflow:ellipsis;';

    // 현재 색상 스와치 (클릭 → 팝업)
    const swatch = document.createElement('button');
    swatch.style.cssText = `width:24px;height:24px;border-radius:4px;border:1.5px solid #d1d5db;cursor:pointer;background:${normalizedValue};flex-shrink:0;padding:0;min-height:unset;transition:border-color 0.12s;`;
    swatch.title = '색상 선택';
    swatch.addEventListener('mouseenter', () => { swatch.style.borderColor = '#0046A4'; });
    swatch.addEventListener('mouseleave', () => { swatch.style.borderColor = '#d1d5db'; });

    // hex 직접 입력
    const hexInput = document.createElement('input');
    hexInput.type = 'text';
    hexInput.value = normalizedValue;
    hexInput.maxLength = 7;
    hexInput.placeholder = '#000000';
    hexInput.style.cssText = 'width:58px;padding:2px 4px;border:1px solid #e5e7eb;border-radius:4px;font-size:11px;font-family:monospace;color:#374151;background:#fff;outline:none;flex-shrink:0;';

    // 현재 확정된 hex 값 추적 (브라우저 rgb() 정규화 우회용)
    let currentHex = normalizedValue;

    const applyHex = (hex) => {
        currentHex = hex;
        swatch.style.background = hex;
        hexInput.value = hex.toUpperCase();
        onChange?.(hex);
    };

    hexInput.addEventListener('input', () => {
        const v = hexInput.value.trim();
        if (/^#[0-9a-fA-F]{6}$/.test(v)) {
            currentHex = v;
            swatch.style.background = v;
            onChange?.(v);
        }
    });
    hexInput.addEventListener('blur', () => {
        // 유효하지 않으면 마지막으로 확정된 hex 값으로 복원
        if (!/^#[0-9a-fA-F]{6}$/.test(hexInput.value)) {
            hexInput.value = currentHex.toUpperCase();
        }
    });
    hexInput.addEventListener('mousedown', (e) => e.stopPropagation());

    // 팔레트 팝업
    swatch.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closePopup();

        const popup = document.createElement('div');
        popup.style.cssText = 'position:fixed;z-index:99999;background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:10px;box-shadow:0 6px 24px rgba(0,0,0,0.14);width:186px;';

        const popTitle = document.createElement('div');
        popTitle.textContent = '색상 선택';
        popTitle.style.cssText = 'font-size:11px;font-weight:700;color:#6b7280;margin-bottom:8px;letter-spacing:0.3px;';
        popup.appendChild(popTitle);

        const grid = document.createElement('div');
        grid.style.cssText = 'display:grid;grid-template-columns:repeat(6,1fr);gap:4px;';

        getColors().forEach(color => {
            const dot = document.createElement('button');
            const isWhite = color.toUpperCase() === '#FFFFFF';
            dot.style.cssText = `width:24px;height:24px;border-radius:4px;border:1.5px solid ${isWhite ? '#d1d5db' : 'transparent'};background:${color};cursor:pointer;padding:0;min-height:unset;transition:transform 0.1s,border-color 0.1s,box-shadow 0.1s;`;
            dot.title = color.toUpperCase();
            dot.addEventListener('mouseenter', () => {
                dot.style.transform = 'scale(1.2)';
                dot.style.borderColor = '#0046A4';
                dot.style.boxShadow = '0 2px 6px rgba(0,70,164,0.3)';
            });
            dot.addEventListener('mouseleave', () => {
                dot.style.transform = '';
                dot.style.borderColor = isWhite ? '#d1d5db' : 'transparent';
                dot.style.boxShadow = '';
            });
            dot.addEventListener('click', (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                applyHex(color);
                closePopup();
            });
            grid.appendChild(dot);
        });
        popup.appendChild(grid);

        document.body.appendChild(popup);

        const rect = swatch.getBoundingClientRect();
        let top  = rect.bottom + 6;
        let left = rect.left;
        if (left + 186 > window.innerWidth - 8)  left = window.innerWidth - 194;
        if (top  + 230 > window.innerHeight - 8)  top  = rect.top - 236;
        popup.style.top  = top  + 'px';
        popup.style.left = left + 'px';

        _activePopup = popup;
        _activeHandler = (ev) => {
            if (!popup.contains(ev.target) && ev.target !== swatch) closePopup();
        };
        setTimeout(() => document.addEventListener('click', _activeHandler, true), 0);
    });

    wrap.appendChild(lbl);
    wrap.appendChild(swatch);
    wrap.appendChild(hexInput);
    return wrap;
}

/**
 * 색상 섹션 블록을 생성합니다 (섹션 제목 + 2열 그리드).
 *
 * @param {Array<{label: string, value: string, onChange: function}>} fields
 * @returns {HTMLElement}
 */
export function createColorSection(fields) {
    const section = document.createElement('div');

    const title = document.createElement('div');
    title.textContent = '색상';
    title.style.cssText = 'font-size:12px;font-weight:700;color:#374151;margin:10px 0 8px;border-top:1px solid #f3f4f6;padding-top:10px;';
    section.appendChild(title);

    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:4px;';
    fields.forEach(f => grid.appendChild(createColorField(f)));
    section.appendChild(grid);

    return section;
}
