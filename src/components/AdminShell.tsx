'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const LINKS = [
  { href: '/painel', label: 'Visão Geral' },
  { href: '/painel/anuncios', label: 'Anúncios' },
  { href: '/painel/leads', label: 'Leads' },
  { href: '/painel/noticias', label: 'Notícias' },
];

// Guarda de autenticação + navegação do painel: valida a sessão em
// /auth/me e redireciona para /login quando não autenticado (Estágio 3)
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api('/auth/me')
      .then(() => setReady(true))
      .catch(() => router.replace('/login'));
  }, [router]);

  async function handleLogout() {
    await api('/auth/logout', { method: 'POST' }).catch(() => {});
    router.replace('/login');
  }

  if (!ready) return null;

  return (
    <>
      <div className="admin-topbar">
        <nav className="admin-topbar-inner">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={
                (href === '/painel' ? pathname === href : pathname.startsWith(href))
                  ? 'active'
                  : ''
              }
            >
              {label}
            </Link>
          ))}
          <button type="button" onClick={handleLogout}>
            Sair
          </button>
        </nav>
      </div>
      {children}
    </>
  );
}
