import type { Metadata } from 'next';
import CatalogClient from '@/components/CatalogClient';
import WhatsAppFab from '@/components/WhatsAppFab';
import { MotionSection } from '@/components/Motion';
import { getEquipments } from '@/lib/equipments';

export const metadata: Metadata = {
  title: 'Semirreboques Seminovos | SP Locações',
  description:
    'Semirreboques seminovos à venda na SP Locações. Equipamentos revisados e prontos para sua frota.',
};

export default async function SeminovosPage() {
  const equipments = await getEquipments('sale');

  return (
    <main className="container">
      <MotionSection>
        <h1 className="page-title">Semirreboques Seminovos</h1>
        <p className="page-subtitle">
          {equipments.length} seminovos disponíveis
        </p>
      </MotionSection>
      <CatalogClient initialItems={equipments} modalidade="sale" />
      <WhatsAppFab />
    </main>
  );
}
