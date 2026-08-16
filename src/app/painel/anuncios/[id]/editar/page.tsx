'use client';

import { use } from 'react';
import type { Equipment } from '@/lib/types';
import EquipmentForm from '@/components/EquipmentForm';
import { usePainelResource } from '@/hooks/usePainelResource';

export default function EditarAnuncioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: equipment, error } = usePainelResource<Equipment | null>(
    `/painel/equipamentos/${id}`,
    null,
    { deps: [id] }
  );

  return (
    <main className="container">
      <h1 className="page-title">Editar Anúncio</h1>
      {error && <p className="form-feedback error">{error}</p>}
      {equipment && (
        <>
          <p className="page-subtitle">{equipment.title}</p>
          <EquipmentForm initial={equipment} />
        </>
      )}
    </main>
  );
}
