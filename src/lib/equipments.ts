import type { Equipment } from './types';
import { SAMPLE_EQUIPMENTS } from './sample-data';
import { API_URL } from './api';

// Busca no backend; se a API/banco ainda não estiver de pé (ou vazio),
// usa os dados provisórios para o site nunca renderizar quebrado
export async function getEquipments(): Promise<Equipment[]> {
  try {
    const res = await fetch(`${API_URL}/equipamentos?limite=100`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (!data.items?.length) throw new Error();
    return data.items;
  } catch {
    return SAMPLE_EQUIPMENTS;
  }
}

export async function getEquipmentBySlug(slug: string): Promise<Equipment | null> {
  try {
    const res = await fetch(`${API_URL}/equipamentos/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return SAMPLE_EQUIPMENTS.find((e) => e.slug === slug) ?? null;
  }
}
