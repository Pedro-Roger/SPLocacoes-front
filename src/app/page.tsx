import Link from 'next/link';
import EquipmentCard from '@/components/EquipmentCard';
import WhatsAppFab from '@/components/WhatsAppFab';
import Trailer3D from '@/components/Trailer3D';
import { getEquipments } from '@/lib/equipments';
import { getNews, formatNewsDate } from '@/lib/news';
import { ArrowRightIcon } from '@/components/Icons';
import { MotionItem, MotionSection } from '@/components/Motion';

// Início — hero institucional, selos de confiança, grade inicial do
// catálogo e destaque de atualizações (Estágios 1 e 4)
export default async function HomePage() {
  const [equipments, news] = await Promise.all([getEquipments(), getNews()]);
  const featuredEquipments = equipments.filter((e) => e.featured);
  const featured = (featuredEquipments.length ? featuredEquipments : equipments).slice(0, 4);
  const latestNews = news.slice(0, 2);

  return (
    <main>
      <section className="hero">
        <div className="container hero-container">
          <MotionSection className="hero-content">
            <h1>
              Soluções em
              <br />
              Semirreboques
              <br />
              para sua Frota
            </h1>
            <p>
              Tecnologia de ponta e robustez para transformar a logística de sua empresa.
              Aluguel e venda com garantia de quem entende do mercado pesado.
            </p>
            <div className="hero-actions">
              <Link href="/locacao" className="btn btn-primary">
                Ver Locação <span className="btn-arrow">→</span>
              </Link>
              <Link href="/seminovos" className="btn btn-outline-light">
                Ver Seminovos
              </Link>
              <WhatsAppLink />
            </div>
          </MotionSection>
          <MotionSection className="hero-3d-col" delay={0.12}>
            <Trailer3D />
          </MotionSection>
        </div>
      </section>

      <div className="container">
        <MotionSection className="trust-row">
          <MotionItem>
            <div className="trust-card">
            <strong>+10 Anos</strong>
            <span>de mercado</span>
            </div>
          </MotionItem>
          <MotionItem delay={0.05}>
            <div className="trust-card">
            <strong>+500</strong>
            <span>clientes atendidos</span>
            </div>
          </MotionItem>
          <MotionItem delay={0.1}>
            <div className="trust-card">
            <strong>+100</strong>
            <span>equipamentos</span>
            </div>
          </MotionItem>
        </MotionSection>

        <MotionSection className="section">
          <div className="section-head">
            <h2>Destaques do Estoque</h2>
            <Link href="/locacao">Ver todos</Link>
          </div>
          <div className="card-grid">
            {featured.map((e) => (
              <EquipmentCard key={e.slug} equipment={e} />
            ))}
          </div>
        </MotionSection>

        <MotionSection className="section">
          <div className="section-head">
            <h2>Atualizações</h2>
            <Link href="/atualizacoes">Ver mural</Link>
          </div>
          {latestNews.map((n) => (
            <Link key={n.slug} href={`/atualizacoes/${n.slug}`} className="news-card">
              <div className="news-card-body">
                <span className="news-card-date">
                  {formatNewsDate(n.publishedAt ?? n.createdAt)}
                </span>
                <h3>{n.title}</h3>
                <p>{n.excerpt}</p>
                <span className="news-card-cta">
                  Ler mais <ArrowRightIcon size={14} />
                </span>
              </div>
            </Link>
          ))}
        </MotionSection>
      </div>

      <WhatsAppFab />
    </main>
  );
}

function WhatsAppLink() {
  return (
    <a
      className="btn btn-outline-light"
      href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''}?text=${encodeURIComponent('Olá! Gostaria de falar com um consultor da SP Locações.')}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      Falar Consultor
    </a>
  );
}
