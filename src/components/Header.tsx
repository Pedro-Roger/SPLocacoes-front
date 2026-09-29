'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const WHATSAPP_URL = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''}?text=${encodeURIComponent('Olá! Gostaria de falar com um consultor da SP Locações.')}`;

// Cabeçalho com logo, abas no desktop e menu lateral (drawer) no mobile
export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isLocacao = pathname === '/' || pathname.startsWith('/locacao') || pathname.startsWith('/equipamento');
  const isSeminovos = pathname.startsWith('/seminovos');
  const isAdmin = pathname.startsWith('/painel') || pathname.startsWith('/login');
  const isAtualizacoes = pathname.startsWith('/atualizacoes');

  // Efeito de scroll do storefront (desktop): após ~40px o header ganha
  // fundo sólido compacto e o logo encolhe. Só afeta a classe `.scrolled`.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fecha com ESC e trava scroll do body com menu aberto
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  if (isAdmin) {
    return (
      <header className="header">
        <div className="container header-inner">
          <Link href="/" className="logo">
            <img
              src="/splogo.png"
              alt="SP Locações"
              style={{ height: '56px', width: 'auto', maxHeight: '100%', objectFit: 'contain' }}
            />
          </Link>
        </div>
      </header>
    );
  }

  return (
    <>
      <motion.header
        className={`header storefront ${scrolled ? 'scrolled' : ''}`}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container header-inner">
          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
            <Link href="/" className="logo">
              <img
                src="/splogo.png"
                alt="SP Locações"
                className="header-logo-img"
                style={{ height: 'var(--header-logo-h, 56px)', width: 'auto', maxHeight: '100%', objectFit: 'contain' }}
              />
            </Link>
          </motion.div>

          <nav className="header-tabs">
            <Link href="/locacao" className={isLocacao && !isSeminovos ? 'active' : ''}>
              Locação
            </Link>
            <Link href="/seminovos" className={isSeminovos ? 'active' : ''}>
              Venda de Seminovos
            </Link>
            <Link href="/atualizacoes" className={isAtualizacoes ? 'active' : ''}>
              Atualizações
            </Link>
            <Link href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Contato
            </Link>
          </nav>

          <button
            type="button"
            className={`header-burger ${menuOpen ? 'open' : ''}`}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              className="mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              aria-label="Menu de navegação"
            >
              <div className="mobile-drawer-head">
                <img src="/splogo.png" alt="SP Locações" />
                <button
                  type="button"
                  className="mobile-drawer-close"
                  aria-label="Fechar menu"
                  onClick={() => setMenuOpen(false)}
                >
                  ×
                </button>
              </div>
              <nav className="mobile-drawer-nav" onClickCapture={closeMenu}>
                <Link href="/locacao" className={isLocacao && !isSeminovos ? 'active' : ''}>
                  Locação
                </Link>
                <Link href="/seminovos" className={isSeminovos ? 'active' : ''}>
                  Venda de Seminovos
                </Link>
                <Link href="/atualizacoes" className={isAtualizacoes ? 'active' : ''}>
                  Notícias
                </Link>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  Contato
                </a>
              </nav>
              <a
                className="btn btn-primary mobile-drawer-cta"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar Consultor <span className="btn-arrow">→</span>
              </a>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
