'use client';

import { usePathname } from 'next/navigation';
import { RootLayout } from '@/components/RootLayout';
import ClientSessionProvider from './ClientSessionProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function ClientSideLayout({ children }: { children: React.ReactNode }) {
    let pathname = usePathname();
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {pathname === '/chat' ? (
                <ClientSessionProvider>{children}</ClientSessionProvider>
            ) : pathname === '/searchcases' ? (
                // Render children without any layout or header
                <>{children}</>
            ) : pathname === '/casedetail' ? (
                <>{children}</>
            ) : (
                <RootLayout>{children}</RootLayout>
            )}
        </QueryClientProvider>
    );
}
