'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Cabeçalho com logo e abas Locação / Seminovos (mockup)
export default function Header() {
  const pathname = usePathname();
  const isLocacao = pathname === '/' || pathname.startsWith('/locacao') || pathname.startsWith('/equipamento');
  const isAdmin = pathname.startsWith('/painel') || pathname.startsWith('/login');

  return (
    <header className={`header ${isAdmin ? '' : 'storefront'}`}>
      <div className="container header-inner">
        <Link href="/" className="logo">
          <img
            src="/splogo.png"
            alt="SP Locações"
            style={{ height: '56px', width: 'auto', maxHeight: '100%', objectFit: 'contain' }}
          />
        </Link>
        <nav className="header-tabs">
          <Link href="/locacao" className={isLocacao ? 'active' : ''}>
            Locação
          </Link>
          <Link href="/locacao?tipo=seminovos">Seminovos</Link>
          <Link
            href="/atualizacoes"
            className={`header-tab-desktop ${pathname.startsWith('/atualizacoes') ? 'active' : ''}`}
          >
            Atualizações
          </Link>
        </nav>
      </div>
    </header>
  );
}
