'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

// Login administrativo — único ponto de autenticação da plataforma.
// Sessão persistente via cookie httpOnly emitido pelo backend.
export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    api('/auth/me')
      .then(() => router.replace('/painel'))
      .catch(() => {});
  }, [router]);

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
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-brand">
          <img src="/splogo.png" alt="SP Locações" />
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            <span>E-mail</span>
            <input className="input" name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            <span>Senha</span>
            <input className="input" name="password" type="password" autoComplete="current-password" required />
          </label>
          <button className="btn btn-primary login-submit" type="submit" disabled={sending}>
            {sending ? 'Entrando...' : 'Entrar no painel'}
          </button>
          {error && <p className="form-feedback error">{error}</p>}
        </form>
      </section>
    </main>
  );
}
