// public/assets/plugins/loan-calculator/index.js

/*
Usage:
<div data-cb-type="loan-calculator">
    <div class="lc-tabs">
        <button class="lc-tab active" data-type="loan">대출</button>
        <button class="lc-tab" data-type="deposit">예금</button>
        <button class="lc-tab" data-type="savings">적금</button>
    </div>
    <div class="lc-body">
        <div class="lc-panel" data-type="loan">
            <div class="lc-field">
                <label class="lc-label">대출금액</label>
                <div class="lc-input-wrap">
                    <input type="number" inputmode="numeric" class="lc-input" data-key="principal" value="10000" min="100" max="500000" step="100"/>
                    <span class="lc-unit">만원</span>
                </div>
                <input type="range" class="lc-range" data-key="principal" min="100" max="500000" step="100" value="10000"/>
                <div class="lc-range-labels"><span>100만원</span><span>50억원</span></div>
            </div>
            <div class="lc-field">
                <label class="lc-label">금리 (연)</label>
                <div class="lc-input-wrap">
                    <input type="number" inputmode="decimal" class="lc-input" data-key="rate" value="5.0" min="0.1" max="30" step="0.1"/>
                    <span class="lc-unit">%</span>
                </div>
                <input type="range" class="lc-range" data-key="rate" min="0.1" max="30" step="0.1" value="5.0"/>
                <div class="lc-range-labels"><span>0.1%</span><span>30%</span></div>
            </div>
            <div class="lc-field">
                <label class="lc-label">대출기간</label>
                <div class="lc-input-wrap">
                    <input type="number" inputmode="numeric" class="lc-input" data-key="period" value="12" min="1" max="360" step="1"/>
                    <span class="lc-unit">개월</span>
                </div>
                <input type="range" class="lc-range" data-key="period" min="1" max="360" step="1" value="12"/>
                <div class="lc-range-labels"><span>1개월</span><span>30년</span></div>
            </div>
        </div>
        <div class="lc-panel" data-type="deposit" style="display:none">
            <div class="lc-field">
                <label class="lc-label">예치금액</label>
                <div class="lc-input-wrap">
                    <input type="number" inputmode="numeric" class="lc-input" data-key="principal" value="1000" min="10" max="1000000" step="10"/>
                    <span class="lc-unit">만원</span>
                </div>
                <input type="range" class="lc-range" data-key="principal" min="10" max="1000000" step="10" value="1000"/>
                <div class="lc-range-labels"><span>10만원</span><span>100억원</span></div>
            </div>
            <div class="lc-field">
                <label class="lc-label">금리 (연)</label>
                <div class="lc-input-wrap">
                    <input type="number" inputmode="decimal" class="lc-input" data-key="rate" value="3.5" min="0.1" max="20" step="0.1"/>
                    <span class="lc-unit">%</span>
                </div>
                <input type="range" class="lc-range" data-key="rate" min="0.1" max="20" step="0.1" value="3.5"/>
                <div class="lc-range-labels"><span>0.1%</span><span>20%</span></div>
            </div>
            <div class="lc-field">
                <label class="lc-label">예치기간</label>
                <div class="lc-input-wrap">
                    <input type="number" inputmode="numeric" class="lc-input" data-key="period" value="12" min="1" max="60" step="1"/>
                    <span class="lc-unit">개월</span>
                </div>
                <input type="range" class="lc-range" data-key="period" min="1" max="60" step="1" value="12"/>
                <div class="lc-range-labels"><span>1개월</span><span>60개월</span></div>
            </div>
        </div>
        <div class="lc-panel" data-type="savings" style="display:none">
            <div class="lc-field">
                <label class="lc-label">월 납입금액</label>
                <div class="lc-input-wrap">
                    <input type="number" inputmode="numeric" class="lc-input" data-key="monthly" value="100" min="1" max="10000" step="1"/>
                    <span class="lc-unit">만원</span>
                </div>
                <input type="range" class="lc-range" data-key="monthly" min="1" max="10000" step="1" value="100"/>
                <div class="lc-range-labels"><span>1만원</span><span>1억원</span></div>
            </div>
            <div class="lc-field">
                <label class="lc-label">금리 (연)</label>
                <div class="lc-input-wrap">
                    <input type="number" inputmode="decimal" class="lc-input" data-key="rate" value="4.0" min="0.1" max="20" step="0.1"/>
                    <span class="lc-unit">%</span>
                </div>
                <input type="range" class="lc-range" data-key="rate" min="0.1" max="20" step="0.1" value="4.0"/>
                <div class="lc-range-labels"><span>0.1%</span><span>20%</span></div>
            </div>
            <div class="lc-field">
                <label class="lc-label">적금기간</label>
                <div class="lc-input-wrap">
                    <input type="number" inputmode="numeric" class="lc-input" data-key="period" value="24" min="1" max="60" step="1"/>
                    <span class="lc-unit">개월</span>
                </div>
                <input type="range" class="lc-range" data-key="period" min="1" max="60" step="1" value="24"/>
                <div class="lc-range-labels"><span>1개월</span><span>60개월</span></div>
            </div>
        </div>
        <div class="lc-result">
            <div class="lc-result-item">
                <span class="lc-result-label lc-label-monthly">월 납입금</span>
                <span class="lc-result-value lc-val-monthly">0원</span>
            </div>
            <div class="lc-result-item">
                <span class="lc-result-label lc-label-interest">총 이자</span>
                <span class="lc-result-value lc-val-interest">0원</span>
            </div>
            <div class="lc-result-item lc-result-total">
                <span class="lc-result-label lc-label-total">총 상환금액</span>
                <span class="lc-result-value lc-val-total">0원</span>
            </div>
        </div>
        <a href="#" class="lc-apply-btn">신청</a>
    </div>
</div>
*/

