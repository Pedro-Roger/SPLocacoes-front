'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';
import type { Equipment, EquipmentImage } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/types';
import ImageGalleryField from './ImageGalleryField';

// Formulário de anúncio — mesmos campos exibidos no catálogo público
// (Estágio 3). Usado em "Novo Anúncio" e "Editar".
export default function EquipmentForm({ initial }: { initial?: Equipment }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError('');
    const f = new FormData(e.currentTarget);

    const num = (name: string) => {
      const v = String(f.get(name) ?? '').replace(',', '.').trim();
      return v ? Number(v) : undefined;
    };

    const title = String(f.get('title') ?? '');
    let images: EquipmentImage[] = [];
    try {
      images = JSON.parse(String(f.get('images') ?? '[]'));
    } catch {
      images = initial?.images ?? [];
    }

    const payload = {
      title,
      brand: f.get('brand'),
      sku: f.get('sku'),
      category: f.get('category'),
      year: num('year'),
      axles: num('axles'),
      priceBRL: num('priceBRL'),
      lengthM: num('lengthM'),
      capacityM3: num('capacityM3'),
      description: f.get('description'),
      status: f.get('status'),
      availability: f.get('availability'),
      featured: f.get('featured') === 'on',
      images: images.map((img, order) => ({
        url: img.url,
        alt: img.alt || title,
        order,
      })),
    };

    try {
      if (initial) {
        await api(`/painel/equipamentos/${initial._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await api('/painel/equipamentos', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      router.push('/painel/anuncios');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
      setSending(false);
    }
  }

  return (
    <form className="form-grid form-grid-2" onSubmit={handleSubmit}>
      <div className="full">
        <label className="field-label" htmlFor="title">Título do anúncio</label>
        <input
          className="input"
          id="title"
          name="title"
          defaultValue={initial?.title}
          placeholder="Ex.: Semirreboque Randon 2024 Sider"
          required
        />
      </div>

      <div>
        <label className="field-label" htmlFor="brand">Marca</label>
        <input className="input" id="brand" name="brand" defaultValue={initial?.brand} placeholder="Randon" />
      </div>
      <div>
        <label className="field-label" htmlFor="sku">SKU (código interno)</label>
        <input className="input" id="sku" name="sku" defaultValue={initial?.sku} placeholder="SP-SR-2024-001" />
      </div>

      <div>
        <label className="field-label" htmlFor="category">Categoria</label>
        <select className="input" id="category" name="category" defaultValue={initial?.category ?? 'sider'}>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="field-label" htmlFor="year">Ano</label>
        <input className="input" id="year" name="year" type="number" defaultValue={initial?.year} required />
      </div>

      <div>
        <label className="field-label" htmlFor="axles">Eixos</label>
        <input className="input" id="axles" name="axles" type="number" min={1} defaultValue={initial?.axles} required />
      </div>
      <div>
        <label className="field-label" htmlFor="priceBRL">Preço (R$)</label>
        <input className="input" id="priceBRL" name="priceBRL" type="number" defaultValue={initial?.priceBRL} placeholder="185000" />
      </div>

      <div>
        <label className="field-label" htmlFor="lengthM">Comprimento (m)</label>
        <input className="input" id="lengthM" name="lengthM" defaultValue={initial?.lengthM} placeholder="14,60" />
      </div>
      <div>
        <label className="field-label" htmlFor="capacityM3">Capacidade (m³)</label>
        <input className="input" id="capacityM3" name="capacityM3" defaultValue={initial?.capacityM3} placeholder="40" />
      </div>

      <div className="full">
        <span className="field-label">Fotos (otimizadas automaticamente — a primeira é a capa)</span>
        <ImageGalleryField name="images" initialImages={initial?.images} />
      </div>

      <div className="full">
        <label className="field-label" htmlFor="description">Descrição</label>
        <textarea className="input" id="description" name="description" defaultValue={initial?.description} />
      </div>

      <div>
        <label className="field-label" htmlFor="status">Status</label>
        <select className="input" id="status" name="status" defaultValue={initial?.status ?? 'rascunho'}>
          <option value="rascunho">Rascunho</option>
          <option value="publicado">Publicado</option>
        </select>
      </div>
      <div>
        <label className="field-label" htmlFor="availability">Disponibilidade</label>
        <select className="input" id="availability" name="availability" defaultValue={initial?.availability ?? 'disponivel'}>
          <option value="disponivel">Disponível</option>
          <option value="locado">Locado</option>
          <option value="indisponivel">Indisponível</option>
        </select>
      </div>

      <label className="full" style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}>
        <input type="checkbox" name="featured" defaultChecked={initial?.featured} />
        Destacar na página inicial
      </label>

      <button className="btn btn-primary full" type="submit" disabled={sending}>
        {sending ? 'Salvando...' : initial ? 'Salvar alterações' : 'Criar anúncio'}
      </button>
      {error && <p className="form-feedback error full">{error}</p>}
    </form>
  );
}
