'use client';

import { motion } from 'motion/react';
import { trackWhatsappClick } from '@/lib/tracking';
import { whatsappHref } from '@/lib/whatsapp';
import { WhatsAppIcon } from './Icons';

// Botão flutuante de WhatsApp presente nas páginas públicas (mockup).
// Quando `slug` é informado (contexto de um equipamento específico), registra
// o clique na métrica do anúncio antes de abrir o WhatsApp.
export default function WhatsAppFab({ message, slug }: { message?: string; slug?: string }) {
  const text = message ?? 'Olá! Vim pelo site da SP Locações e gostaria de mais informações.';
  return (
    <motion.a
      className="whatsapp-fab"
      href={whatsappHref(text)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar via WhatsApp"
      initial={{ opacity: 0, scale: 0.82, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => {
        if (slug) trackWhatsappClick(slug);
      }}
    >
      <WhatsAppIcon size={28} />
    </motion.a>
  );
}
