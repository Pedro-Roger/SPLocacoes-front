'use client';

import { useEffect, useState } from 'react';
import type { Equipment } from '@/lib/types';
import { getFavorites } from '@/lib/favorites';
import { getEquipments } from '@/lib/equipments';
import EquipmentCard from '@/components/EquipmentCard';

// Favoritos — salvos no navegador, sem exigir conta (requisito do plano)
export default function FavoritosPage() {
  const [items, setItems] = useState<Equipment[] | null>(null);

  useEffect(() => {
    const slugs = getFavorites();
    getEquipments().then((all) => setItems(all.filter((e) => slugs.includes(e.slug))));
  }, []);

  return (
    <main className="container">
      <h1 className="page-title">Favoritos</h1>
      <p className="page-subtitle">Salvos neste navegador — sem precisar de conta</p>
      {items === null ? null : items.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', padding: '24px 0' }}>
          Você ainda não favoritou nenhum equipamento. Toque no coração de um card do
          catálogo para salvá-lo aqui.
        </p>
      ) : (
        <div className="card-grid">
          {items.map((e) => (
            <EquipmentCard key={e.slug} equipment={e} />
          ))}
        </div>
      )}
    </main>
  );
}
