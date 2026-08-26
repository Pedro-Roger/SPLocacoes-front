import type { Metadata } from 'next';
import Link from 'next/link';
import { getNews, formatNewsDate } from '@/lib/news';
import { ArrowRightIcon } from '@/components/Icons';
import { MotionItem, MotionSection } from '@/components/Motion';

export const metadata: Metadata = {
  title: 'Atualizações',
  description:
    'Novos equipamentos, comunicados e dicas para frotistas — o mural de atualizações da SP Locações.',
};

// Mural público de notícias — imagem, data, título, resumo e chamada
// para ação, sem exigir cadastro (Estágio 4)
export default async function AtualizacoesPage() {
  const news = await getNews();

  return (
    <main className="container">
      <MotionSection>
        <h1 className="page-title">Atualizações</h1>
        <p className="page-subtitle">
          Novos equipamentos, comunicados e dicas para sua frota
        </p>
      </MotionSection>

      {news.map((n) => (
        <MotionItem key={n.slug}>
          <Link href={`/atualizacoes/${n.slug}`} className="news-card">
            <img
              className="news-card-img"
              src={n.coverImage?.url ?? '/placeholder-trailer.svg'}
              alt={n.coverImage?.alt ?? n.title}
              loading="lazy"
            />
            <div className="news-card-body">
              <span className="news-card-date">{formatNewsDate(n.publishedAt ?? n.createdAt)}</span>
              <h3>{n.title}</h3>
              <p>{n.excerpt}</p>
              <span className="news-card-cta">
                Ler mais <ArrowRightIcon size={14} />
              </span>
            </div>
          </Link>
        </MotionItem>
      ))}
    </main>
  );
}
