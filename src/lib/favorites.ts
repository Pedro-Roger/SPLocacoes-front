// Favoritos do frotista — localStorage, sem exigir conta (requisito do plano)
const KEY = 'favoritos';

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function toggleFavorite(slug: string): string[] {
  const current = getFavorites();
  const next = current.includes(slug)
    ? current.filter((s) => s !== slug)
    : [...current, slug];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
