
/*
환율 게시판 플러그인

사용법:
<div data-cb-type="exchange-board">
    <div class="eb-header">
        <span class="eb-title">실시간 환율</span>
        <span class="eb-updated">기준: 서울외국환중개</span>
    </div>
    <div class="eb-list">
        <div class="eb-item" data-currency="USD">
            <div class="eb-left">
                <span class="eb-flag">🇺🇸</span>
                <div class="eb-currency-info">
                    <span class="eb-code">USD</span>
                    <span class="eb-name">미국 달러</span>
                </div>
            </div>
            <div class="eb-right">
                <div class="eb-rates">
                    <div class="eb-rate-row"><span class="eb-label">살 때</span><span class="eb-buy">1,325.50</span></div>
                    <div class="eb-rate-row"><span class="eb-label">팔 때</span><span class="eb-sell">1,296.50</span></div>
                </div>
                <div class="eb-change up">▲ 3.50</div>
            </div>
        </div>
    </div>
    <div class="eb-footer">
        <a href="#" class="eb-exchange-btn">환전 신청</a>
    </div>
</div>
*/

const CURRENCY_META = {
    USD: { flag: 'us', name: '미국 달러' },
    EUR: { flag: 'eu', name: '유럽 유로' },
    JPY: { flag: 'jp', name: '일본 엔화' },
    CNY: { flag: 'cn', name: '중국 위안' },
    GBP: { flag: 'gb', name: '영국 파운드' },
    HKD: { flag: 'hk', name: '홍콩 달러' },
    VND: { flag: 'vn', name: '베트남 동' },
    AUD: { flag: 'au', name: '호주 달러' },
};

// flagcdn.com 국기 이미지 HTML 생성 (Windows 이모지 미지원 대응)
function flagImg(countryCode, alt) {
    return `<img src="https://flagcdn.com/w40/${countryCode}.png" alt="${alt}" style="width:28px;height:auto;display:block;">`;
}

