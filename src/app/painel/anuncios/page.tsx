'use client';

import Link from 'next/link';
import { useState } from 'react';
import { api } from '@/lib/api';
import type { Equipment } from '@/lib/types';
import { CATEGORY_LABELS, COMMERCIAL_TYPE_LABELS } from '@/lib/types';
import { EditIcon, SearchIcon, TrashIcon } from '@/components/Icons';
import { usePainelResource } from '@/hooks/usePainelResource';

// Lista de anúncios (mockup): miniatura, título, SKU, status
// publicado/rascunho com alternância imediata, editar e excluir
export default function AnunciosPage() {
  const { data: items, error, setData: setItems } = usePainelResource<
    Equipment[],
    { items: Equipment[] }
  >('/painel/equipamentos', [], { select: (d) => d.items });
  const [query, setQuery] = useState('');

  async function toggleStatus(e: Equipment) {
    const status = e.status === 'publicado' ? 'rascunho' : 'publicado';
    const updated = await api<Equipment>(`/painel/equipamentos/${e._id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    setItems((prev) => prev.map((i) => (i._id === e._id ? updated : i)));
  }

  async function handleDelete(e: Equipment) {
    if (!window.confirm(`Excluir o anúncio "${e.title}"? Essa ação não tem volta.`)) return;
    await api(`/painel/equipamentos/${e._id}`, { method: 'DELETE' });
    setItems((prev) => prev.filter((i) => i._id !== e._id));
  }

  const filtered = items.filter((e) =>
    e.title.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <main className="container">
      <h1 className="page-title">Lista de Anúncios</h1>
      <p className="page-subtitle">
        {items.length} anúncios — alternar o status reflete imediatamente no site
      </p>

      {error && <p className="form-feedback error">{error}</p>}

      <div className="form-grid" style={{ marginBottom: 14 }}>
        <label className="search-box">
          <SearchIcon size={18} />
          <input
            type="search"
            placeholder="Filtrar anúncios..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <Link href="/painel/anuncios/novo" className="btn btn-primary">
          + Novo Anúncio
        </Link>
      </div>

      {filtered.length === 0 && !error ? (
        <p className="empty-state">
          {items.length === 0
            ? 'Nenhum anúncio cadastrado ainda. Crie o primeiro em “+ Novo Anúncio”.'
            : 'Nenhum anúncio corresponde ao filtro.'}
        </p>
      ) : (
        filtered.map((e) => (
          <div className="list-row" key={e._id}>
            <img
              className="list-row-thumb"
              src={e.images[0]?.url ?? '/placeholder-trailer.svg'}
              alt=""
            />
            <div className="list-row-main">
              <strong>{e.title}</strong>
              <small>
                {e.sku ? `SKU: ${e.sku} · ` : ''}
                {COMMERCIAL_TYPE_LABELS[e.commercialType ?? 'both'] ?? ''} ·{' '}
                {CATEGORY_LABELS[e.category] ?? e.category} · {e.axles} eixos
              </small>
              <div style={{ marginTop: 4 }}>
                <button
                  type="button"
                  className={`chip chip-${e.status}`}
                  title="Alternar publicado/rascunho"
                  onClick={() => toggleStatus(e)}
                >
                  {e.status === 'publicado' ? '● Publicado' : '○ Rascunho'}
                </button>
              </div>
            </div>
            <div className="list-row-actions">
              <Link
                href={`/painel/anuncios/${e._id}/editar`}
                className="icon-btn"
                aria-label="Editar"
              >
                <EditIcon />
              </Link>
              <button
                type="button"
                className="icon-btn danger"
                aria-label="Excluir"
                onClick={() => handleDelete(e)}
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
