import type { Metadata } from 'next';
import AdminShell from '@/components/AdminShell';

export const metadata: Metadata = { robots: { index: false } };

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