// ── 모듈 공용 헬퍼 (openContentEditor + mount 양쪽에서 사용) ───────────

// 범위 레이블 텍스트 포맷
function formatRangeLabel(key, val) {
    const v = Number(val);
    if (key === 'rate') return `${v}%`;
    if (key === 'period') {
        if (v % 12 === 0 && v > 0) return `${v / 12}년`;
        return `${v}개월`;
    }
    // principal, monthly (단위: 만원)
    if (v >= 10000) return `${v / 10000}억원`;
    return `${v}만원`;
}

const APPLY_FEEDBACK_MS = 1800;

export default {
    name: 'loan-calculator',
    displayName: '금융 계산기',
    version: '1.3.0',

    settings: {
        // ── 기본 탭 ──────────────────────────────────────────────
        defaultType: {
            type: 'select',
            label: '기본 탭',
            options: [
                { value: 'loan',    label: '대출' },
                { value: 'deposit', label: '예금' },
                { value: 'savings', label: '적금' },
            ],
            default: 'loan',
        },

        // ── 탭 노출 여부 ─────────────────────────────────────────
        showLoanTab: {
            type: 'boolean',
            label: '[대출] 탭 표시',
            default: true,
        },
        showDepositTab: {
            type: 'boolean',
            label: '[예금] 탭 표시',
            default: true,
        },
        showSavingsTab: {
            type: 'boolean',
            label: '[적금] 탭 표시',
            default: true,
        },

        // ── 신청 버튼 ────────────────────────────────────────────
        showApplyBtn: {
            type: 'boolean',
            label: '신청 버튼 표시',
            default: true,
        },
        applyUrl: {
            type: 'text',
            label: '신청 버튼 URL',
            default: '#',
        },
        applyBtnLabel: {
            type: 'text',
            label: '신청 버튼 텍스트',
            default: '신청',
        },

        // ── 강조 색상 ────────────────────────────────────────────
        accentColor: {
            type: 'color',
            label: '강조 색상',
            default: '#0046A4',
        },
    },

    editor: {
        openContentEditor: function(element, builder, onChange) {
            // ── 탭별 필드 정의
            // calcKey: 계산기 DOM의 data-key 속성값 (live update 대상 특정용)
            const TAB_DEFS = [
                {
                    type: 'loan',
                    label: '대출',
                    defaults: [
                        { dsKey: 'lcLoanPrincipal', calcKey: 'principal', label: '기본 금액(만원)', fallback: 10000, step: 100 },
                        { dsKey: 'lcLoanRate',      calcKey: 'rate',      label: '기본 금리(%)',    fallback: 5.0,   step: 0.1 },
                        { dsKey: 'lcLoanPeriod',    calcKey: 'period',    label: '기본 기간(개월)', fallback: 12,    step: 1,   fullWidth: true },
                    ],
                    ranges: [
                        { calcKey: 'principal', minKey: 'lcLoanPrincipalMin', maxKey: 'lcLoanPrincipalMax', label: '금액(만원)', fallbackMin: 100,  fallbackMax: 500000, step: 100 },
                        { calcKey: 'rate',      minKey: 'lcLoanRateMin',      maxKey: 'lcLoanRateMax',      label: '금리(%)',    fallbackMin: 0.1,  fallbackMax: 30,     step: 0.1 },
                        { calcKey: 'period',    minKey: 'lcLoanPeriodMin',    maxKey: 'lcLoanPeriodMax',    label: '기간(개월)', fallbackMin: 1,    fallbackMax: 360,    step: 1 },
                    ],
                },
                {
                    type: 'deposit',
                    label: '예금',
                    defaults: [
                        { dsKey: 'lcDepositPrincipal', calcKey: 'principal', label: '기본 금액(만원)', fallback: 1000, step: 10 },
                        { dsKey: 'lcDepositRate',      calcKey: 'rate',      label: '기본 금리(%)',    fallback: 3.5,  step: 0.1 },
                        { dsKey: 'lcDepositPeriod',    calcKey: 'period',    label: '기본 기간(개월)', fallback: 12,   step: 1,   fullWidth: true },
                    ],
                    ranges: [
                        { calcKey: 'principal', minKey: 'lcDepositPrincipalMin', maxKey: 'lcDepositPrincipalMax', label: '금액(만원)', fallbackMin: 10,  fallbackMax: 1000000, step: 10 },
                        { calcKey: 'rate',      minKey: 'lcDepositRateMin',      maxKey: 'lcDepositRateMax',      label: '금리(%)',    fallbackMin: 0.1, fallbackMax: 20,      step: 0.1 },
                        { calcKey: 'period',    minKey: 'lcDepositPeriodMin',    maxKey: 'lcDepositPeriodMax',    label: '기간(개월)', fallbackMin: 1,   fallbackMax: 60,      step: 1 },
                    ],
                },
                {
                    type: 'savings',
                    label: '적금',
                    defaults: [
                        { dsKey: 'lcSavingsMonthly', calcKey: 'monthly', label: '기본 월납입금(만원)', fallback: 100, step: 1 },
                        { dsKey: 'lcSavingsRate',    calcKey: 'rate',    label: '기본 금리(%)',        fallback: 4.0, step: 0.1 },
                        { dsKey: 'lcSavingsPeriod',  calcKey: 'period',  label: '기본 기간(개월)',     fallback: 24,  step: 1,   fullWidth: true },
                    ],
                    ranges: [
                        { calcKey: 'monthly', minKey: 'lcSavingsMonthlyMin', maxKey: 'lcSavingsMonthlyMax', label: '월납입금(만원)', fallbackMin: 1,   fallbackMax: 10000, step: 1 },
                        { calcKey: 'rate',    minKey: 'lcSavingsRateMin',    maxKey: 'lcSavingsRateMax',    label: '금리(%)',        fallbackMin: 0.1, fallbackMax: 20,    step: 0.1 },
                        { calcKey: 'period',  minKey: 'lcSavingsPeriodMin',  maxKey: 'lcSavingsPeriodMax',  label: '기간(개월)',     fallbackMin: 1,   fallbackMax: 60,    step: 1 },
                    ],
                },
            ];

            // dataset에서 숫자값 읽기
            const dsNum = (key, fallback) => {
                const v = parseFloat(element.dataset[key]);
                return isNaN(v) ? fallback : v;
            };

            // 계산기 패널 내 DOM 요소 조회
            const getCalcEl = (tabType, selector) =>
                element.querySelector(`.lc-panel[data-type="${tabType}"] ${selector}`);

            // 섹션 헤더 생성 (제목 + 구분선)
            const makeSectionHeader = (title) => {
                const row  = document.createElement('div');
                row.style.cssText = 'display:flex;align-items:center;gap:8px;margin:0 0 10px;';
                const span = document.createElement('span');
                span.textContent = title;
                span.style.cssText = 'font-size:11px;font-weight:700;color:#9CA3AF;letter-spacing:0.06em;text-transform:uppercase;white-space:nowrap;';
                const line = document.createElement('hr');
                line.style.cssText = 'flex:1;border:none;border-top:1px solid #E5E7EB;margin:0;';
                row.appendChild(span);
                row.appendChild(line);
                return row;
            };

            // 공통 input 스타일
            const applyInputStyle = (inp) => {
                inp.style.cssText = 'width:100%;box-sizing:border-box;border:1.5px solid #E5E7EB;border-radius:6px;padding:6px 10px;font-size:13px;color:#1A1A2E;background:#fff;outline:none;font-family:inherit;';
                inp.addEventListener('focus', () => { inp.style.borderColor = '#0046A4'; inp.style.background = '#F0F4FF'; });
                inp.addEventListener('blur',  () => { inp.style.borderColor = '#E5E7EB'; inp.style.background = '#fff'; });
            };

            // ── 기본값 필드 생성 ──────────────────────────────────
            // 수정 즉시 계산기 DOM의 value도 갱신하여 에디터 화면에 반영
            const makeDefaultField = (f, tabType) => {
                const wrap = document.createElement('div');
                if (f.fullWidth) wrap.style.gridColumn = '1 / -1';
                const lbl = document.createElement('label');
                lbl.textContent = f.label;
                lbl.style.cssText = 'display:block;font-size:11px;font-weight:600;color:#6B7280;margin-bottom:4px;';
                const inp = document.createElement('input');
                inp.type  = 'number';
                inp.step  = f.step;
                inp.value = dsNum(f.dsKey, f.fallback);
                applyInputStyle(inp);
                inp.addEventListener('input', () => {
                    const v = parseFloat(inp.value);
                    if (isNaN(v)) return;
                    // dataset 저장
                    element.dataset[f.dsKey] = v;
                    // ── 에디터 화면 즉시 반영 ──────────────────────
                    const ni = getCalcEl(tabType, `.lc-input[data-key="${f.calcKey}"]`);
                    const ri = getCalcEl(tabType, `.lc-range[data-key="${f.calcKey}"]`);
                    // value 프로퍼티(현재값)와 어트리뷰트(직렬화 대상) 모두 업데이트
                    if (ni) { ni.value = v; ni.setAttribute('value', v); }
                    if (ri) { ri.value = v; ri.setAttribute('value', v); }
                });
                wrap.appendChild(lbl);
                wrap.appendChild(inp);
                return wrap;
            };

            // ── 범위(min/max) 필드 생성 ───────────────────────────
            // 수정 즉시 계산기 DOM의 min/max 속성 및 레이블도 갱신
            const makeRangeField = (label, dsKey, fallback, step, tabType, calcKey, isMin) => {
                const wrap = document.createElement('div');
                const lbl  = document.createElement('label');
                lbl.textContent = label;
                lbl.style.cssText = 'display:block;font-size:11px;font-weight:600;color:#6B7280;margin-bottom:4px;';
                const inp = document.createElement('input');
                inp.type  = 'number';
                inp.step  = step;
                inp.value = dsNum(dsKey, fallback);
                applyInputStyle(inp);
                inp.addEventListener('input', () => {
                    const v = parseFloat(inp.value);
                    if (isNaN(v)) return;
                    // dataset 저장
                    element.dataset[dsKey] = v;
                    // ── 에디터 화면 즉시 반영 ──────────────────────
                    const attr = isMin ? 'min' : 'max';
                    const ni   = getCalcEl(tabType, `.lc-input[data-key="${calcKey}"]`);
                    const ri   = getCalcEl(tabType, `.lc-range[data-key="${calcKey}"]`);
                    if (ni) ni[attr] = v;
                    if (ri) ri[attr] = v;
                    // 범위 레이블 갱신
                    const labelSpans = ri?.closest('.lc-field')?.querySelectorAll('.lc-range-labels span');
                    if (labelSpans) {
                        const idx = isMin ? 0 : 1;
                        if (labelSpans[idx]) labelSpans[idx].textContent = formatRangeLabel(calcKey, v);
                    }
                });
                wrap.appendChild(lbl);
                wrap.appendChild(inp);
                return wrap;
            };

            // ── 최상위 컨테이너 ───────────────────────────────────
            const wrap = document.createElement('div');
            wrap.style.cssText = 'font-family:-apple-system,BlinkMacSystemFont,"Malgun Gothic","Apple SD Gothic Neo",sans-serif;font-size:13px;color:#374151;margin-bottom:16px;';

            // 안내 노트
            const note = document.createElement('div');
            note.style.cssText = 'background:#EFF6FF;border-radius:8px;padding:10px 12px;font-size:12px;color:#1E40AF;line-height:1.6;margin-bottom:14px;';
            note.innerHTML = '각 탭의 <strong>기본값</strong>과 <strong>슬라이더 범위</strong>를 설정합니다.<br>탭 노출 여부·신청 버튼은 <strong>⚙ 설정 패널</strong>에서 변경하세요.';
            wrap.appendChild(note);

            // 탭 바
            const tabBar = document.createElement('div');
            tabBar.style.cssText = 'display:flex;gap:4px;background:#F3F4F6;padding:4px;border-radius:10px;margin-bottom:14px;';
            wrap.appendChild(tabBar);

            // 탭 패널 영역
            const panelContainer = document.createElement('div');
            wrap.appendChild(panelContainer);

            const panelMap = {};

            TAB_DEFS.forEach((tabDef, idx) => {
                const isFirst = idx === 0;

                // 탭 버튼
                const btn = document.createElement('button');
                btn.textContent = tabDef.label;
                btn.dataset.lcEditorTab = tabDef.type;
                btn.style.cssText = [
                    'flex:1;height:32px;border:none;border-radius:7px;',
                    'font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.15s;',
                    `background:${isFirst ? '#fff' : 'transparent'};`,
                    `color:${isFirst ? '#0046A4' : '#6B7280'};`,
                    `box-shadow:${isFirst ? '0 1px 4px rgba(0,70,164,0.15)' : 'none'};`,
                ].join('');
                btn.addEventListener('click', () => {
                    tabBar.querySelectorAll('[data-lc-editor-tab]').forEach(b => {
                        const active = b.dataset.lcEditorTab === tabDef.type;
                        b.style.background = active ? '#fff' : 'transparent';
                        b.style.color      = active ? '#0046A4' : '#6B7280';
                        b.style.boxShadow  = active ? '0 1px 4px rgba(0,70,164,0.15)' : 'none';
                    });
                    Object.entries(panelMap).forEach(([type, panel]) => {
                        panel.style.display = type === tabDef.type ? 'block' : 'none';
                    });
                });
                tabBar.appendChild(btn);

                // 탭 패널
                const panel = document.createElement('div');
                panel.style.display = isFirst ? 'block' : 'none';
                panelMap[tabDef.type] = panel;

                // 섹션: 기본값 (비표시)
                const defaultHeader = makeSectionHeader('기본값');
                defaultHeader.style.display = 'none';
                panel.appendChild(defaultHeader);
                const defaultGrid = document.createElement('div');
                defaultGrid.style.cssText = 'display:none;';
                tabDef.defaults.forEach(f => defaultGrid.appendChild(makeDefaultField(f, tabDef.type)));
                panel.appendChild(defaultGrid);

                // 섹션: 슬라이더 범위
                panel.appendChild(makeSectionHeader('슬라이더 범위'));
                const rangeGrid = document.createElement('div');
                rangeGrid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:8px;';
                tabDef.ranges.forEach(r => {
                    rangeGrid.appendChild(makeRangeField(`${r.label} 최소`, r.minKey, r.fallbackMin, r.step, tabDef.type, r.calcKey, true));
                    rangeGrid.appendChild(makeRangeField(`${r.label} 최대`, r.maxKey, r.fallbackMax, r.step, tabDef.type, r.calcKey, false));
                });
                panel.appendChild(rangeGrid);

                panelContainer.appendChild(panel);
            });

            // ── 적용 버튼 ──────────────────────────────────────────
            const applyRow = document.createElement('div');
            applyRow.style.cssText = 'margin-top:16px;display:flex;align-items:center;gap:10px;';

            const applyBtn = document.createElement('button');
            applyBtn.textContent = '적용';
            applyBtn.style.cssText = [
                'flex:1;height:36px;border:none;border-radius:8px;cursor:pointer;',
                'background:#0046A4;color:#fff;font-size:13px;font-weight:700;',
                'font-family:inherit;transition:opacity 0.15s;',
            ].join('');

            const applyMsg = document.createElement('span');
            applyMsg.style.cssText = 'font-size:12px;color:#16A34A;font-weight:600;opacity:0;transition:opacity 0.3s;white-space:nowrap;';
            applyMsg.textContent = '✓ 적용됨';

            applyBtn.addEventListener('mouseenter', () => { applyBtn.style.opacity = '0.85'; });
            applyBtn.addEventListener('mouseleave', () => { applyBtn.style.opacity = '1'; });
            applyBtn.addEventListener('click', () => {
                onChange();
                applyMsg.style.opacity = '1';
                setTimeout(() => { applyMsg.style.opacity = '0'; }, APPLY_FEEDBACK_MS);
            });

            applyRow.appendChild(applyBtn);
            applyRow.appendChild(applyMsg);
            wrap.appendChild(applyRow);

            return wrap;
        },
    },

    mount: function(element, options) {
        // accent 색상 적용
        const accent = element.getAttribute('data-cb-accent-color') || element.dataset.lcAccent || element.style.getPropertyValue('--lc-accent').trim() || '#0046A4';
        element.style.setProperty('--lc-accent', accent);

        const tabs   = element.querySelectorAll('.lc-tab');
        const panels = element.querySelectorAll('.lc-panel');

        // ── 1. 탭 노출 여부 계산 (최소 1개 보장) ─────────────────
        const tabVisibility = {
            loan:    options.showLoanTab !== false,
            deposit: options.showDepositTab !== false,
            savings: options.showSavingsTab !== false,
        };
        if (Object.values(tabVisibility).every(v => !v)) tabVisibility.loan = true;

        // ── 2. 탭 버튼 / 패널 숨김 처리 ─────────────────────────
        tabs.forEach(tab => {
            tab.style.display = tabVisibility[tab.dataset.type] ? '' : 'none';
        });
        panels.forEach(panel => {
            if (!tabVisibility[panel.dataset.type]) panel.style.display = 'none';
        });

        // ── 3. currentType — 숨겨진 탭이면 첫 번째 노출 탭으로 보정
        let currentType = options.defaultType || 'loan';
        if (!tabVisibility[currentType]) {
            currentType = Object.keys(tabVisibility).find(k => tabVisibility[k]) || 'loan';
        }

        // ── 4. dataset에서 숫자값 읽기 헬퍼 ─────────────────────
        const ds = (key, fallback) => {
            const v = parseFloat(element.dataset[key]);
            return isNaN(v) ? fallback : v;
        };

        // ── 5. 슬라이더 범위 → DOM 반영 (syncPair 등록 전 필수) ──
        const rangeConfig = {
            loan: {
                principal: { min: ds('lcLoanPrincipalMin', null), max: ds('lcLoanPrincipalMax', null) },
                rate:      { min: ds('lcLoanRateMin',      null), max: ds('lcLoanRateMax',      null) },
                period:    { min: ds('lcLoanPeriodMin',    null), max: ds('lcLoanPeriodMax',    null) },
            },
            deposit: {
                principal: { min: ds('lcDepositPrincipalMin', null), max: ds('lcDepositPrincipalMax', null) },
                rate:      { min: ds('lcDepositRateMin',      null), max: ds('lcDepositRateMax',      null) },
                period:    { min: ds('lcDepositPeriodMin',    null), max: ds('lcDepositPeriodMax',    null) },
            },
            savings: {
                monthly: { min: ds('lcSavingsMonthlyMin', null), max: ds('lcSavingsMonthlyMax', null) },
                rate:    { min: ds('lcSavingsRateMin',    null), max: ds('lcSavingsRateMax',    null) },
                period:  { min: ds('lcSavingsPeriodMin',  null), max: ds('lcSavingsPeriodMax',  null) },
            },
        };

        panels.forEach(panel => {
            const tabType = panel.dataset.type;
            const config  = rangeConfig[tabType] || {};
            Object.entries(config).forEach(([key, { min, max }]) => {
                if (min == null && max == null) return;
                const numInput   = panel.querySelector(`.lc-input[data-key="${key}"]`);
                const rangeInput = panel.querySelector(`.lc-range[data-key="${key}"]`);
                if (numInput) {
                    if (min != null) numInput.min = min;
                    if (max != null) numInput.max = max;
                }
                if (rangeInput) {
                    if (min != null) rangeInput.min = min;
                    if (max != null) rangeInput.max = max;
                    const labelSpans = rangeInput.closest('.lc-field')?.querySelectorAll('.lc-range-labels span');
                    if (labelSpans) {
                        if (labelSpans[0] && min != null) labelSpans[0].textContent = formatRangeLabel(key, min);
                        if (labelSpans[1] && max != null) labelSpans[1].textContent = formatRangeLabel(key, max);
                    }
                }
            });
        });

        // ── 6. 탭별 기본값 → DOM 반영 (syncPair 등록 전 필수) ────
        const defaultValues = {
            loan: {
                principal: ds('lcLoanPrincipal', 10000),
                rate:      ds('lcLoanRate',      5.0),
                period:    ds('lcLoanPeriod',    12),
            },
            deposit: {
                principal: ds('lcDepositPrincipal', 1000),
                rate:      ds('lcDepositRate',      3.5),
                period:    ds('lcDepositPeriod',    12),
            },
            savings: {
                monthly: ds('lcSavingsMonthly', 100),
                rate:    ds('lcSavingsRate',    4.0),
                period:  ds('lcSavingsPeriod',  24),
            },
        };

        panels.forEach(panel => {
            const tabType  = panel.dataset.type;
            const defaults = defaultValues[tabType] || {};
            Object.entries(defaults).forEach(([key, val]) => {
                if (val == null) return;
                const numInput   = panel.querySelector(`.lc-input[data-key="${key}"]`);
                const rangeInput = panel.querySelector(`.lc-range[data-key="${key}"]`);
                if (numInput)   numInput.value   = val;
                if (rangeInput) rangeInput.value = val;
            });
        });

        // ── 7. 탭 전환 ───────────────────────────────────────────
        const switchTab = (type) => {
            currentType = type;
            tabs.forEach(t => t.classList.toggle('active', t.dataset.type === type));
            panels.forEach(p => {
                if (!tabVisibility[p.dataset.type]) return;
                p.style.display = p.dataset.type === type ? 'block' : 'none';
            });
            calculate();
        };

        tabs.forEach(tab => {
            if (!tabVisibility[tab.dataset.type]) return;
            tab.addEventListener('click', () => switchTab(tab.dataset.type));
        });

        // ── 8. 신청 버튼 ─────────────────────────────────────────
        const applyBtn = element.querySelector('.lc-apply-btn');
        if (applyBtn) {
            applyBtn.style.display = options.showApplyBtn !== false ? 'flex' : 'none';
            if (options.applyUrl)      applyBtn.setAttribute('href', options.applyUrl);
            if (options.applyBtnLabel) applyBtn.textContent = options.applyBtnLabel;
            applyBtn.addEventListener('click', (e) => {
                const href = applyBtn.getAttribute('href');
                if (!href || href === '#') e.preventDefault();
            });
        }

        // ── 9. 금액 포맷 헬퍼 ────────────────────────────────────
        const formatWon = (n) => {
            if (!isFinite(n) || isNaN(n)) return '계산 불가';
            if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억원`;
            if (n >= 10000)     return `${Math.round(n / 10000).toLocaleString()}만원`;
            return `${Math.round(n).toLocaleString()}원`;
        };

        // debounce 유틸
        const debounce = (fn, ms) => {
            let timer;
            return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
        };

        // ── 10. 계산 함수 ─────────────────────────────────────────
        const calculate = () => {
            const panel = element.querySelector(`.lc-panel[data-type="${currentType}"]`);
            if (!panel) return;

            // getVal: 현재 input 값을 실시간 min/max로 클램핑
            const getVal = (key) => {
                const el = panel.querySelector(`.lc-input[data-key="${key}"]`);
                if (!el) return 0;
                const v   = parseFloat(el.value);
                if (isNaN(v)) return 0;
                const min = parseFloat(el.min);
                const max = parseFloat(el.max);
                return Math.min(Math.max(v, min), max);
            };

            const monthly    = element.querySelector('.lc-val-monthly');
            const interest   = element.querySelector('.lc-val-interest');
            const total      = element.querySelector('.lc-val-total');
            const lblMonthly = element.querySelector('.lc-label-monthly');
            const lblTotal   = element.querySelector('.lc-label-total');

            if (currentType === 'loan') {
                if (lblMonthly) lblMonthly.textContent = '월 납입금';
                if (lblTotal)   lblTotal.textContent   = '총 상환금액';
                const P = getVal('principal') * 10000;
                const r = getVal('rate') / 100 / 12;
                const n = getVal('period');
                if (P <= 0 || n <= 0) return;
                const monthlyAmt  = r === 0 ? P / n : P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
                const totalAmt    = monthlyAmt * n;
                const interestAmt = totalAmt - P;
                if (monthly)  monthly.textContent  = formatWon(monthlyAmt);
                if (interest) interest.textContent = formatWon(interestAmt);
                if (total)    total.textContent    = formatWon(totalAmt);
            } else if (currentType === 'deposit') {
                if (lblMonthly) lblMonthly.textContent = '세전 이자';
                if (lblTotal)   lblTotal.textContent   = '만기 수령액';
                const P = getVal('principal') * 10000;
                const r = getVal('rate') / 100;
                const n = getVal('period') / 12;
                if (P <= 0 || n <= 0) return;
                const interestAmt = P * r * n;
                const totalAmt    = P + interestAmt;
                if (monthly)  monthly.textContent  = formatWon(interestAmt);
                if (interest) interest.textContent = formatWon(interestAmt * 0.846); // 이자소득세 15.4% 차감
                if (total)    total.textContent    = formatWon(totalAmt - interestAmt * 0.154);
            } else if (currentType === 'savings') {
                if (lblMonthly) lblMonthly.textContent = '총 납입원금';
                if (lblTotal)   lblTotal.textContent   = '만기 수령액';
                const m = getVal('monthly') * 10000;
                const r = getVal('rate') / 100 / 12;
                const n = getVal('period');
                if (m <= 0 || n <= 0) return;
                const principal   = m * n;
                const totalAmt    = r === 0 ? principal : m * (Math.pow(1 + r, n) - 1) / r * (1 + r);
                const interestAmt = totalAmt - principal;
                if (monthly)  monthly.textContent  = formatWon(principal);
                if (interest) interest.textContent = formatWon(interestAmt);
                if (total)    total.textContent    = formatWon(totalAmt - interestAmt * 0.154);
            }
        };

        // ── 11. range ↔ number input 동기화 ─────────────────────
        const debouncedCalculate = debounce(calculate, 300);

        // 범위 초과 시 테두리 색상 변경용 스타일 (한 번만 주입)
        if (!document.getElementById('lc-overrange-style')) {
            const style = document.createElement('style');
            style.id = 'lc-overrange-style';
            style.textContent = '.lc-input-wrap.lc-out-of-range{border-color:#e0a030!important;background:#fffbf5!important}';
            document.head.appendChild(style);
        }

        panels.forEach(panel => {
            const syncPair = (inputEl, rangeEl) => {
                if (!inputEl || !rangeEl) return;
                // lastValidValue: 빈 문자열 반환 시 복원용
                let lastValidValue = inputEl.value;

                // number input — debounce로 타이핑 중 깜빡임 방지
                // ※ min/max는 클로저 캡처 대신 inputEl.min/max를 동적으로 읽음
                //   → openContentEditor에서 범위 변경 시 즉시 반영됨
                inputEl.addEventListener('input', () => {
                    const raw = inputEl.value;
                    if (raw === '' || raw === '-') return;
                    const v   = parseFloat(raw);
                    if (isNaN(v)) return;
                    const min = parseFloat(inputEl.min); // 동적 읽기
                    const max = parseFloat(inputEl.max); // 동적 읽기
                    lastValidValue = raw;
                    inputEl.closest('.lc-input-wrap')?.classList.toggle('lc-out-of-range', v < min || v > max);
                    rangeEl.value = Math.min(Math.max(v, min), max);
                    debouncedCalculate();
                });

                // blur 시 min/max 클램핑
                inputEl.addEventListener('blur', () => {
                    if (inputEl.value === '') inputEl.value = lastValidValue;
                    const v   = parseFloat(inputEl.value);
                    const min = parseFloat(inputEl.min); // 동적 읽기
                    const max = parseFloat(inputEl.max); // 동적 읽기
                    const clamped = isNaN(v) ? parseFloat(inputEl.defaultValue) : Math.min(Math.max(v, min), max);
                    inputEl.value  = clamped;
                    lastValidValue = String(clamped);
                    rangeEl.value  = inputEl.value;
                    inputEl.closest('.lc-input-wrap')?.classList.remove('lc-out-of-range');
                    calculate();
                });

                // Enter 키로 즉시 확정
                inputEl.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') { e.preventDefault(); inputEl.blur(); }
                });

                // range 슬라이더: 즉시 반영
                rangeEl.addEventListener('input', () => {
                    inputEl.value  = rangeEl.value;
                    lastValidValue = rangeEl.value;
                    calculate();
                });
            };

            ['principal', 'rate', 'period', 'monthly'].forEach(key => {
                syncPair(
                    panel.querySelector(`.lc-input[data-key="${key}"]`),
                    panel.querySelector(`.lc-range[data-key="${key}"]`)
                );
            });
        });

        // ── 12. 초기 탭 활성화 ───────────────────────────────────
        switchTab(currentType);

        return {};
    },

    unmount: function(element, instance) {
    },
};
