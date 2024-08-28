import { type Metadata } from 'next';
import '@/styles/tailwind.css';
import ClientSideLayout from '@/components/ClientSideLayout';
export const metadata: Metadata = {
  title: {
    template: '%s - Ai Attorney',
    default: 'Ai-Attorney',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  
  return (
    <html lang="en" className="h-full bg-neutral-950 text-base antialiased">
      <body className="flex min-h-full flex-col">
        <ClientSideLayout>{children}</ClientSideLayout>
      </body>
    </html>
  );
}
