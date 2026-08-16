import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LeadForm from '@/components/LeadForm';
import WhatsAppButton from '@/components/WhatsAppButton';
import { getEquipmentBySlug } from '@/lib/equipments';
import { CATEGORY_LABELS, formatBRL } from '@/lib/types';
import { AxlesIcon, CalendarIcon, CapacityIcon, RulerIcon } from '@/components/Icons';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const equipment = await getEquipmentBySlug(slug);
  if (!equipment) return { title: 'Equipamento não encontrado' };
  return {
    title: equipment.title,
    description: equipment.description ?? `${equipment.title} disponível para locação.`,
  };
}

// Detalhe do equipamento — carrossel, preço, especificações-chave,
// formulário "Tenho Interesse" e WhatsApp com mensagem pré-preenchida
export default async function EquipamentoPage({ params }: Props) {
  const { slug } = await params;
  const equipment = await getEquipmentBySlug(slug);
  if (!equipment) notFound();

  const images = equipment.images.length
    ? equipment.images
    : [{ url: '/placeholder-trailer.svg', alt: equipment.title }];

  const whatsappMsg = `Olá! Tenho interesse no ${equipment.title} (${equipment.year}). Ele está disponível?`;

  // Dados estruturados por anúncio (Estágio 4)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: equipment.title,
    description: equipment.description,
    image: images.map((i) => i.url),
    brand: equipment.brand
      ? { '@type': 'Brand', name: equipment.brand }
      : undefined,
    offers: equipment.priceBRL
      ? {
          '@type': 'Offer',
          price: equipment.priceBRL,
          priceCurrency: 'BRL',
          availability:
            equipment.availability === 'disponivel'
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
        }
      : undefined,
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="carousel">
        {images.map((img, i) => (
          <img key={i} src={img.url} alt={img.alt || equipment.title} loading={i === 0 ? 'eager' : 'lazy'} />
        ))}
      </div>

      <div className="container">
        <div style={{ padding: '16px 0 4px' }}>
          <p className="detail-price">{formatBRL(equipment.priceBRL)}</p>
          <p className="detail-title">{equipment.title}</p>
        </div>

        <section className="panel">
          <h2>Especificações Chave</h2>
          <div className="key-specs">
            <div className="key-spec">
              <CalendarIcon />
              <strong>{equipment.year}</strong>
              Ano
            </div>
            <div className="key-spec">
              <AxlesIcon />
              <strong>{equipment.axles}</strong>
              Eixos
            </div>
            <div className="key-spec">
              <CapacityIcon />
              <strong>
                {equipment.capacityM3
                  ? `${equipment.capacityM3} m³`
                  : (CATEGORY_LABELS[equipment.category] ?? equipment.category)}
              </strong>
              {equipment.capacityM3 ? 'Capacidade' : 'Categoria'}
            </div>
            <div className="key-spec">
              <RulerIcon />
              <strong>
                {equipment.lengthM ? `${equipment.lengthM.toLocaleString('pt-BR')} m` : '—'}
              </strong>
              Comprimento
            </div>
          </div>

          {equipment.specs.length > 0 && (
            <ul className="spec-list">
              {equipment.specs.map((s) => (
                <li key={s.label}>
                  <span>{s.label}</span>
                  <strong>{s.value}</strong>
                </li>
              ))}
            </ul>
          )}
        </section>

        {equipment.description && (
          <section className="panel">
            <h2>Sobre o equipamento</h2>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--text-muted)' }}>
              {equipment.description}
            </p>
          </section>
        )}

        <section className="panel">
          <h2>Tenho Interesse</h2>
          <LeadForm equipmentId={equipment._id} equipmentTitle={equipment.title} />
        </section>

        <div style={{ padding: '14px 0 8px' }}>
          <WhatsAppButton slug={equipment.slug} message={whatsappMsg} />
        </div>
      </div>
    </main>
  );
}
