'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    <nav className={`bottom-nav ${isAdmin ? '' : 'storefront'}`} aria-label="Navegação principal">
      {ITEMS.map(({ href, label, Icon }) => (
        <Link key={href} href={href} className={pathname.startsWith(href) ? 'active' : ''}>
          <Icon size={22} />
          {label}
        </Link>
      ))}
    </nav>
  );
}
