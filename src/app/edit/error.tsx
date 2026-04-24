// src/app/edit/error.tsx
'use client';

export default function EditError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-xl font-semibold mb-4">에디터 로딩 중 오류가 발생했습니다</h2>
            <p className="text-gray-500 mb-6 text-sm">{error.message}</p>
            <button onClick={reset} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                다시 시도
            </button>
        </div>
    );
}
