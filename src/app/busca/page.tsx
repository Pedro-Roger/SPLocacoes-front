import type { Metadata } from 'next';
import SiteSearchClient from '@/components/SiteSearchClient';
import { MotionSection } from '@/components/Motion';
import { getNews } from '@/lib/news';
import { buildSiteSearchIndex } from '@/lib/site-search';

export const metadata: Metadata = {
  title: 'Busca no site',
  description:
    'Pesquise páginas, postagens, atualizações e referências internas da SP Locações.',
};

// Busca de conteúdo do site: páginas, postagens e relações internas entre
// atualizações. Catálogo/equipamentos ficam isolados em /locacao.
export default async function BuscaPage() {
  const news = await getNews();
  const results = buildSiteSearchIndex(news);

  return (
    <main className="container">
      <MotionSection>
        <h1 className="page-title">Busca no site</h1>
        <p className="page-subtitle">
          Pesquise postagens, páginas e referências internas criadas entre os conteúdos.
        </p>
      </MotionSection>
      <SiteSearchClient results={results} />
    </main>
  );
}
