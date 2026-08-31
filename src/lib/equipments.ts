import type { Equipment } from './types';
import { API_URL } from './api';

export async function getEquipments(modalidade?: 'rental' | 'sale'): Promise<Equipment[]> {
  const params = new URLSearchParams({ limite: '100' });
  if (modalidade) params.set('modalidade', modalidade);

  const res = await fetch(`${API_URL}/equipamentos?${params.toString()}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Erro ao carregar equipamentos: ${res.status}`);
  }

  const data = await res.json();
  return data.items ?? [];
}

export async function getEquipmentBySlug(slug: string): Promise<Equipment | null> {
  const res = await fetch(`${API_URL}/equipamentos/${slug}`, {
    cache: 'no-store',
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Erro ao carregar equipamento: ${res.status}`);
  }

  return res.json();
}
