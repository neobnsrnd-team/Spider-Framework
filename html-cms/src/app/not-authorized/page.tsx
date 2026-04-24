import Link from 'next/link';

export default function NotAuthorizedPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
            <h1 className="text-2xl font-bold text-[#111827]">CMS access is not allowed.</h1>
            <p className="text-sm text-[#6b7280]">Ask your spider-admin administrator for CMS menu permission.</p>
            <Link href="/" className="rounded-lg bg-[#0046A4] px-4 py-2 text-sm font-semibold text-white">
                Go to CMS home
            </Link>
        </main>
    );
}
