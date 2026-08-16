'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Cabeçalho com logo e abas Locação / Seminovos (mockup)
export default function Header() {
  const pathname = usePathname();
  const isLocacao = pathname === '/' || pathname.startsWith('/locacao') || pathname.startsWith('/equipamento');

  return (
    <header className="header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          <span className="logo-mark">SP</span>
          <span className="logo-name">
            SP
            <br />
            Locações
          </span>
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