// 에디터에서 항목 편집 UI 생성
function createItemEditor(item, onChange) {
    const code = item.dataset.currency || '';
    const section = document.createElement('div');
    section.style.cssText = 'border:1px solid #e5e7eb;border-radius:8px;margin-bottom:8px;background:#fff;overflow:hidden;';

    // 헤더 (접기/펼치기)
    const header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;padding:8px 12px;background:#f9fafb;cursor:pointer;gap:8px;';
    const flagEl = document.createElement('span');
    const flagImgEl = item.querySelector('.eb-flag img');
    if (flagImgEl) {
        const img = document.createElement('img');
        img.src = flagImgEl.src;
        img.alt = flagImgEl.alt;
        img.style.cssText = 'width:20px;height:auto;vertical-align:middle;';
        flagEl.appendChild(img);
    } else {
        flagEl.textContent = code || '?';
        flagEl.style.cssText = 'font-size:12px;font-weight:700;color:#374151;';
    }
    const codeEl = document.createElement('span');
    codeEl.textContent = code;
    codeEl.style.cssText = 'font-weight:600;font-size:13px;flex:1;';
    const toggle = document.createElement('span');
    toggle.textContent = '▼';
    toggle.style.cssText = 'font-size:10px;color:#9ca3af;transition:transform 0.2s;';
    header.appendChild(flagEl);
    header.appendChild(codeEl);
    header.appendChild(toggle);

    const body = document.createElement('div');
    body.style.cssText = 'padding:12px;display:none;';

    const makeField = (label, value, onInput) => {
        const wrap = document.createElement('div');
        wrap.style.marginBottom = '8px';
        const lbl = document.createElement('label');
        lbl.textContent = label;
        lbl.style.cssText = 'display:block;font-size:11px;color:#6b7280;margin-bottom:3px;';
        const inp = document.createElement('input');
        inp.type = 'text';
        inp.value = value;
        inp.style.cssText = 'width:100%;padding:6px 9px;border:1px solid #d1d5db;border-radius:5px;font-size:13px;box-sizing:border-box;';
        inp.addEventListener('input', () => onInput(inp.value));
        wrap.appendChild(lbl);
        wrap.appendChild(inp);
        return wrap;
    };

    body.appendChild(makeField('살 때 (매도율)', item.querySelector('.eb-buy')?.textContent || '', v => {
        const el = item.querySelector('.eb-buy'); if (el) el.textContent = v; onChange?.();
    }));
    body.appendChild(makeField('팔 때 (매입율)', item.querySelector('.eb-sell')?.textContent || '', v => {
        const el = item.querySelector('.eb-sell'); if (el) el.textContent = v; onChange?.();
    }));

    // 등락 편집
    const changeEl = item.querySelector('.eb-change');
    const changeVal = changeEl?.textContent?.replace(/[▲▼\s]/g, '') || '0.00';
    const isUp = changeEl?.classList.contains('up') ?? true;
    const changeWrap = document.createElement('div');
    changeWrap.style.cssText = 'display:flex;gap:8px;margin-bottom:8px;align-items:flex-end;';
    const dirWrap = document.createElement('div');
    dirWrap.innerHTML = '<label style="font-size:11px;color:#6b7280;display:block;margin-bottom:3px;">등락</label>';
    const dirSelect = document.createElement('select');
    dirSelect.style.cssText = 'padding:6px 9px;border:1px solid #d1d5db;border-radius:5px;font-size:13px;background:#fff;';
    ['▲ 상승', '▼ 하락'].forEach((opt, i) => {
        const o = document.createElement('option');
        o.value = i === 0 ? 'up' : 'down';
        o.textContent = opt;
        if ((i === 0 && isUp) || (i === 1 && !isUp)) o.selected = true;
        dirSelect.appendChild(o);
    });
    dirWrap.appendChild(dirSelect);
    const valWrap = makeField('변동폭', changeVal, v => {
        if (changeEl) {
            changeEl.textContent = (dirSelect.value === 'up' ? '▲' : '▼') + ' ' + v;
            onChange?.();
        }
    });
    const applyDir = () => {
        if (changeEl) {
            const valInp = valWrap.querySelector('input');
            changeEl.textContent = (dirSelect.value === 'up' ? '▲' : '▼') + ' ' + (valInp?.value || '0.00');
            changeEl.className = 'eb-change ' + dirSelect.value;
            onChange?.();
        }
    };
    dirSelect.addEventListener('change', applyDir);
    changeWrap.appendChild(dirWrap);
    changeWrap.appendChild(valWrap);
    body.appendChild(changeWrap);

    header.addEventListener('click', () => {
        const open = body.style.display === 'block';
        body.style.display = open ? 'none' : 'block';
        toggle.style.transform = open ? '' : 'rotate(180deg)';
    });

    section.appendChild(header);
    section.appendChild(body);
    return section;
}

