// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Springware CMS',
    description: '금융권 특화 비주얼 웹 콘텐츠 빌더',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body className="antialiased">{children}</body>
        </html>
    );
}
