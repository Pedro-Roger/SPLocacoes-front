export interface EquipmentImage {
  url: string;
  alt: string;
}

export interface Equipment {
  _id: string;
  title: string;
  slug: string;
  brand: string;
  sku?: string;
  category: string;
  year: number;
  axles: number;
  priceBRL?: number;
  lengthM?: number;
  capacityM3?: number;
  description?: string;
  images: EquipmentImage[];
  specs: { label: string; value: string }[];
  status: 'rascunho' | 'publicado';
  availability: 'disponivel' | 'locado' | 'indisponivel';
  featured?: boolean;
}

export interface Lead {
  _id: string;
  equipmentId: string;
  equipmentTitle: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  status: 'novo' | 'contatado' | 'convertido' | 'perdido';
  source: 'formulario' | 'whatsapp';
  notes?: string;
  createdAt: string;
}

export interface News {
  _id: string;
  title: string;
  slug: string;
  coverImage?: { url?: string; alt?: string };
  excerpt: string;
  content: string;
  status: 'rascunho' | 'publicado' | 'agendado';
  publishedAt?: string;
  scheduledFor?: string;
  createdAt: string;
}

export const LEAD_STATUS_LABELS: Record<Lead['status'], string> = {
  novo: 'Novo',
  contatado: 'Contatado',
  convertido: 'Convertido',
  perdido: 'Perdido',
};

export const CATEGORY_LABELS: Record<string, string> = {
  graneleiro: 'Graneleiro',
  bau: 'Baú',
  sider: 'Sider',
  tanque: 'Tanque',
  frigorifico: 'Frigorífico',
  prancha: 'Prancha',
  cacamba: 'Caçamba',
  outro: 'Outro',
};

export const AVAILABILITY_LABELS: Record<Equipment['availability'], string> = {
  disponivel: 'Disponível',
  locado: 'Locado',
  indisponivel: 'Indisponível',
};

export function formatBRL(value?: number): string {
  if (value == null) return 'Sob consulta';
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });
}
