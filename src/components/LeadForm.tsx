'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

// Formulário "Tenho Interesse" — envio gera um lead consultável no painel
export default function LeadForm({
  equipmentId,
  equipmentTitle,
}: {
  equipmentId: string;
  equipmentTitle: string;
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    const form = new FormData(e.currentTarget);

    try {
      await api('/leads', {
        method: 'POST',
        body: JSON.stringify({
          equipmentId,
          name: form.get('name'),
          email: form.get('email'),
          phone: form.get('phone'),
          message: `Interesse em: ${equipmentTitle}`,
        }),
      });
      setState('ok');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao enviar');
      setState('error');
    }
  }

  if (state === 'ok') {
    return (
      <p className="form-feedback ok">
        Proposta enviada! Nossa equipe entrará em contato em breve.
      </p>
    );
  }

  return (
    <form className="form-grid form-grid-2" onSubmit={handleSubmit}>
      <input className="input" name="name" placeholder="Seu nome" required />
      <input className="input" name="email" type="email" placeholder="E-mail" />
      <input
        className="input full"
        name="phone"
        type="tel"
        placeholder="Telefone / WhatsApp"
        required
      />
      <button className="btn btn-dark full" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Enviando...' : 'Enviar Proposta'}
      </button>
      {state === 'error' && (
        <p className="form-feedback error full">
          Não foi possível enviar ({errorMsg}). Tente pelo WhatsApp abaixo.
        </p>
      )}
    </form>
  );
}
