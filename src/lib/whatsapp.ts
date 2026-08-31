const NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';

export function whatsappHref(message: string): string {
  return `https://wa.me/${NUMBER}?text=${encodeURIComponent(message)}`;
}

export function whatsappRentalMsg(name: string): string {
  return `Olá, tenho interesse em alugar o equipamento ${name} que vi no site da SP Locações. Gostaria de mais informações.`;
}

export function whatsappSaleMsg(name: string): string {
  return `Olá, tenho interesse no equipamento seminovo ${name} que vi no site da SP Locações. Gostaria de mais informações.`;
}
