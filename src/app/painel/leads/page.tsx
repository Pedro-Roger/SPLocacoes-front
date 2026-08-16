'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import type { Lead } from '@/lib/types';
import { LEAD_STATUS_LABELS } from '@/lib/types';
import { usePainelResource } from '@/hooks/usePainelResource';

const STATUSES: Lead['status'][] = ['novo', 'contatado', 'convertido', 'perdido'];

// Funil de leads (Estágio 3): novo → contatado → convertido | perdido
export default function LeadsPage() {
  const { data: leads, error, setData: setLeads } = usePainelResource<
    Lead[],
    { items: Lead[] }
  >('/painel/leads', [], { select: (d) => d.items });
  const [tab, setTab] = useState<Lead['status']>('novo');

  async function moveTo(lead: Lead, status: Lead['status']) {
    const updated = await api<Lead>(`/painel/leads/${lead._id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    setLeads((prev) => prev.map((l) => (l._id === lead._id ? updated : l)));
  }

  const byStatus = (s: Lead['status']) => leads.filter((l) => l.status === s);
  const visible = byStatus(tab);

  return (
    <main className="container">
      <h1 className="page-title">Funil de Leads</h1>
      <p className="page-subtitle">{byStatus('novo').length} novos contatos aguardando retorno</p>

      {error && <p className="form-feedback error">{error}</p>}

      <div className="tabs">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            className={tab === s ? 'active' : ''}
            onClick={() => setTab(s)}
          >
            {LEAD_STATUS_LABELS[s]} ({byStatus(s).length})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="empty-state">Nenhum lead com status “{LEAD_STATUS_LABELS[tab]}”.</p>
      ) : (
        visible.map((lead) => (
          <div className="lead-card" key={lead._id}>
            <div className="lead-card-head">
              <strong>{lead.name}</strong>
              <span className={`chip chip-${lead.status}`}>{LEAD_STATUS_LABELS[lead.status]}</span>
            </div>
            <p>{lead.equipmentTitle}</p>
            <p>
              {lead.phone}
              {lead.email ? ` · ${lead.email}` : ''}
            </p>
            <p>{new Date(lead.createdAt).toLocaleString('pt-BR')}</p>
            <div className="lead-card-actions">
              {STATUSES.filter((s) => s !== lead.status).map((s) => (
                <button
                  key={s}
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => moveTo(lead, s)}
                >
                  → {LEAD_STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </main>
  );
}
