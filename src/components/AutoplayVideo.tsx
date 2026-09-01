'use client';

import { useEffect, useRef } from 'react';

type AutoplayVideoProps = {
  src: string;
  className?: string;
  ariaHidden?: boolean;
};

// <video> com autoplay garantido em mobile:
// - tentativa de play() programático no mount + canplay
// - pointer-events none (iOS não mostra overlay de play nativo)
// iOS bloqueia autoplay em modo baixo consumo; nesse caso o vídeo
// fica parado no primeiro frame — sem botão nativo por cima.
export default function AutoplayVideo({ src, className, ariaHidden }: AutoplayVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const tryPlay = () => {
      if (video.paused) {
        const p = video.play();
        if (p) p.catch(() => {});
      }
    };

    tryPlay();
    video.addEventListener('loadeddata', tryPlay);
    video.addEventListener('canplay', tryPlay);
    // Retenta após interação do usuário (alguns iOS só liberam depois)
    const onTouch = () => tryPlay();
    window.addEventListener('touchstart', onTouch, { once: true, passive: true });
    window.addEventListener('scroll', onTouch, { once: true, passive: true });

    return () => {
      video.removeEventListener('loadeddata', tryPlay);
      video.removeEventListener('canplay', tryPlay);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('scroll', onTouch);
    };
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      aria-hidden={ariaHidden}
      tabIndex={-1}
    />
  );
}
