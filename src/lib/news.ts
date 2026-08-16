import type { News } from './types';
import { API_URL } from './api';

// Notícias provisórias — fallback enquanto a API/banco não responde
export const SAMPLE_NEWS: News[] = [
  {
    _id: 'demo-n1',
    title: 'Novos siders Randon 2024 chegam à frota',
    slug: 'novos-siders-randon-2024',
    excerpt:
      'Acabamos de receber unidades zero quilômetro com suspensão pneumática, prontas para locação imediata.',
    content:
      'A SP Locações acaba de ampliar a frota com novos semirreboques sider Randon 2024, todos com suspensão pneumática e freios ABS.\n\nAs unidades já estão disponíveis para locação imediata, com contratos flexíveis mensais ou anuais. Fale com um consultor pelo WhatsApp para reservar a sua.',
    coverImage: { url: '/placeholder-trailer.svg', alt: 'Sider Randon 2024' },
    status: 'publicado',
    publishedAt: '2026-08-03T12:00:00.000Z',
    createdAt: '2026-08-03T12:00:00.000Z',
  },
  {
    _id: 'demo-n2',
    title: 'Dica: como escolher o semirreboque certo para sua operação',
    slug: 'como-escolher-semirreboque',
    excerpt:
      'Graneleiro, sider ou baú? Entenda as diferenças e escolha o equipamento ideal para o seu tipo de carga.',
    content:
      'A escolha do semirreboque impacta diretamente o custo por quilômetro da sua operação.\n\nGraneleiros são ideais para grãos e cargas secas a granel. Siders facilitam a carga e descarga lateral de paletes. Baús protegem cargas sensíveis. Frigoríficos mantêm a cadeia fria.\n\nNa dúvida, nossa equipe ajuda a dimensionar o equipamento certo para a sua rota.',
    coverImage: { url: '/placeholder-trailer.svg', alt: 'Comparativo de semirreboques' },
    status: 'publicado',
    publishedAt: '2026-07-28T12:00:00.000Z',
    createdAt: '2026-07-28T12:00:00.000Z',
  },
];

export async function getNews(): Promise<News[]> {
  try {
    const res = await fetch(`${API_URL}/noticias?limite=50`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error();
    const data = await res.json();
    if (!data.items?.length) throw new Error();
    return data.items;
  } catch {
    return SAMPLE_NEWS;
  }
}

export async function getNewsBySlug(slug: string): Promise<News | null> {
  try {
    const res = await fetch(`${API_URL}/noticias/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return SAMPLE_NEWS.find((n) => n.slug === slug) ?? null;
  }
}

export function formatNewsDate(iso?: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}
