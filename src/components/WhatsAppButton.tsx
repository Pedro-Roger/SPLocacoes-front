'use client';

import { trackWhatsappClick } from '@/lib/tracking';
import { whatsappHref } from '@/lib/whatsapp';
import { WhatsAppIcon } from './Icons';

// CTA "Falar via WhatsApp" da página de detalhe do equipamento — registra o
// clique na métrica do anúncio (metrics.whatsappClicks) antes de abrir o WhatsApp.
export default function WhatsAppButton({ slug, message }: { slug: string; message: string }) {
  return (
    <a
      className="btn btn-whatsapp"
      href={whatsappHref(message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsappClick(slug)}
    >
      <WhatsAppIcon size={20} /> Falar via WhatsApp
    </a>
  );
}
