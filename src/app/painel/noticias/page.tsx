'use client';

import Link from 'next/link';
import { api } from '@/lib/api';
import type { News } from '@/lib/types';
import { EditIcon, TrashIcon } from '@/components/Icons';
import { usePainelResource } from '@/hooks/usePainelResource';

const STATUS_LABELS: Record<News['status'], string> = {
  rascunho: 'Rascunho',
  publicado: 'Publicado',
  agendado: 'Agendado',
};

// Gestão do mural de atualizações (Estágio 4)
export default function NoticiasPage() {
  const { data: items, error, setData: setItems } = usePainelResource<
    News[],
    { items: News[] }
  >('/painel/noticias', [], { select: (d) => d.items });

  async function handleDelete(n: News) {
    if (!window.confirm(`Excluir a notícia "${n.title}"?`)) return;
    await api(`/painel/noticias/${n._id}`, { method: 'DELETE' });
    setItems((prev) => prev.filter((i) => i._id !== n._id));
  }

  return (
    <main className="container">
      <h1 className="page-title">Notícias</h1>
      <p className="page-subtitle">Conteúdo do mural público de atualizações</p>

      {error && <p className="form-feedback error">{error}</p>}

      <div className="form-grid" style={{ marginBottom: 14 }}>
        <Link href="/painel/noticias/nova" className="btn btn-primary">
          + Nova Notícia
        </Link>
      </div>

      {items.length === 0 && !error ? (
        <p className="empty-state">Nenhuma notícia ainda. Crie a primeira em “+ Nova Notícia”.</p>
      ) : (
        items.map((n) => (
          <div className="list-row" key={n._id}>
            <div className="list-row-main">
              <strong>{n.title}</strong>
              <small>{n.excerpt}</small>
              <div style={{ marginTop: 4 }}>
                <span className={`chip chip-${n.status}`}>{STATUS_LABELS[n.status]}</span>
              </div>
            </div>
            <div className="list-row-actions">
              <Link href={`/painel/noticias/${n._id}/editar`} className="icon-btn" aria-label="Editar">
                <EditIcon />
              </Link>
              <button
                type="button"
                className="icon-btn danger"
                aria-label="Excluir"
                onClick={() => handleDelete(n)}
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        ))
      )}
    </main>
  );
}
