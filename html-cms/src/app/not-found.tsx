// src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-bold mb-4">페이지를 찾을 수 없습니다</h2>
            <Link href="/edit" className="text-blue-600 hover:underline">
                에디터로 돌아가기
            </Link>
        </div>
    );
}
