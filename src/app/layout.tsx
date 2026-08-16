import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { SITE_URL } from '@/lib/site';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'SP Locações — Locação de Semirreboques',
    template: '%s | SP Locações',
  },
  description:
    'Soluções em semirreboques para sua frota: locação e venda de sider, graneleiro, frigorífico, prancha e mais. Fale direto pelo WhatsApp.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'SP Locações',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={manrope.variable}>
      <body>
        <Header />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
