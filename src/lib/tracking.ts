import { API_URL } from './api';

// Métrica de engajamento (metrics.whatsappClicks) — fire-and-forget: nunca
// deve travar ou atrasar a navegação do usuário para o WhatsApp.
export function trackWhatsappClick(slug: string) {
  fetch(`${API_URL}/equipamentos/${slug}/clique-whatsapp`, {
    method: 'POST',
    keepalive: true,
  }).catch(() => {});
}
