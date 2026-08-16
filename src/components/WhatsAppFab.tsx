'use client';

import { trackWhatsappClick } from '@/lib/tracking';
import { whatsappHref } from '@/lib/whatsapp';
import { WhatsAppIcon } from './Icons';

// Botão flutuante de WhatsApp presente nas páginas públicas (mockup).
// Quando `slug` é informado (contexto de um equipamento específico), registra
// o clique na métrica do anúncio antes de abrir o WhatsApp.
export default function WhatsAppFab({ message, slug }: { message?: string; slug?: string }) {
  const text = message ?? 'Olá! Vim pelo site da SP Locações e gostaria de mais informações.';
  return (
    <a
      className="whatsapp-fab"
      href={whatsappHref(text)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar via WhatsApp"
      onClick={() => {
        if (slug) trackWhatsappClick(slug);
      }}
    >
      <WhatsAppIcon size={28} />
    </a>
  );
}
