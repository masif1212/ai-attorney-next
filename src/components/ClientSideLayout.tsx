'use client';

import { usePathname } from 'next/navigation';
import { RootLayout } from '@/components/RootLayout';
import ClientSessionProvider from './ClientSessionProvider';


export default function ClientSideLayout({ children }: { children: React.ReactNode }) {
    let pathname = usePathname();

    return (
        <>
            {pathname === '/chat' ? (
                <ClientSessionProvider>{children}</ClientSessionProvider>
            ) : (
                <RootLayout>{children}</RootLayout>
            )}
        </>
    );
}
