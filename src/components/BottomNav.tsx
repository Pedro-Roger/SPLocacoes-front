'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { SearchIcon, TruckIcon, HeartIcon, UserIcon } from './Icons';

const ITEMS = [
  { href: '/busca', label: 'Busca', Icon: SearchIcon },
  { href: '/locacao', label: 'Catálogo', Icon: TruckIcon },
  { href: '/favoritos', label: 'Favoritos', Icon: HeartIcon },
  { href: '/login', label: 'Perfil', Icon: UserIcon },
];

// Barra de navegação inferior fixa (mockup): Busca / Catálogo / Favoritos / Perfil
export default function BottomNav() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/painel') || pathname.startsWith('/login');

  return (
    <motion.nav
      className={`bottom-nav ${isAdmin ? '' : 'storefront'}`}
      aria-label="Navegação principal"
      initial={isAdmin ? false : { opacity: 0, y: 18 }}
      animate={isAdmin ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      {ITEMS.map(({ href, label, Icon }) => (
        <motion.div key={href} className="bottom-nav-item" whileTap={isAdmin ? undefined : { scale: 0.94 }}>
          <Link href={href} className={pathname.startsWith(href) ? 'active' : ''}>
            <Icon size={22} />
            {label}
          </Link>
        </motion.div>
      ))}
    </motion.nav>
  );
}
