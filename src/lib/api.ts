// Cliente HTTP central — todas as chamadas ao backend passam por aqui.
const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL?.trim() || 'https://sp-api.linkdecadastro.com.br';

// Server Components precisam de URL absoluta. No navegador, mantemos /api para
// aproveitar o rewrite do Next e preservar os cookies do painel na mesma origem.
export const API_URL = typeof window === 'undefined' ? `${API_ORIGIN}/api` : '/api';

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
