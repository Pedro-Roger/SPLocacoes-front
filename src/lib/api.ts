// Cliente HTTP central — todas as chamadas ao backend passam por aqui.
// Em produção (NEXT_PUBLIC_API_URL definida), usa /api relativo para aproveitar o
// rewrite do Next.js (mesmo domínio → cookie sameSite:lax funciona sem configuração extra).
export const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? '/api'
  : 'http://localhost:4000/api';

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    // Envia o cookie httpOnly da sessão do admin
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Erro ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}
