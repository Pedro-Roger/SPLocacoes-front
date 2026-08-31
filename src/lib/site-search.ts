import type { News } from './types';
import { formatNewsDate } from './news';

export type SearchResultKind = 'pagina' | 'postagem';

export type SiteSearchResult = {
  id: string;
  kind: SearchResultKind;
  title: string;
  excerpt: string;
  href: string;
  publishedLabel?: string;
  searchableText: string;
  referencedBy: Array<{ title: string; href: string }>;
  outboundRefs: Array<{ title: string; href: string }>;
};

const STATIC_RESULTS: Omit<SiteSearchResult, 'referencedBy' | 'outboundRefs'>[] = [
  {
    id: 'page-locacao',
    kind: 'pagina',
    title: 'Catálogo de semirreboques',
    excerpt: 'Estoque para locação e seminovos: sider, graneleiro, frigorífico, prancha e outros equipamentos.',
    href: '/locacao',
    searchableText:
      'catalogo estoque locacao seminovos semirreboques sider graneleiro frigorifico prancha bau equipamentos frota',
  },
  {
    id: 'page-atualizacoes',
    kind: 'pagina',
    title: 'Atualizações da SP Locações',
    excerpt: 'Postagens, novidades de frota, dicas operacionais e conteúdos sobre transporte pesado.',
    href: '/atualizacoes',
    searchableText:
      'atualizacoes noticias postagens novidades frota dicas operacao transporte pesado semirreboques backlinks conteudo',
  },
  {
    id: 'page-favoritos',
    kind: 'pagina',
    title: 'Favoritos',
    excerpt: 'Lista de equipamentos salvos para consulta rápida.',
    href: '/favoritos',
    searchableText: 'favoritos equipamentos salvos lista consulta rapida frota',
  },
];

export function buildSiteSearchIndex(news: News[]): SiteSearchResult[] {
  const publishedNews = news.filter((item) => item.status === 'publicado');
  const postResults = publishedNews.map((item) => ({
    id: item._id,
    kind: 'postagem' as const,
    title: item.title,
    excerpt: item.excerpt,
    href: `/atualizacoes/${item.slug}`,
    publishedLabel: formatNewsDate(item.publishedAt ?? item.createdAt),
    searchableText: [item.title, item.slug, item.excerpt, item.content].join(' '),
    referencedBy: [],
    outboundRefs: [],
  }));

  const results: SiteSearchResult[] = [
    ...STATIC_RESULTS.map((item) => ({ ...item, referencedBy: [], outboundRefs: [] })),
    ...postResults,
  ];

  const postsByHref = new Map(postResults.map((item) => [item.href, item]));
  const postsBySlug = new Map(publishedNews.map((item) => [item.slug, item]));

  for (const source of publishedNews) {
    const sourceResult = postResults.find((item) => item.id === source._id);
    if (!sourceResult) continue;

    for (const target of publishedNews) {
      if (target.slug === source.slug) continue;
      if (!contentReferencesPost(source.content, target)) continue;

      const targetHref = `/atualizacoes/${target.slug}`;
      const targetResult = postsByHref.get(targetHref);
      if (!targetResult) continue;

      pushUnique(sourceResult.outboundRefs, { title: target.title, href: targetHref });
      pushUnique(targetResult.referencedBy, { title: source.title, href: `/atualizacoes/${source.slug}` });
    }

    for (const slug of extractInternalPostSlugs(source.content)) {
      const target = postsBySlug.get(slug);
      if (!target || target.slug === source.slug) continue;

      const targetHref = `/atualizacoes/${target.slug}`;
      const targetResult = postsByHref.get(targetHref);
      if (!targetResult) continue;

      pushUnique(sourceResult.outboundRefs, { title: target.title, href: targetHref });
      pushUnique(targetResult.referencedBy, { title: source.title, href: `/atualizacoes/${source.slug}` });
    }
  }

  return results;
}

function contentReferencesPost(content: string, target: News): boolean {
  const haystack = normalize(content);
  return haystack.includes(normalize(target.title)) || haystack.includes(normalize(target.slug));
}

function extractInternalPostSlugs(content: string): string[] {
  if (!content) return [];
  const matches = content.matchAll(/(?:\/atualizacoes\/|atualizacoes\/)([a-z0-9-]+)/gi);
  return Array.from(matches, (match) => match[1]);
}

function pushUnique(list: Array<{ title: string; href: string }>, item: { title: string; href: string }) {
  if (!list.some((current) => current.href === item.href)) {
    list.push(item);
  }
}

export function normalize(value: string): string {
  if (!value) return '';
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}
