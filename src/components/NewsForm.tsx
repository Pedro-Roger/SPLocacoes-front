'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';
import type { News } from '@/lib/types';
import ImageUploadField from './ImageUploadField';

// Formulário de notícia — criação, edição, publicação e agendamento (Estágio 4)
export default function NewsForm({ initial }: { initial?: News }) {
  const router = useRouter();
  const [status, setStatus] = useState(initial?.status ?? 'rascunho');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError('');
    const f = new FormData(e.currentTarget);

    const coverUrl = String(f.get('coverUrl') ?? '').trim();
    const payload = {
      title: f.get('title'),
      excerpt: f.get('excerpt'),
      content: f.get('content'),
      status: f.get('status'),
      scheduledFor: f.get('scheduledFor') || undefined,
      coverImage: coverUrl ? { url: coverUrl, alt: String(f.get('title') ?? '') } : initial?.coverImage,
    };

    try {
      if (initial) {
        await api(`/painel/noticias/${initial._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await api('/painel/noticias', { method: 'POST', body: JSON.stringify(payload) });
      }
      router.push('/painel/noticias');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
      setSending(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div>
        <label className="field-label" htmlFor="title">Título</label>
        <input className="input" id="title" name="title" defaultValue={initial?.title} required />
      </div>
      <div>
        <label className="field-label" htmlFor="excerpt">Resumo (exibido no card do mural)</label>
        <input className="input" id="excerpt" name="excerpt" defaultValue={initial?.excerpt} required />
      </div>
      <div>
        <span className="field-label">Imagem de capa (otimizada automaticamente)</span>
        <ImageUploadField name="coverUrl" initialUrl={initial?.coverImage?.url} />
      </div>
      <div>
        <label className="field-label" htmlFor="content">Conteúdo</label>
        <textarea className="input" id="content" name="content" defaultValue={initial?.content} required />
        <p className="field-hint">
          Para criar backlink interno, cole /atualizacoes/slug-da-postagem ou cite o título de outra postagem.
        </p>
      </div>
      <div>
        <label className="field-label" htmlFor="status">Status</label>
        <select
          className="input"
          id="status"
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as News['status'])}
        >
          <option value="rascunho">Rascunho</option>
          <option value="publicado">Publicado</option>
          <option value="agendado">Agendado</option>
        </select>
      </div>
      {status === 'agendado' && (
        <div>
          <label className="field-label" htmlFor="scheduledFor">Publicar em</label>
          <input
            className="input"
            id="scheduledFor"
            name="scheduledFor"
            type="datetime-local"
            defaultValue={initial?.scheduledFor?.slice(0, 16)}
            required
          />
        </div>
      )}
      <button className="btn btn-primary" type="submit" disabled={sending}>
        {sending ? 'Salvando...' : initial ? 'Salvar alterações' : 'Criar notícia'}
      </button>
      {error && <p className="form-feedback error">{error}</p>}
    </form>
  );
}
