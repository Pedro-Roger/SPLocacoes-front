import type { Metadata } from 'next';
import CatalogClient from '@/components/CatalogClient';
import WhatsAppFab from '@/components/WhatsAppFab';
import { getEquipments } from '@/lib/equipments';

export const metadata: Metadata = {
  title: 'Locação de Semirreboques',
  description:
    'Catálogo completo de semirreboques para locação: sider, graneleiro, frigorífico, prancha e mais.',
};

export default async function CatalogoPage() {
  const equipments = await getEquipments();

  return (
    <main className="container">
      <h1 className="page-title">Semirreboques para sua Frota</h1>
      <p className="page-subtitle">
        {equipments.length} equipamentos disponíveis para locação
      </p>
      <CatalogClient initialItems={equipments} />
      <WhatsAppFab />
    </main>
  );
}
