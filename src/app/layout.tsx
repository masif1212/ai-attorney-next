import { type Metadata } from 'next';
import '@/styles/tailwind.css';
import { RootLayout } from '@/components/RootLayout';

export const metadata: Metadata = {
  title: {
    template: '%s - Ai Attorney',
    default: ' Ai-Attorney',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-neutral-950 text-base antialiased">
      <body className="flex min-h-full flex-col">
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  );
}
