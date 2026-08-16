import { API_URL } from './api';

// Upload de imagem com otimização automática no backend (sharp: redimensiona
// + WebP). Usado pelo campo de foto única (capa de notícia) e pela galeria
// de fotos do anúncio — ambos sobem pro mesmo endpoint.
export async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append('file', file);
  const res = await fetch(`${API_URL}/painel/upload`, {
    method: 'POST',
    credentials: 'include',
    body,
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error);
  const data = await res.json();
  return data.url;
}
