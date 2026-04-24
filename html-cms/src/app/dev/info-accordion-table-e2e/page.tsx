'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import InfoAccordionEditor from '@/components/edit/InfoAccordionEditor';

interface AccordionItem {
    title: string;
    content: string;
}

const CHEVRON_SVG = `<svg class="ia-chevron" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round" width="16" height="16"
     style="flex-shrink:0;transition:transform 0.25s ease;">
    <path d="m6 9 6 6 6-6"/>
</svg>`;

const ACCORDION_SCRIPT =
    `<script>` +
    `(function(){` +
    `var root=document.currentScript&&document.currentScript.closest('[data-spw-block]');` +
    `if(!root||root.getAttribute('data-accordion-inited')==='1')return;` +
    `root.setAttribute('data-accordion-inited','1');` +
    `root.querySelectorAll('.ia-header').forEach(function(btn){` +
    `btn.addEventListener('click',function(){` +
    `var item=btn.closest('.ia-item');` +
    `var body=item.querySelector('.ia-body');` +
    `var chev=btn.querySelector('.ia-chevron');` +
    `var open=item.getAttribute('data-open')==='1';` +
    `if(open){item.setAttribute('data-open','0');body.style.maxHeight='0';chev.style.transform='rotate(0deg)';}` +
    `else{item.setAttribute('data-open','1');body.style.maxHeight='9999px';chev.style.transform='rotate(180deg)';}` +
    `});` +
    `});` +
    `var firstHeader=root.querySelector('.ia-header');` +
    `if(firstHeader){firstHeader.click();}` +
    `})();` +
    `</script>`;

const DEFAULT_ITEMS: AccordionItem[] = [
    {
        title: '서비스 이용 안내',
        content:
            '<p style="margin:0 0 10px;">표 편집 테스트용 기본 데이터입니다.</p>' +
            '<table class="default" style="border-collapse:collapse;width:100%;">' +
            '<thead><tr>' +
            '<td style="vertical-align:top;"><br></td>' +
            '<td style="vertical-align:top;"><br></td>' +
            '</tr></thead>' +
            '<tbody><tr>' +
            '<td style="vertical-align:top;"><br></td>' +
            '<td style="vertical-align:top;"><br></td>' +
            '</tr></tbody></table>',
    },
    {
        title: '유의사항',
        content: '<p style="margin:0;">테스트용 안내 문구</p>',
    },
];

function buildItemsHtml(items: AccordionItem[]): string {
    return items
        .map(
            (item) =>
                `<div class="ia-item" data-open="0" style="border-bottom:1px solid #E5E7EB;">` +
                `<button type="button" class="ia-header" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:16px 20px;background:none;border:none;cursor:pointer;text-align:left;">` +
                `<span style="font-size:15px;font-weight:600;color:#1A1A2E;line-height:1.3;">${item.title}</span>` +
                CHEVRON_SVG +
                `</button>` +
                `<div class="ia-body" style="max-height:0;overflow:hidden;transition:max-height 0.3s ease;">` +
                `<div style="padding:4px 20px 20px;font-size:13px;color:#374151;line-height:1.7;">${item.content}</div>` +
                `</div>` +
                `</div>`,
        )
        .join('');
}

export default function InfoAccordionTableE2EPage() {
    const blockRef = useRef<HTMLDivElement | null>(null);
    const [editorOpen, setEditorOpen] = useState(false);
    const [editorBlock, setEditorBlock] = useState<HTMLElement | null>(null);
    const itemsJson = useMemo(() => JSON.stringify(DEFAULT_ITEMS), []);

    useEffect(() => {
        const block = blockRef.current;
        if (!block) return;

        block.setAttribute('data-component-id', 'info-accordion-mobile');
        block.setAttribute('data-spw-block', '');
        block.setAttribute('data-accordion-items', itemsJson);
        block.style.fontFamily = "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif";
        block.style.background = '#fff';
        block.style.borderRadius = '20px';
        block.style.boxShadow = '0 2px 16px rgba(0,70,164,0.07)';
        block.innerHTML =
            `<div style="padding:20px 20px 16px;text-align:center;border-bottom:2px solid #E5E7EB;">` +
            `<a href="#" style="text-decoration:none;"><h2 style="font-size:17px;font-weight:800;color:#1A1A2E;margin:0;display:inline-block;border-bottom:2px solid #1A1A2E;padding-bottom:3px;">이용안내</h2></a>` +
            `</div>` +
            buildItemsHtml(DEFAULT_ITEMS) +
            ACCORDION_SCRIPT;
    }, [itemsJson]);

    return (
        <main style={{ minHeight: '100vh', padding: 24, background: '#edf2f7' }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <button
                    data-testid="open-info-accordion-editor"
                    onClick={() => {
                        if (!blockRef.current) return;
                        setEditorBlock(blockRef.current);
                        setEditorOpen(true);
                    }}
                    style={{
                        border: 'none',
                        background: '#0046A4',
                        color: '#fff',
                        borderRadius: 8,
                        padding: '10px 14px',
                        fontWeight: 700,
                        cursor: 'pointer',
                    }}
                >
                    이용안내 편집 열기
                </button>
            </div>

            <div ref={blockRef} data-testid="accordion-block" style={{ maxWidth: 720, margin: '0 auto' }} />

            {editorOpen && editorBlock && (
                <InfoAccordionEditor
                    blockEl={editorBlock}
                    onClose={() => {
                        setEditorOpen(false);
                        setEditorBlock(null);
                    }}
                />
            )}
        </main>
    );
}
