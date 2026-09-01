import type { Metadata } from 'next';
import CatalogClient from '@/components/CatalogClient';
import WhatsAppFab from '@/components/WhatsAppFab';
import VideoBanner from '@/components/VideoBanner';
import { getEquipments } from '@/lib/equipments';

export const metadata: Metadata = {
  title: 'Semirreboques Seminovos | SP Locações',
  description:
    'Semirreboques seminovos à venda na SP Locações. Equipamentos revisados e prontos para sua frota.',
};

export default async function SeminovosPage() {
  const equipments = await getEquipments('sale');

  return (
    <main>
      <VideoBanner
        src="/seminovos.mp4"
        title="Semirreboques Seminovos"
        subtitle={`${equipments.length} seminovos disponíveis`}
      >
        <div className="video-banner-actions">
          <a
            className="btn btn-primary"
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''}?text=${encodeURIComponent('Olá! Gostaria de comprar um semirreboque seminovo da SP Locações.')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar com Vendedor <span className="btn-arrow">→</span>
          </a>
          <a className="btn btn-outline-light" href="#catalogo">
            Ver Estoque
          </a>
        </div>
      </VideoBanner>
      <div className="container" id="catalogo">
        <CatalogClient initialItems={equipments} modalidade="sale" />
      </div>
      <WhatsAppFab />
    </main>
  );
}
