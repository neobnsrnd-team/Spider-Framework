// ContentBuilderRuntimeOptions 타입 확장 — 라이브러리 타입 누락 항목 보완
declare global {
    interface ContentBuilderRuntimeOptions {
        onReInit?: () => void;
    }
    interface Window {
        __spwEditor?: boolean;
        builderReinit?: () => void;
    }
}

export {};
