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
        ) : pathname === '/searchcases' ? (
            // Render children without any layout or header
            <>{children}</>
        ) :pathname=== '/casedetail' ? (
            <> {children} </>
        )
        // :pathname=== '/payment' ? (
        //     <> {children} </>
        // )
        : (
            <RootLayout>{children}</RootLayout>
        )}
    </>
    );
}
