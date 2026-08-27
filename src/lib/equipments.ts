import type { Equipment } from './types';
import { API_URL } from './api';

export async function getEquipments(): Promise<Equipment[]> {
  const res = await fetch(`${API_URL}/equipamentos?limite=100`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Erro ao carregar equipamentos: ${res.status}`);
  }

  const data = await res.json();
  return data.items ?? [];
}

export async function getEquipmentBySlug(slug: string): Promise<Equipment | null> {
  const res = await fetch(`${API_URL}/equipamentos/${slug}`, {
    next: { revalidate: 60 },
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Erro ao carregar equipamento: ${res.status}`);
  }

  return res.json();
}
