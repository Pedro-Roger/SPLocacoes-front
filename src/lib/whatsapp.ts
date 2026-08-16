const NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';

// Link do WhatsApp com mensagem pré-preenchida — usado tanto pelo botão
// flutuante genérico quanto pelo CTA da página de detalhe do equipamento.
export function whatsappHref(message: string): string {
  return `https://wa.me/${NUMBER}?text=${encodeURIComponent(message)}`;
}
