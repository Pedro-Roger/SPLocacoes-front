'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { SiteSearchResult } from '@/lib/site-search';
import { normalize } from '@/lib/site-search';
import { SearchIcon } from './Icons';
import { MotionItem, MotionSection } from './Motion';

type RankedResult = SiteSearchResult & { score: number };

export default function SiteSearchClient({ results }: { results: SiteSearchResult[] }) {
  const [query, setQuery] = useState('');
  const normalizedQuery = normalize(query);

  const filtered = useMemo(() => {
    if (!normalizedQuery) return results;
    const terms = normalizedQuery.split(' ').filter(Boolean);

    return results
      .map((item): RankedResult => {
        const text = normalize(
          [
            item.title,
            item.excerpt,
            item.searchableText,
            item.referencedBy.map((ref) => ref.title).join(' '),
            item.outboundRefs.map((ref) => ref.title).join(' '),
          ].join(' ')
        );

        const title = normalize(item.title);
        const score = terms.reduce((total, term) => {
          if (title.includes(term)) return total + 8;
          if (text.includes(term)) return total + 3;
          return total;
        }, 0);

        return { ...item, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  }, [normalizedQuery, results]);

  return (
    <>
      <MotionSection>
        <label className="search-box site-search-box">
          <SearchIcon size={18} />
          <input
            type="search"
            placeholder="Pesquisar postagens, páginas e referências internas..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
          />
        </label>
      </MotionSection>

      <MotionSection delay={0.05} className="site-search-summary">
        <strong>{filtered.length}</strong>
        <span>
          {filtered.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
          {query ? ` para "${query}"` : ''}
        </span>
      </MotionSection>

      {filtered.length === 0 ? (
        <MotionSection className="empty-state site-search-empty">
          Nenhum conteúdo encontrado. Tente buscar por frota, sider, locação, atualização ou pelo título de uma postagem.
        </MotionSection>
      ) : (
        <div className="site-search-results">
          {filtered.map((item, index) => (
            <MotionItem key={item.id} delay={Math.min(index * 0.04, 0.18)}>
              <SearchResultCard item={item} />
            </MotionItem>
          ))}
        </div>
      )}
    </>
  );
}

function SearchResultCard({ item }: { item: SiteSearchResult }) {
  return (
    <article className="site-search-card">
      <div className="site-search-card-main">
        <div className="site-search-meta">
          <span>{item.kind}</span>
          {item.publishedLabel ? <span>{item.publishedLabel}</span> : null}
        </div>
        <h2>
          <Link href={item.href}>{item.title}</Link>
        </h2>
        <p>{item.excerpt}</p>
        <Link className="site-search-cta" href={item.href}>
          Abrir conteúdo
        </Link>
      </div>

      {(item.referencedBy.length > 0 || item.outboundRefs.length > 0) && (
        <div className="site-search-links">
          {item.referencedBy.length > 0 && (
            <ReferenceList title="Referenciado em" refs={item.referencedBy} />
          )}
          {item.outboundRefs.length > 0 && (
            <ReferenceList title="Também aponta para" refs={item.outboundRefs} />
          )}
        </div>
      )}
    </article>
  );
}

function ReferenceList({ title, refs }: { title: string; refs: Array<{ title: string; href: string }> }) {
  return (
    <div>
      <strong>{title}</strong>
      {refs.slice(0, 3).map((ref) => (
        <Link key={ref.href} href={ref.href}>
          {ref.title}
        </Link>
      ))}
    </div>
  );
}
