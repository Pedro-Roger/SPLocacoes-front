import type { Metadata } from 'next';
import { Manrope, Barlow_Condensed, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import './storefront.css';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import StorefrontScope from '@/components/StorefrontScope';
import { SITE_URL } from '@/lib/site';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

// Fontes da repaginação visual (storefront) — só usadas dentro do escopo
// `.storefront` via storefront.css; não afetam o painel administrativo.
const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
  variable: '--font-sf-display',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-sf-body',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-sf-mono',
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
    <html
      lang="pt-BR"
      className={`${manrope.variable} ${barlowCondensed.variable} ${inter.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Header />
        <StorefrontScope>{children}</StorefrontScope>
        <BottomNav />
      </body>
    </html>
  );
}
