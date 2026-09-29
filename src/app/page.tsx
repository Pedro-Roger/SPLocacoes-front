import Link from 'next/link';
import EquipmentCard from '@/components/EquipmentCard';
import WhatsAppFab from '@/components/WhatsAppFab';
import Parallax from '@/components/Parallax';
import AutoplayVideo from '@/components/AutoplayVideo';
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
        <AutoplayVideo
          className="hero-video-media"
          src="/video.mp4"
          ariaHidden
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
                Ver Venda de Seminovos
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
                <AutoplayVideo className="about-video" src="/sobre.mp4" ariaHidden />
              </div>
            </div>
            <div className="about-stats">
              <div className="about-stat">
                <strong>2014</strong>
                <span>fundação</span>
              </div>
              <div className="about-stat">
                <strong>24h</strong>
                <span>suporte logístico</span>
              </div>
            </div>
          </Parallax>
        </section>

        <section className="section location-section">
          <div className="section-head">
            <h2>Onde estamos</h2>
          </div>
          <div className="location-card">
            <span className="location-coords">São Paulo · Brasil</span>
            <p>
              Atendemos todo o estado de São Paulo e região. Visite nosso pátio, conheça a frota
              de perto e fale com nossa equipe comercial.
            </p>
            <a
              className="btn btn-outline"
              href="https://www.google.com/maps/search/?api=1&query=SP+Locacoes"
              target="_blank"
              rel="noopener noreferrer"
            >
              Como chegar <ArrowRightIcon size={14} />
            </a>
          </div>
        </section>

        <MotionSection className="section">
          <div className="section-head">
            <h2>Destaques do Estoque</h2>
            <Link href="/locacao">Ver todos</Link>
          </div>
          {/* Carrossel lento: 2 metades idênticas → loop infinito no CSS */}
          <div className="marquee">
            <div className="marquee-track">
              {[...featured, ...featured].map((e, i) => (
                <EquipmentCard key={`${e.slug}-${i}`} equipment={e} />
              ))}
            </div>
          </div>
        </MotionSection>

        <MotionSection className="section">
          <div className="section-head">
            <h2>Atualizações</h2>
            <Link href="/atualizacoes">Ver mural</Link>
          </div>
          <div className="marquee">
            <div className="marquee-track marquee-track-news">
              {[...latestNews, ...latestNews, ...latestNews, ...latestNews].map((n, i) => (
                <Link key={`${n.slug}-${i}`} href={`/atualizacoes/${n.slug}`} className="news-card">
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
            </div>
          </div>
        </MotionSection>
      </div>

      <MotionSection className="partners-band">
        <div className="container partners-inner">
          <span className="partners-eyebrow">empresas que confiam</span>
          <h2 className="partners-title">PARCERIAS QUE LEVAM SUA CARGA MAIS LONGE</h2>
          <div className="partners-row">
            <div className="partners-track">
              {[...PARTNERS, ...PARTNERS].map(({ name, mark }, i) => (
                <div key={`${name}-${i}`} className="partners-logo">
                  <svg
                    className="partners-logo-mark"
                    viewBox="0 0 64 64"
                    role="img"
                    aria-label={`Logo ${name}`}
                  >
                    {mark}
                  </svg>
                  <span className="partners-logo-name">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MotionSection>

      <section className="video-banner cta-banner">
        <div className="video-banner-media" aria-hidden="true">
          <Parallax speed={-0.18}>
            <AutoplayVideo src="/cta.mp4" ariaHidden />
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

// Placeholders de logo dos parceiros (estilo logo wall monocromático,
// como "Our Clients" da atomhawk). Trocar por <img> quando os logos
// reais forem fornecidos.
const PARTNERS: { name: string; mark: React.ReactNode }[] = [
  {
    name: 'RANDON',
    mark: (
      <>
        <polygon points="32,6 56,20 56,44 32,58 8,44 8,20" fill="none" stroke="currentColor" strokeWidth="4" />
        <circle cx="32" cy="32" r="9" fill="currentColor" />
      </>
    ),
  },
  {
    name: 'FACCHINI',
    mark: (
      <>
        <rect x="10" y="10" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M22 42V22h20" fill="none" stroke="currentColor" strokeWidth="4" />
      </>
    ),
  },
  {
    name: 'LIBRELATO',
    mark: (
      <>
        <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M20 36c4-10 20-10 24 0" fill="none" stroke="currentColor" strokeWidth="4" />
      </>
    ),
  },
  {
    name: 'NOMA',
    mark: (
      <>
        <path d="M32 8l6.8 13.8L54 24l-11 10.7 2.6 15.1L32 42.8 18.4 49.8 21 34.7 10 24l15.2-2.2z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      </>
    ),
  },
  {
    name: 'GUERRA',
    mark: (
      <>
        <path d="M32 8l20 8v14c0 12-8.5 20.5-20 26-11.5-5.5-20-14-20-26V16z" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M24 32l6 6 12-12" fill="none" stroke="currentColor" strokeWidth="4" />
      </>
    ),
  },
  {
    name: 'RODEO',
    mark: (
      <>
        <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="4" />
        <circle cx="32" cy="32" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
        <circle cx="32" cy="32" r="3" fill="currentColor" />
      </>
    ),
  },
];
