'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';

// Cabeçalho com logo e abas Locação / Seminovos / Contato
export default function Header() {
  const pathname = usePathname();
  const isLocacao = pathname === '/' || pathname.startsWith('/locacao') || pathname.startsWith('/equipamento');
  const isSeminovos = pathname.startsWith('/seminovos');
  const isAdmin = pathname.startsWith('/painel') || pathname.startsWith('/login');

  return (
    <motion.header
      className={`header ${isAdmin ? '' : 'storefront'}`}
      initial={isAdmin ? false : { opacity: 0, y: -12 }}
      animate={isAdmin ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container header-inner">
        <motion.div whileHover={isAdmin ? undefined : { y: -1 }} whileTap={isAdmin ? undefined : { scale: 0.98 }}>
          <Link href="/" className="logo">
          <img
            src="/splogo.png"
            alt="SP Locações"
            style={{ height: '56px', width: 'auto', maxHeight: '100%', objectFit: 'contain' }}
          />
          </Link>
        </motion.div>
        <nav className="header-tabs">
          <Link href="/locacao" className={isLocacao && !isSeminovos ? 'active' : ''}>
            Locação
          </Link>
          <Link href="/seminovos" className={isSeminovos ? 'active' : ''}>
            Seminovos
          </Link>
          <Link
            href="/atualizacoes"
            className={`header-tab-desktop ${pathname.startsWith('/atualizacoes') ? 'active' : ''}`}
          >
            Atualizações
          </Link>
          <Link
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''}?text=${encodeURIComponent('Olá! Gostaria de falar com um consultor da SP Locações.')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Contato
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}
