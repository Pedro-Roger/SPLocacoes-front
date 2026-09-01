'use client';

import { useMemo, useState } from 'react';
import type { Equipment } from '@/lib/types';
import { AVAILABILITY_LABELS, CATEGORY_LABELS } from '@/lib/types';
import EquipmentCard from './EquipmentCard';
import Select from './Select';
import { SearchIcon } from './Icons';
import { MotionSection } from './Motion';

const PAGE_SIZE = 8;

type Filters = {
  categoria: string;
  eixos: string;
  ano: string;
  disponibilidade: string;
};

const EMPTY_FILTERS: Filters = { categoria: '', eixos: '', ano: '', disponibilidade: '' };

type Modalidade = 'rental' | 'sale';

// Catálogo: busca textual + filtros (categoria/eixos/ano/disponibilidade) +
// "Carregar mais", sem recarregar a página.
// `modalidade` controla se é Locação (rental) ou Seminovos (sale) — afeta
// o preço exibido no card (rental puro não mostra preço de venda).
export default function CatalogClient({
  initialItems,
  modalidade,
}: {
  initialItems: Equipment[];
  modalidade?: Modalidade;
}) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const axleOptions = useMemo(
    () => Array.from(new Set(initialItems.map((e) => e.axles))).sort((a, b) => a - b),
    [initialItems]
  );

  const yearOptions = useMemo(
    () => Array.from(new Set(initialItems.map((e) => e.year))).sort((a, b) => b - a),
    [initialItems]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialItems.filter((e) => {
      if (filters.categoria && e.category !== filters.categoria) return false;
      if (filters.eixos && e.axles !== Number(filters.eixos)) return false;
      if (filters.ano && e.year !== Number(filters.ano)) return false;
      if (filters.disponibilidade && e.availability !== filters.disponibilidade) return false;
      if (!q) return true;
      return [e.title, e.brand, e.model, CATEGORY_LABELS[e.category] ?? e.category, String(e.year)]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [initialItems, query, filters]);

  const items = filtered.slice(0, visible);
  const hasActiveFilters = Boolean(
    query || filters.categoria || filters.eixos || filters.ano || filters.disponibilidade
  );

  function updateFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setVisible(PAGE_SIZE);
  }

  return (
    <>
      <MotionSection>
        <label className="search-box" style={{ margin: '14px 0' }}>
          <SearchIcon size={18} />
          <input
            type="search"
            placeholder="Buscar equipamento..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisible(PAGE_SIZE);
            }}
          />
        </label>
      </MotionSection>

      <MotionSection delay={0.05}>
        <div className="filter-bar">
          <Select
            label="Todas as categorias"
            value={filters.categoria}
            options={Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }))}
            onChange={(v) => updateFilter('categoria', v)}
          />

          <Select
            label="Todos os eixos"
            value={filters.eixos}
            options={axleOptions.map((axles) => ({ value: String(axles), label: `${axles} eixos` }))}
            onChange={(v) => updateFilter('eixos', v)}
          />

          <Select
            label="Todos os anos"
            value={filters.ano}
            options={yearOptions.map((year) => ({ value: String(year), label: String(year) }))}
            onChange={(v) => updateFilter('ano', v)}
          />

          <Select
            label="Todas as disponibilidades"
            value={filters.disponibilidade}
            options={Object.entries(AVAILABILITY_LABELS).map(([value, label]) => ({ value, label }))}
            onChange={(v) => updateFilter('disponibilidade', v)}
          />

          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                setQuery('');
                setFilters(EMPTY_FILTERS);
                setVisible(PAGE_SIZE);
              }}
            >
              Limpar filtros
            </button>
          )}
        </div>
      </MotionSection>

      {items.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum equipamento encontrado com esses filtros.</p>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => {
              setQuery('');
              setFilters(EMPTY_FILTERS);
              setVisible(PAGE_SIZE);
            }}
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="card-grid">
          {items.map((e) => (
            <EquipmentCard key={e.slug} equipment={e} modalidade={modalidade} />
          ))}
        </div>
      )}

      {visible < filtered.length && (
        <div className="load-more">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
          >
            Carregar mais
          </button>
        </div>
      )}
    </>
  );
}
