import 'dotenv/config';
import { closePool } from '../src/db/connection';
import { createComponent, getComponentById, updateComponent } from '../src/db/repository/component.repository';
import {
    type AssetViewMode,
    getMyDataAssetDateStyle,
    getMyDataAssetLegendItemStyle,
    getMyDataAssetLegendStyle,
    getMyDataAssetTitleStyle,
} from '../src/lib/mydata-asset-styles';

const FONT = "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif";
const THUMBNAIL = '/assets/minimalist-blocks/preview/ibk-mydata-asset.svg';

function buildInner(viewMode: AssetViewMode): string {
    const isWeb = viewMode === 'web';
    const donutStyle =
        (isWeb ? 'width:184px;height:184px;' : 'width:96px;height:96px;') +
        'border-radius:50%;' +
        'background:conic-gradient(#0046A4 0% 52.6%,#10B981 52.6% 77.9%,#F59E0B 77.9% 89.5%,#EF4444 89.5% 100%);' +
        'position:relative;flex-shrink:0;';
    const donutInnerStyle = isWeb
        ? 'width:108px;height:108px;border-radius:50%;background:#ffffff;box-shadow:inset 0 0 0 1px rgba(226,232,240,0.9);'
        : 'width:60px;height:60px;border-radius:50%;background:#ffffff;';
    const headerStyle = isWeb
        ? 'display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:24px 28px 18px;border-bottom:1px solid #EEF2F7;'
        : 'display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:14px 16px 10px;';
    const titleStyle = getMyDataAssetTitleStyle(viewMode);
    const dateStyle = getMyDataAssetDateStyle(viewMode);
    const summaryStyle = 'display:flex;align-items:center;gap:20px;padding:6px 16px 14px;min-width:0;';
    const summaryMetaStyle = 'flex:1;min-width:0;';
    const totalWrapStyle = 'margin-bottom:8px;';
    const totalLabelStyle = 'font-size:12px;color:#6B7280;';
    const totalValueStyle =
        'display:block;font-size:16px;font-weight:700;color:#1A1A2E;line-height:1.35;overflow-wrap:anywhere;word-break:break-all;';
    const legendStyle = getMyDataAssetLegendStyle(viewMode);
    const legendItemStyle = getMyDataAssetLegendItemStyle(viewMode);
    const rowsStyle = isWeb ? 'padding:0;' : 'padding:0 16px;';
    const rowBaseStyle = isWeb
        ? 'display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:12px 0;'
        : 'display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:9px 0;';
    const labelStyle = isWeb
        ? 'min-width:0;font-size:15px;color:#475569;font-weight:600;overflow-wrap:anywhere;word-break:break-all;'
        : 'min-width:0;font-size:14px;color:#6B7280;overflow-wrap:anywhere;word-break:break-all;';
    const amountStyle = isWeb
        ? 'display:block;min-width:0;font-size:16px;font-weight:700;color:#1A1A2E;text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'
        : 'display:block;min-width:0;font-size:14px;font-weight:600;color:#1A1A2E;text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
    const amountDebtStyle = isWeb
        ? 'display:block;min-width:0;font-size:16px;font-weight:700;color:#EF4444;text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'
        : 'display:block;min-width:0;font-size:14px;font-weight:600;color:#EF4444;text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
    const pctStyle = isWeb
        ? 'font-size:13px;color:#94A3B8;min-width:42px;text-align:right;flex-shrink:0;'
        : 'font-size:12px;color:#9CA3AF;min-width:32px;text-align:right;flex-shrink:0;';
    const netWrapStyle = isWeb
        ? 'padding:18px 0 0;border-top:1px solid #E9EEF5;display:flex;justify-content:space-between;align-items:flex-start;gap:12px;'
        : 'margin:0 16px;border-top:1px solid #F3F4F6;padding:10px 0;display:flex;justify-content:space-between;align-items:flex-start;gap:12px;';
    const netLabelStyle = isWeb
        ? 'font-size:14px;font-weight:700;color:#0F172A;min-width:0;overflow-wrap:anywhere;word-break:break-all;'
        : 'font-size:13px;font-weight:600;color:#1A1A2E;min-width:0;overflow-wrap:anywhere;word-break:break-all;';
    const netValueStyle = isWeb
        ? 'font-size:24px;font-weight:800;color:#0046A4;letter-spacing:-0.02em;text-align:right;overflow-wrap:anywhere;word-break:break-all;'
        : 'font-size:14px;font-weight:700;color:#0046A4;text-align:right;overflow-wrap:anywhere;word-break:break-all;';
    const buttonWrapStyle = isWeb ? 'padding:0;' : 'padding:4px 16px 16px;';
    const buttonStyle = isWeb
        ? 'display:block;text-align:center;padding:14px 18px;border-radius:14px;background:linear-gradient(135deg,#0046A4 0%,#0A5BD7 100%);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;box-shadow:0 10px 24px rgba(0,70,164,0.22);line-height:1.4;overflow-wrap:anywhere;word-break:break-all;white-space:normal;'
        : 'display:block;text-align:center;padding:11px 0;border-radius:8px;background:#0046A4;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;line-height:1.4;overflow-wrap:anywhere;word-break:break-all;white-space:normal;';

    if (isWeb) {
        return (
            `<div data-ma-header style="${headerStyle}">` +
                `<span data-ma-title style="${titleStyle}">내 자산 현황</span>` +
                `<span data-ma-date data-ma-date-visible="true" style="${dateStyle}">2024.04.06</span>` +
            `</div>` +
            `<div data-ma-web-layout style="display:grid;grid-template-columns:400px minmax(0,1fr);gap:24px;padding:32px 36px 36px;align-items:start;">` +
                `<div data-ma-web-side style="display:flex;flex-direction:column;align-items:center;gap:28px;padding:4px 0 0;">` +
                    `<div data-ma-chart style="${donutStyle}">` +
                        `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">` +
                            `<div style="${donutInnerStyle}"></div>` +
                        `</div>` +
                    `</div>` +
                    `<div data-ma-legend style="${legendStyle}">` +
                        `<span style="${legendItemStyle}"><span style="width:8px;height:8px;border-radius:2px;background:#0046A4;flex-shrink:0;display:inline-block;"></span>예금·적금 53%</span>` +
                        `<span style="${legendItemStyle}"><span style="width:8px;height:8px;border-radius:2px;background:#10B981;flex-shrink:0;display:inline-block;"></span>투자 25%</span>` +
                        `<span style="${legendItemStyle}"><span style="width:8px;height:8px;border-radius:2px;background:#F59E0B;flex-shrink:0;display:inline-block;"></span>연금 12%</span>` +
                        `<span style="${legendItemStyle}"><span style="width:8px;height:8px;border-radius:2px;background:#EF4444;flex-shrink:0;display:inline-block;"></span>대출 11%</span>` +
                    `</div>` +
                `</div>` +
                `<div data-ma-web-main style="display:flex;flex-direction:column;gap:24px;min-width:0;">` +
                    `<div data-ma-summary-meta style="padding:20px 22px;border-radius:20px;background:linear-gradient(180deg,#F8FBFF 0%,#F1F6FD 100%);border:1px solid #E2EAF5;max-width:540px;">` +
                        `<div data-ma-total-wrap style="display:flex;flex-direction:column;gap:6px;">` +
                            `<span style="font-size:13px;color:#64748B;font-weight:600;">총 자산</span>` +
                            `<span data-ma-total style="font-size:32px;font-weight:800;color:#0F172A;letter-spacing:-0.03em;line-height:1.1;">42,500,000 원</span>` +
                        `</div>` +
                    `</div>` +
                    `<div data-ma-rows style="${rowsStyle}">` +
                        `<div data-ma-row data-ma-row-type="asset" style="${rowBaseStyle}border-bottom:1px solid #F3F4F6;">` +
                            `<span style="display:flex;align-items:flex-start;gap:6px;min-width:0;flex:1;">` +
                                `<span data-ma-dot style="width:8px;height:8px;border-radius:50%;background:#0046A4;flex-shrink:0;display:inline-block;" data-ma-dot-color="#0046A4"></span>` +
                                `<span data-ma-label style="${labelStyle}">예금·적금</span>` +
                            `</span>` +
                            `<span style="display:flex;align-items:flex-start;justify-content:flex-end;gap:8px;flex:0 1 52%;min-width:0;">` +
                                `<span data-ma-amount data-ma-amount-color="#1A1A2E" style="${amountStyle}">25,000,000 원</span>` +
                                `<span data-ma-pct style="${pctStyle}">53%</span>` +
                            `</span>` +
                        `</div>` +
                        `<div data-ma-row data-ma-row-type="asset" style="${rowBaseStyle}border-bottom:1px solid #F3F4F6;">` +
                            `<span style="display:flex;align-items:center;gap:6px;">` +
                                `<span data-ma-dot style="width:8px;height:8px;border-radius:50%;background:#10B981;flex-shrink:0;display:inline-block;" data-ma-dot-color="#10B981"></span>` +
                                `<span data-ma-label style="${labelStyle}">투자</span>` +
                            `</span>` +
                            `<span style="display:flex;align-items:center;gap:8px;">` +
                                `<span data-ma-amount data-ma-amount-color="#1A1A2E" style="${amountStyle}">12,000,000 원</span>` +
                                `<span data-ma-pct style="${pctStyle}">25%</span>` +
                            `</span>` +
                        `</div>` +
                        `<div data-ma-row data-ma-row-type="asset" style="${rowBaseStyle}border-bottom:1px solid #F3F4F6;">` +
                            `<span style="display:flex;align-items:center;gap:6px;">` +
                                `<span data-ma-dot style="width:8px;height:8px;border-radius:50%;background:#F59E0B;flex-shrink:0;display:inline-block;" data-ma-dot-color="#F59E0B"></span>` +
                                `<span data-ma-label style="${labelStyle}">연금</span>` +
                            `</span>` +
                            `<span style="display:flex;align-items:center;gap:8px;">` +
                                `<span data-ma-amount data-ma-amount-color="#1A1A2E" style="${amountStyle}">5,500,000 원</span>` +
                                `<span data-ma-pct style="${pctStyle}">12%</span>` +
                            `</span>` +
                        `</div>` +
                        `<div data-ma-row data-ma-row-type="debt" style="${rowBaseStyle}">` +
                            `<span style="display:flex;align-items:center;gap:6px;">` +
                                `<span data-ma-dot style="width:8px;height:8px;border-radius:50%;background:#EF4444;flex-shrink:0;display:inline-block;" data-ma-dot-color="#EF4444"></span>` +
                                `<span data-ma-label style="${labelStyle}">대출</span>` +
                            `</span>` +
                            `<span style="display:flex;align-items:center;gap:8px;">` +
                                `<span data-ma-amount data-ma-amount-color="#EF4444" style="${amountDebtStyle}">-5,000,000 원</span>` +
                                `<span data-ma-pct style="${pctStyle}">11%</span>` +
                            `</span>` +
                        `</div>` +
                    `</div>` +
                    `<div data-ma-net-wrap style="${netWrapStyle}">` +
                        `<span style="${netLabelStyle}">순자산</span>` +
                        `<span data-ma-net style="${netValueStyle}">37,500,000 원</span>` +
                    `</div>` +
                    `<div data-ma-btn-wrap style="${buttonWrapStyle}">` +
                        `<a data-ma-btn href="#" style="${buttonStyle}">자산 상세 보기</a>` +
                    `</div>` +
                `</div>` +
            `</div>`
        );
    }

    return (
        `<div data-ma-header style="${headerStyle}">` +
            `<span data-ma-title style="${titleStyle}">내 자산 현황</span>` +
            `<span data-ma-date data-ma-date-visible="true" style="${dateStyle}">2024.04.06</span>` +
        `</div>` +
        `<div data-ma-summary style="${summaryStyle}">` +
            `<div data-ma-chart style="${donutStyle}">` +
                `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;">` +
                    `<div style="${donutInnerStyle}"></div>` +
                `</div>` +
            `</div>` +
            `<div data-ma-summary-meta style="${summaryMetaStyle}">` +
                `<div data-ma-total-wrap style="${totalWrapStyle}">` +
                    `<span style="${totalLabelStyle}">총 자산</span>` +
                    `<span data-ma-total style="${totalValueStyle}">42,500,000 원</span>` +
                `</div>` +
                `<div data-ma-legend style="${legendStyle}">` +
                    `<span style="${legendItemStyle}"><span style="width:8px;height:8px;border-radius:2px;background:#0046A4;flex-shrink:0;display:inline-block;"></span>예금·적금 53%</span>` +
                    `<span style="${legendItemStyle}"><span style="width:8px;height:8px;border-radius:2px;background:#10B981;flex-shrink:0;display:inline-block;"></span>투자 25%</span>` +
                    `<span style="${legendItemStyle}"><span style="width:8px;height:8px;border-radius:2px;background:#F59E0B;flex-shrink:0;display:inline-block;"></span>연금 12%</span>` +
                    `<span style="${legendItemStyle}"><span style="width:8px;height:8px;border-radius:2px;background:#EF4444;flex-shrink:0;display:inline-block;"></span>대출 11%</span>` +
                `</div>` +
            `</div>` +
        `</div>` +
        `<div data-ma-rows style="${rowsStyle}">` +
            `<div data-ma-row data-ma-row-type="asset" style="${rowBaseStyle}border-bottom:1px solid #F3F4F6;">` +
                `<span style="display:flex;align-items:flex-start;gap:6px;min-width:0;flex:1;">` +
                    `<span data-ma-dot style="width:8px;height:8px;border-radius:50%;background:#0046A4;flex-shrink:0;display:inline-block;" data-ma-dot-color="#0046A4"></span>` +
                    `<span data-ma-label style="${labelStyle}">예금·적금</span>` +
                `</span>` +
                `<span style="display:flex;align-items:flex-start;justify-content:flex-end;gap:8px;flex:0 1 52%;min-width:0;">` +
                    `<span data-ma-amount data-ma-amount-color="#1A1A2E" style="${amountStyle}">25,000,000 원</span>` +
                    `<span data-ma-pct style="${pctStyle}">53%</span>` +
                `</span>` +
            `</div>` +
            `<div data-ma-row data-ma-row-type="asset" style="${rowBaseStyle}border-bottom:1px solid #F3F4F6;">` +
                `<span style="display:flex;align-items:center;gap:6px;">` +
                    `<span data-ma-dot style="width:8px;height:8px;border-radius:50%;background:#10B981;flex-shrink:0;display:inline-block;" data-ma-dot-color="#10B981"></span>` +
                    `<span data-ma-label style="${labelStyle}">투자</span>` +
                `</span>` +
                `<span style="display:flex;align-items:center;gap:8px;">` +
                    `<span data-ma-amount data-ma-amount-color="#1A1A2E" style="${amountStyle}">12,000,000 원</span>` +
                    `<span data-ma-pct style="${pctStyle}">25%</span>` +
                `</span>` +
            `</div>` +
            `<div data-ma-row data-ma-row-type="asset" style="${rowBaseStyle}border-bottom:1px solid #F3F4F6;">` +
                `<span style="display:flex;align-items:center;gap:6px;">` +
                    `<span data-ma-dot style="width:8px;height:8px;border-radius:50%;background:#F59E0B;flex-shrink:0;display:inline-block;" data-ma-dot-color="#F59E0B"></span>` +
                    `<span data-ma-label style="${labelStyle}">연금</span>` +
                `</span>` +
                `<span style="display:flex;align-items:center;gap:8px;">` +
                    `<span data-ma-amount data-ma-amount-color="#1A1A2E" style="${amountStyle}">5,500,000 원</span>` +
                    `<span data-ma-pct style="${pctStyle}">12%</span>` +
                `</span>` +
            `</div>` +
            `<div data-ma-row data-ma-row-type="debt" style="${rowBaseStyle}">` +
                `<span style="display:flex;align-items:center;gap:6px;">` +
                    `<span data-ma-dot style="width:8px;height:8px;border-radius:50%;background:#EF4444;flex-shrink:0;display:inline-block;" data-ma-dot-color="#EF4444"></span>` +
                    `<span data-ma-label style="${labelStyle}">대출</span>` +
                `</span>` +
                `<span style="display:flex;align-items:center;gap:8px;">` +
                    `<span data-ma-amount data-ma-amount-color="#EF4444" style="${amountDebtStyle}">-5,000,000 원</span>` +
                    `<span data-ma-pct style="${pctStyle}">11%</span>` +
                `</span>` +
            `</div>` +
        `</div>` +
        `<div data-ma-net-wrap style="${netWrapStyle}">` +
            `<span style="${netLabelStyle}">순자산</span>` +
            `<span data-ma-net style="${netValueStyle}">37,500,000 원</span>` +
        `</div>` +
        `<div data-ma-btn-wrap style="${buttonWrapStyle}">` +
            `<a data-ma-btn href="#" style="${buttonStyle}">자산 상세 보기</a>` +
        `</div>`
    );
}

