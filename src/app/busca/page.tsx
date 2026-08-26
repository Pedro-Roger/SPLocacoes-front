import type { Metadata } from 'next';
import CatalogClient from '@/components/CatalogClient';
import { MotionSection } from '@/components/Motion';
import { getEquipments } from '@/lib/equipments';

export const metadata: Metadata = { title: 'Busca' };

// Busca por modelo, marca ou termo — mesma grade do catálogo
export default async function BuscaPage() {
  const equipments = await getEquipments();

  return (
    <main className="container">
      <MotionSection>
        <h1 className="page-title">Busca</h1>
        <p className="page-subtitle">Encontre por modelo, marca ou categoria</p>
      </MotionSection>
      <CatalogClient initialItems={equipments} />
    </main>
  );
}
