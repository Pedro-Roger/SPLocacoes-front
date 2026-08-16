'use client';

import Link from 'next/link';
import { usePainelResource } from '@/hooks/usePainelResource';

interface Metrics {
  anunciosAtivos: number;
  novosLeads: number;
  cliquesWhatsapp: number;
  visualizacoes: number;
}

// Visão Geral do Painel — indicadores (mockup): anúncios ativos, novos
// leads e cliques totais
export default function PainelPage() {
  const { data: metrics, error } = usePainelResource<Metrics | null>('/painel/metricas', null);

  return (
    <main className="container">
      <h1 className="page-title">Visão Geral do Painel</h1>
      <p className="page-subtitle">Bem-vindo de volta. Aqui é o que está acontecendo com sua frota.</p>

      {error && <p className="form-feedback error">{`Erro ao carregar métricas: ${error}`}</p>}

      <div className="metric-grid">
        <div className="metric-card">
          <span>Anúncios Ativos</span>
          <strong>{metrics?.anunciosAtivos ?? '—'}</strong>
        </div>
        <div className="metric-card">
          <span>Novos Leads</span>
          <strong>{metrics?.novosLeads ?? '—'}</strong>
        </div>
        <div className="metric-card">
          <span>Cliques Totais</span>
          <strong>
            {metrics ? metrics.cliquesWhatsapp + metrics.visualizacoes : '—'}
          </strong>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h2>Atalhos</h2>
        </div>
        <div className="form-grid">
          <Link className="btn btn-primary" href="/painel/anuncios/novo">
            + Novo Anúncio
          </Link>
          <Link className="btn btn-outline" href="/painel/anuncios">
            Lista de Anúncios
          </Link>
          <Link className="btn btn-outline" href="/painel/leads">
            Funil de Leads
          </Link>
          <Link className="btn btn-outline" href="/painel/noticias">
            Notícias
          </Link>
        </div>
      </div>
    </main>
  );
}
