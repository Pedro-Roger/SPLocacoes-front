'use client';

import { usePathname } from 'next/navigation';

// Aplica o skin visual "storefront" (repaginação brutalista-editorial) só
// nas páginas públicas — /painel e /login continuam com o visual original.
export default function StorefrontScope({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/painel') || pathname.startsWith('/login');

  if (isAdmin) return <>{children}</>;

  return <div className="storefront-page">{children}</div>;
}