const MOBILE_HTML =
    `<div data-component-id="mydata-asset-mobile" data-spw-block style="font-family:${FONT};background:#ffffff;border-radius:12px;margin:0 16px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">${buildInner('mobile')}</div>`;

const WEB_HTML =
    `<div data-component-id="mydata-asset-web" data-spw-block style="font-family:${FONT};border-radius:24px;width:100%;margin:0;overflow:hidden;box-sizing:border-box;">${buildInner('web')}</div>`;

const RESPONSIVE_HTML =
    `<div data-component-id="mydata-asset-responsive" data-spw-block style="font-family:${FONT};background:#ffffff;border-radius:12px;width:100%;box-sizing:border-box;box-shadow:0 1px 4px rgba(0,0,0,0.08);">${buildInner('responsive')}</div>`;

const VARIANTS = [
    { id: 'mydata-asset-mobile', html: MOBILE_HTML, viewMode: 'mobile' as const },
    { id: 'mydata-asset-web', html: WEB_HTML, viewMode: 'web' as const },
    { id: 'mydata-asset-responsive', html: RESPONSIVE_HTML, viewMode: 'responsive' as const },
];

async function main() {
    for (const v of VARIANTS) {
        const existing = await getComponentById(v.id);

        if (existing) {
            await updateComponent({
                componentId: v.id,
                componentType: existing.COMPONENT_TYPE,
                viewMode: existing.VIEW_MODE,
                componentThumbnail: existing.COMPONENT_THUMBNAIL ?? undefined,
                data: { ...((existing.DATA ?? {}) as Record<string, unknown>), html: v.html },
                lastModifierId: 'system',
            });
            process.stdout.write(`[업데이트] ${v.id}\n`);
        } else {
            await createComponent({
                componentId: v.id,
                componentType: 'finance',
                viewMode: v.viewMode,
                componentThumbnail: THUMBNAIL,
                data: {
                    id: v.id.replace(`-${v.viewMode}`, ''),
                    label: '마이데이터 자산 요약',
                    description: '도넛 차트·자산/부채 항목·순자산 편집 가능한 마이데이터 자산 요약 카드',
                    preview: THUMBNAIL,
                    html: v.html,
                    viewMode: v.viewMode,
                },
                createUserId: 'system',
                createUserName: '시스템',
            });
            process.stdout.write(`[생성] ${v.id}\n`);
        }
    }

    await closePool();
    process.stdout.write('완료\n');
}

main().catch((err: unknown) => {
    process.stderr.write(`실패: ${err}\n`);
    process.exit(1);
});
