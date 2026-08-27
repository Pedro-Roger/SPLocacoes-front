import type { News } from './types';
import { API_URL } from './api';

export async function getNews(): Promise<News[]> {
  const res = await fetch(`${API_URL}/noticias?limite=50`, { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error(`Erro ao carregar notícias: ${res.status}`);
  }

  const data = await res.json();
  return data.items ?? [];
}

export async function getNewsBySlug(slug: string): Promise<News | null> {
  const res = await fetch(`${API_URL}/noticias/${slug}`, { next: { revalidate: 60 } });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Erro ao carregar notícia: ${res.status}`);
  }

  return res.json();
}

export function formatNewsDate(iso?: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}
