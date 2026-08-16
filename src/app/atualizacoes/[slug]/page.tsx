import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getNewsBySlug, formatNewsDate } from '@/lib/news';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);
  if (!news) return { title: 'Notícia não encontrada' };
  return {
    title: news.title,
    description: news.excerpt,
    openGraph: {
      type: 'article',
      title: news.title,
      description: news.excerpt,
      images: news.coverImage?.url ? [news.coverImage.url] : undefined,
      publishedTime: news.publishedAt,
    },
  };
}

// Notícia individual — otimizada para compartilhamento (Estágio 4)
export default async function NoticiaPage({ params }: Props) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);
  if (!news) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: news.title,
    description: news.excerpt,
    image: news.coverImage?.url ? [news.coverImage.url] : undefined,
    datePublished: news.publishedAt ?? news.createdAt,
    publisher: { '@type': 'Organization', name: 'SP Locações' },
  };

  return (
    <main className="container article">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="news-card-date" style={{ marginTop: 20 }}>
        {formatNewsDate(news.publishedAt ?? news.createdAt)}
      </p>
      <h1>{news.title}</h1>
      {news.coverImage?.url && (
        <img
          className="article-cover"
          src={news.coverImage.url}
          alt={news.coverImage.alt ?? news.title}
        />
      )}
      <div className="article-content">{news.content}</div>
    </main>
  );
}
