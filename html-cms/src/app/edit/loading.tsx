// src/app/edit/loading.tsx

export default function EditLoading() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
                <p className="mt-4 text-gray-500">에디터 로딩 중...</p>
            </div>
        </div>
    );
}
