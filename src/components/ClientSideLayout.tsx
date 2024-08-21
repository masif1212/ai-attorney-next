'use client';

import { redirect, usePathname, useRouter } from 'next/navigation';
import { RootLayout } from '@/components/RootLayout';
import ClientSessionProvider from './ClientSessionProvider';
import { useEffect } from 'react';
export default function ClientSideLayout({ children }: { children: React.ReactNode }) {
    let pathname = usePathname();
    const router = useRouter();

    // const token = localStorage.getItem('token');
    // useEffect(() => {
    //     if (!token && (pathname === '/chat' || pathname === '/searchcases' || pathname === '/casedetail')) {
    //         redirect('/')
    //     }
    // }, [ token]);
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
