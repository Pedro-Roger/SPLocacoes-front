'use client';

import { use } from 'react';
import type { News } from '@/lib/types';
import NewsForm from '@/components/NewsForm';
import { usePainelResource } from '@/hooks/usePainelResource';

export default function EditarNoticiaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: news, error } = usePainelResource<News | null>(`/painel/noticias/${id}`, null, {
    deps: [id],
  });

  return (
    <main className="container">
      <h1 className="page-title">Editar Notícia</h1>
      {error && <p className="form-feedback error">{error}</p>}
      {news && <NewsForm initial={news} />}
    </main>
  );
}
