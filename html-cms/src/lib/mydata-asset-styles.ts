export type AssetViewMode = 'mobile' | 'web' | 'responsive';

const isWebMode = (viewMode: AssetViewMode): boolean => viewMode === 'web';

export const getMyDataAssetTitleStyle = (viewMode: AssetViewMode): string =>
    isWebMode(viewMode)
        ? 'display:block;flex:1;min-width:0;font-size:22px;font-weight:800;color:#0F172A;letter-spacing:-0.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'
        : 'display:block;flex:1;min-width:0;font-size:15px;font-weight:700;color:#1A1A2E;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';

export const getMyDataAssetDateStyle = (viewMode: AssetViewMode): string =>
    isWebMode(viewMode)
        ? 'display:inline-flex;align-items:center;flex-shrink:0;max-width:180px;padding:7px 12px;border-radius:999px;background:#EEF4FF;color:#0A4AA3;font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'
        : 'display:inline-flex;align-items:center;flex-shrink:0;max-width:132px;padding:2px 10px;border-radius:4px;background:#E8F0FC;color:#0046A4;font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';

export const getMyDataAssetLegendStyle = (viewMode: AssetViewMode): string =>
    isWebMode(viewMode)
        ? 'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 12px;width:100%;'
        : 'display:flex;flex-wrap:wrap;gap:4px 12px;';

export const getMyDataAssetLegendItemStyle = (viewMode: AssetViewMode): string =>
    isWebMode(viewMode)
        ? 'display:flex;align-items:center;justify-content:center;gap:6px;font-size:12px;color:#475569;padding:8px 10px;border-radius:999px;background:#ffffff;border:1px solid #E2E8F0;font-weight:600;text-align:center;min-width:0;width:100%;max-width:100%;box-sizing:border-box;overflow-wrap:anywhere;word-break:break-all;'
        : 'display:flex;align-items:center;gap:4px;font-size:11px;color:#6B7280;min-width:0;max-width:100%;box-sizing:border-box;overflow-wrap:anywhere;word-break:break-all;';
