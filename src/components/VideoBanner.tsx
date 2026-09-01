import type { ReactNode } from 'react';
import Parallax from '@/components/Parallax';
import AutoplayVideo from '@/components/AutoplayVideo';

type VideoBannerProps = {
  src: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

// Banner com vídeo de fundo full-bleed, overlay navy e conteúdo por cima.
// Parallax sutil no vídeo (cresce 40px além do container pra dar profundidade).
export default function VideoBanner({ src, title, subtitle, children }: VideoBannerProps) {
  return (
    <section className="video-banner">
      <div className="video-banner-media" aria-hidden="true">
        <Parallax speed={-0.18}>
          <AutoplayVideo src={src} ariaHidden />
        </Parallax>
      </div>
      <div className="video-banner-overlay" aria-hidden="true" />
      <div className="container video-banner-content">
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
        {children}
      </div>
    </section>
  );
}
