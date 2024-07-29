'use client';

import { usePathname } from 'next/navigation';
import { RootLayout } from '@/components/RootLayout';


export default function ClientSideLayout({ children }: { children: React.ReactNode }) {
    let pathname = usePathname();

    return (
        <>
            {pathname === '/chat' ? (
                <>{children}</>
            ) : (
                <RootLayout>{children}</RootLayout>
            )}
        </>
    );
}
