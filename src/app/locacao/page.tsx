import type { Metadata } from 'next';
import CatalogClient from '@/components/CatalogClient';
import WhatsAppFab from '@/components/WhatsAppFab';
import VideoBanner from '@/components/VideoBanner';
import { getEquipments } from '@/lib/equipments';

export const metadata: Metadata = {
  title: 'Locação de Semirreboques | SP Locações',
  description:
    'Encontre semirreboques disponíveis para locação na SP Locações: sider, graneleiro, frigorífico, prancha e mais.',
};

export default async function LocacaoPage() {
  const equipments = await getEquipments('rental');

  return (
    <main>
      <VideoBanner
        src="/locacao.mp4"
        title="Semirreboques para sua Frota"
        subtitle={`${equipments.length} equipamentos disponíveis para locação`}
      >
        <div className="video-banner-actions">
          <a
            className="btn btn-primary"
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''}?text=${encodeURIComponent('Olá! Gostaria de alugar um semirreboque da SP Locações.')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Solicitar Orçamento <span className="btn-arrow">→</span>
          </a>
          <a className="btn btn-outline-light" href="#catalogo">
            Ver Estoque
          </a>
        </div>
      </VideoBanner>
      <div className="container" id="catalogo">
        <CatalogClient initialItems={equipments} modalidade="rental" />
      </div>
      <WhatsAppFab />
    </main>
  );
}
