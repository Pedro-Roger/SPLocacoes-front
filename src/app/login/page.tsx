'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/api';

// Login administrativo — único ponto de autenticação da plataforma.
// Sessão persistente via cookie httpOnly emitido pelo backend.
export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError('');
    const form = new FormData(e.currentTarget);
    try {
      await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
      });
      router.push('/painel');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar');
      setSending(false);
    }
  }

  return (
    <main className="container" style={{ maxWidth: 420 }}>
      <h1 className="page-title">Área da Equipe</h1>
      <p className="page-subtitle">Acesso restrito à equipe da SP Locações</p>
      <form className="form-grid" onSubmit={handleSubmit}>
        <input className="input" name="email" type="email" placeholder="E-mail" required />
        <input className="input" name="password" type="password" placeholder="Senha" required />
        <button className="btn btn-primary" type="submit" disabled={sending}>
          {sending ? 'Entrando...' : 'Entrar'}
        </button>
        {error && <p className="form-feedback error">{error}</p>}
      </form>
    </main>
  );
}
