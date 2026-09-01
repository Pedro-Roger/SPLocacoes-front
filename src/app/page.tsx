import Link from 'next/link';
import EquipmentCard from '@/components/EquipmentCard';
import WhatsAppFab from '@/components/WhatsAppFab';
import Parallax from '@/components/Parallax';
import { getEquipments } from '@/lib/equipments';
import { getNews, formatNewsDate } from '@/lib/news';
import { ArrowRightIcon } from '@/components/Icons';
import { MotionItem, MotionSection } from '@/components/Motion';

// Início — hero em vídeo full-bleed, selos de confiança, sobre nós,
// grade inicial do catálogo e destaque de atualizações
export default async function HomePage() {
  const [equipments, news] = await Promise.all([getEquipments(), getNews()]);
  const featuredEquipments = equipments.filter((e) => e.featured);
  const featured = (featuredEquipments.length ? featuredEquipments : equipments).slice(0, 4);
  const latestNews = news.slice(0, 2);

  return (
    <main>
      <section className="hero hero-video">
        <video
          className="hero-video-media"
          src="/video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        <div className="hero-video-overlay" aria-hidden="true" />
        <div className="container hero-container hero-video-content">
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

        <section className="section about-section">
          <Parallax speed={0.08} className="about-parallax">
            <div className="section-head">
              <h2>Sobre Nós</h2>
            </div>
            <div className="about-grid">
              <div className="about-copy">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                  nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                  fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                  culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <Link href="/locacao" className="about-cta">
                  Conheça nossa frota <ArrowRightIcon size={14} />
                </Link>
              </div>
              <div className="about-media">
                <video
                  className="about-video"
                  src="/sobre.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="about-stats">
              <div className="about-stat">
                <strong>2014</strong>
                <span>fundação</span>
              </div>
              <div className="about-stat">
                <strong>SP</strong>
                <span>são paulo · brasil</span>
              </div>
              <div className="about-stat">
                <strong>24h</strong>
                <span>suporte logístico</span>
              </div>
            </div>
          </Parallax>
        </section>

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

      <section className="video-banner cta-banner">
        <div className="video-banner-media" aria-hidden="true">
          <Parallax speed={-0.18}>
            <video src="/cta.mp4" autoPlay muted loop playsInline preload="metadata" />
          </Parallax>
        </div>
        <div className="video-banner-overlay" aria-hidden="true" />
        <div className="container video-banner-content">
          <h2>Pronto para expandir sua frota?</h2>
          <p>Fale com um consultor e receba uma proposta sob medida para sua operação.</p>
          <a
            className="btn btn-primary"
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''}?text=${encodeURIComponent('Olá! Quero uma proposta da SP Locações.')}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar Consultor <span className="btn-arrow">→</span>
          </a>
        </div>
      </section>

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