export default {
    name: 'exchange-board',
    displayName: '환율 게시판',
    version: '2.0.0',

    settings: {
        accentColor: {
            type: 'color',
            label: '강조 색상',
            default: '#0046A4'
        },
        exchangeUrl: {
            type: 'text',
            label: '환전 신청 URL',
            default: '#'
        }
    },

    editor: {
        openContentEditor: function(element, builder, onChange) {
            const container = document.createElement('div');
            container.style.marginBottom = '23px';

            // 제목 편집
            const titleWrap = document.createElement('div');
            titleWrap.style.marginBottom = '16px';
            titleWrap.innerHTML = '<label style="display:block;font-size:12px;color:#555;font-weight:600;margin-bottom:5px;">위젯 제목</label>';
            const titleInput = document.createElement('input');
            titleInput.type = 'text';
            titleInput.value = element.querySelector('.eb-title')?.textContent || '실시간 환율';
            titleInput.style.cssText = 'width:100%;padding:7px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;box-sizing:border-box;';
            titleInput.addEventListener('input', () => {
                const el = element.querySelector('.eb-title');
                if (el) el.textContent = titleInput.value;
                onChange?.();
            });
            titleWrap.appendChild(titleInput);
            container.appendChild(titleWrap);

            // 통화 항목 편집기
            const itemsLabel = document.createElement('div');
            itemsLabel.style.cssText = 'font-size:12px;color:#555;font-weight:600;margin-bottom:8px;';
            itemsLabel.textContent = '통화 항목';
            container.appendChild(itemsLabel);

            const itemsContainer = document.createElement('div');
            element.querySelectorAll('.eb-item').forEach(item => {
                itemsContainer.appendChild(createItemEditor(item, onChange));
            });
            container.appendChild(itemsContainer);

            // 통화 추가 버튼
            const addWrap = document.createElement('div');
            addWrap.style.cssText = 'display:flex;flex-direction:column;gap:6px;margin-top:4px;margin-bottom:16px;';
            const codeSelect = document.createElement('select');
            codeSelect.style.cssText = 'width:100%;padding:8px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;background:#fff;box-sizing:border-box;';
            Object.entries(CURRENCY_META).forEach(([code, m]) => {
                const o = document.createElement('option');
                o.value = code;
                o.textContent = `${code} — ${m.name}`;
                codeSelect.appendChild(o);
            });
            const addBtn = document.createElement('button');
            addBtn.textContent = '+ 추가';
            addBtn.style.cssText = 'align-self:flex-end;padding:7px 20px;background:#0046A4;color:#fff;border:none;border-radius:6px;font-size:13px;cursor:pointer;white-space:nowrap;';
            addBtn.onclick = (e) => {
                e.preventDefault();
                const code = codeSelect.value;
                const meta = CURRENCY_META[code];
                if (!meta) return;
                // 동일 통화 중복 추가 방지
                if (element.querySelector(`.eb-item[data-currency="${code}"]`)) return;
                const list = element.querySelector('.eb-list');
                if (!list) return;
                const newItem = document.createElement('div');
                newItem.className = 'eb-item';
                newItem.dataset.currency = code;
                newItem.innerHTML = `
                    <div class="eb-left">
                        <span class="eb-flag">${flagImg(meta.flag, code)}</span>
                        <div class="eb-currency-info">
                            <span class="eb-code">${code}</span>
                            <span class="eb-name">${meta.name}</span>
                        </div>
                    </div>
                    <div class="eb-right">
                        <div class="eb-rates">
                            <div class="eb-rate-row"><span class="eb-label">살 때</span><span class="eb-buy">0.00</span></div>
                            <div class="eb-rate-row"><span class="eb-label">팔 때</span><span class="eb-sell">0.00</span></div>
                        </div>
                        <div class="eb-change up">▲ 0.00</div>
                    </div>
                `;
                list.appendChild(newItem);
                itemsContainer.appendChild(createItemEditor(newItem, onChange));
                onChange?.();
            };
            addWrap.appendChild(codeSelect);
            addWrap.appendChild(addBtn);
            container.appendChild(addWrap);

            // 환전 URL
            const linkWrap = document.createElement('div');
            linkWrap.innerHTML = '<label style="display:block;font-size:12px;color:#555;font-weight:600;margin-bottom:5px;">환전 신청 URL</label>';
            const linkInput = document.createElement('input');
            linkInput.type = 'text';
            linkInput.placeholder = 'https://...';
            linkInput.value = element.querySelector('.eb-exchange-btn')?.getAttribute('href') || '#';
            linkInput.style.cssText = 'width:100%;padding:7px 10px;border:1px solid #d1d5db;border-radius:6px;font-size:13px;box-sizing:border-box;';
            linkInput.addEventListener('input', () => {
                const el = element.querySelector('.eb-exchange-btn');
                if (el) el.setAttribute('href', linkInput.value || '#');
                onChange?.();
            });
            linkWrap.appendChild(linkInput);
            container.appendChild(linkWrap);

            // API에서 최신 환율 가져오기
            const syncBtn = document.createElement('button');
            syncBtn.textContent = '↻  API에서 최신 환율 가져오기';
            syncBtn.style.cssText = 'width:100%;margin-top:16px;padding:9px;border:1px dashed #0046A4;background:#EFF6FF;color:#0046A4;border-radius:7px;font-size:13px;cursor:pointer;';
            syncBtn.onclick = (e) => {
                e.preventDefault();
                syncBtn.textContent = '불러오는 중...';
                syncBtn.disabled = true;
                fetch('/api/exchange')
                    .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
                    .then(data => {
                        element.querySelectorAll('.eb-item').forEach(item => {
                            const code = item.dataset.currency;
                            const d = data[code];
                            if (!d || d.buy == null || d.sell == null) return;
                            const buyEl = item.querySelector('.eb-buy');
                            const sellEl = item.querySelector('.eb-sell');
                            const changeEl = item.querySelector('.eb-change');
                            if (buyEl) buyEl.textContent = d.buy.toLocaleString('ko-KR', { minimumFractionDigits: 2 });
                            if (sellEl) sellEl.textContent = d.sell.toLocaleString('ko-KR', { minimumFractionDigits: 2 });
                            if (changeEl) {
                                const up = d.change >= 0;
                                changeEl.textContent = (up ? '▲' : '▼') + ' ' + Math.abs(d.change).toFixed(2);
                                changeEl.className = 'eb-change ' + (up ? 'up' : 'down');
                            }
                        });
                        const updatedEl = element.querySelector('.eb-updated');
                        if (updatedEl) {
                            const now = new Date();
                            updatedEl.textContent = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')} 기준`;
                        }
                        onChange?.();
                        syncBtn.textContent = '✓ 환율 업데이트 완료';
                        setTimeout(() => { syncBtn.textContent = '↻  API에서 최신 환율 가져오기'; syncBtn.disabled = false; }, 2000);
                    })
                    .catch(() => {
                        syncBtn.textContent = '✗ API 연결 실패';
                        setTimeout(() => { syncBtn.textContent = '↻  API에서 최신 환율 가져오기'; syncBtn.disabled = false; }, 2000);
                    });
            };
            container.appendChild(syncBtn);

            return container;
        }
    },

    // mount: 뷰 페이지에서 실시간 환율로 업데이트 (인라인 데이터는 유지, 숫자만 갱신)
    mount: function(element, options) {
        const accent = element.getAttribute('data-cb-accent-color') || element.dataset.ebAccent || element.style.getPropertyValue('--eb-accent').trim() || '#0046A4';
        element.style.setProperty('--eb-accent', accent);

        const updateRates = (data) => {
            element.querySelectorAll('.eb-item').forEach(item => {
                const code = item.dataset.currency;
                const d = data?.[code];
                // null 값 안전 처리 — d.buy/sell이 null이면 toLocaleString TypeError 방지
                if (!d || d.buy == null || d.sell == null) return;
                const buyEl = item.querySelector('.eb-buy');
                const sellEl = item.querySelector('.eb-sell');
                const changeEl = item.querySelector('.eb-change');
                if (buyEl) buyEl.textContent = d.buy.toLocaleString('ko-KR', { minimumFractionDigits: 2 });
                if (sellEl) sellEl.textContent = d.sell.toLocaleString('ko-KR', { minimumFractionDigits: 2 });
                if (changeEl) {
                    const up = d.change >= 0;
                    changeEl.textContent = (up ? '▲' : '▼') + ' ' + Math.abs(d.change).toFixed(2);
                    changeEl.className = 'eb-change ' + (up ? 'up' : 'down');
                }
            });
            const updatedEl = element.querySelector('.eb-updated');
            if (updatedEl) {
                const now = new Date();
                updatedEl.textContent = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')} 기준`;
            }
        };

        // 환전 URL 설정
        if (options.exchangeUrl) {
            const btn = element.querySelector('.eb-exchange-btn');
            if (btn && options.exchangeUrl !== '#') btn.setAttribute('href', options.exchangeUrl);
        }

        // 실시간 데이터 fetch (실패해도 인라인 데이터 유지)
        fetch('/api/exchange')
            .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
            .then(data => updateRates(data))
            .catch(() => {});

        return {};
    },

    unmount: function(element, instance) {
    }
};
