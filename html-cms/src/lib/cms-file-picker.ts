import { nextApi } from '@/lib/api-url';

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

export function openCmsFilesPicker(onSelect: (url: string) => void) {
    const handleMessage = (event: MessageEvent) => {
        const url = extractFirstAssetUrl(event.data);
        if (!url) return;

        window.removeEventListener('message', handleMessage);
        onSelect(url);
        window.focus();
    };

    window.addEventListener('message', handleMessage);
    const popup = window.open(
        nextApi('/files'),
        'spw-image-browser',
        'width=1280,height=900,scrollbars=yes,resizable=yes',
    );

    if (!popup) {
        window.removeEventListener('message', handleMessage);
        throw new Error('이미지 선택 창을 열 수 없습니다. 팝업 차단을 확인해 주세요.');
    }

    return () => window.removeEventListener('message', handleMessage);
}
