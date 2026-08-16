import type { MetadataRoute } from 'next';
import { getEquipments } from '@/lib/equipments';
import { getNews } from '@/lib/news';
import { SITE_URL } from '@/lib/site';

// Mapa do site: páginas fixas + anúncios e notícias publicados (Estágio 4)
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [equipments, news] = await Promise.all([getEquipments(), getNews()]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/locacao`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/atualizacoes`, changeFrequency: 'weekly', priority: 0.6 },
  ];

  return [
    ...staticPages,
    ...equipments.map((e) => ({
      url: `${SITE_URL}/equipamento/${e.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...news.map((n) => ({
      url: `${SITE_URL}/atualizacoes/${n.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ];
}
