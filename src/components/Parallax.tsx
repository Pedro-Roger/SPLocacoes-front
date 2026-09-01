'use client';

import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react';

type ParallaxProps = {
  children?: ReactNode;
  speed?: number;
  className?: string;
  style?: CSSProperties;
};

export default function Parallax({ children, speed = 0.15, className, style }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let visible = true;

    const update = () => {
      raf = 0;
      if (!visible) return;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      // -1 (abaixo do viewport) → 1 (acima do viewport)
      const progress = 1 - (rect.top + rect.height / 2) / (viewportH / 2 + rect.height / 2);
      el.style.transform = `translate3d(0, ${(progress * speed * 100).toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      if (visible) onScroll();
    });
    observer.observe(el);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div ref={ref} className={`parallax ${className ?? ''}`} style={{ willChange: 'transform', ...style }}>
      {children}
    </div>
  );
}
