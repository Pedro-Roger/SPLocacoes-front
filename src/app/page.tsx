import Link from 'next/link';
import Image from 'next/image';
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
                <p className="about-lead">
                  Uma história construída para manter a sua operação em movimento.
                </p>
                <p>
                  Nossa história começa em 1997, quando a necessidade de equipamentos de
                  transporte usados revelou uma oportunidade: criar uma operação especializada
                  em semirreboques.
                </p>
                <p>
                  Depois de 19 anos de aprendizado e especialização no setor, a SP Locações foi
                  fundada em 2016. Hoje, unimos essa herança de mercado à modernidade das
                  soluções de venda e locação, com qualidade, autonomia e eficiência para nossos
                  parceiros.
                </p>
                <Link href="/locacao" className="about-cta">
                  Conheça nossa frota <ArrowRightIcon size={14} />
                </Link>
              </div>
              <div className="about-media">
                <AutoplayVideo className="about-video" src="/sobre.mp4" ariaHidden />
              </div>
            </div>
            <div className="about-timeline" aria-label="Linha do tempo da SP Locações">
              <div className="about-timeline-item">
                <strong>1997</strong>
                <span>o início da especialização</span>
              </div>
              <div className="about-timeline-line" aria-hidden="true" />
              <div className="about-timeline-item">
                <strong>2016</strong>
                <span>nasce a SP Locações</span>
              </div>
              <div className="about-timeline-line" aria-hidden="true" />
              <div className="about-timeline-item about-timeline-item-current">
                <strong>Hoje</strong>
                <span>qualidade em movimento</span>
              </div>
            </div>
            <div className="about-purpose">
              <div className="about-purpose-heading">
                <span className="about-purpose-mark" aria-hidden="true">SP</span>
                <h3>Nossa meta</h3>
              </div>
              <p>
                Não nos consolidar pelo tamanho da frota, mas pela fama da nossa qualidade.
                Queremos ser reconhecidos como o parceiro que oferece o implemento mais
                confiável, moderno e bem zelado do setor.
              </p>
              <div className="about-principles">
                <div className="about-principle">
                  <strong>Previsibilidade</strong>
                  <span>Equipamentos bem cuidados para sua operação planejar melhor.</span>
                </div>
                <div className="about-principle">
                  <strong>Economia inteligente</strong>
                  <span>Um modelo pensado para reduzir imprevistos e custo corretivo.</span>
                </div>
                <div className="about-principle">
                  <strong>Manutenção justa</strong>
                  <span>Cuidado estratégico, transparente e proporcional ao uso.</span>
                </div>
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
              {[...PARTNERS, ...PARTNERS, ...PARTNERS].map(({ name, src }, i) => (
                <div key={`${name}-${i}`} className="partners-logo">
                  <Image
                    src={src}
                    alt={`Logo ${name}`}
                    width={180}
                    height={60}
                    className="partners-logo-image"
                  />
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

// Parceiros oficiais da SP Locações
const PARTNERS: { name: string; src: string }[] = [
  { name: 'RANDON', src: '/randon-logo.png' },
  { name: 'FACCHINI', src: '/fachi-logo.png' },
  { name: 'GUERRA', src: '/guerra-logo.png' },
  { name: 'TRUCKVAN', src: '/truckvan.png' },
];
