'use client';

import { useState } from 'react';

type Image = { url: string; alt: string };

// Galeria de imagens: imagem principal + miniaturas + navegação.
// Mobile-friendly — navegação por swipe natural (scroll horizontal das thumbs).
export default function Gallery({ images }: { images: Image[] }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="gallery">
        <img className="gallery-main" src="/placeholder-trailer.svg" alt="Sem imagem" />
      </div>
    );
  }

  const current = images[active];

  return (
    <div className="gallery">
      <div className="gallery-main-wrap">
        <img
          className="gallery-main"
          src={current.url}
          alt={current.alt}
          loading="eager"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              className="gallery-nav gallery-nav-prev"
              aria-label="Imagem anterior"
              onClick={() => setActive((i) => (i - 1 + images.length) % images.length)}
            >
              ‹
            </button>
            <button
              type="button"
              className="gallery-nav gallery-nav-next"
              aria-label="Próxima imagem"
              onClick={() => setActive((i) => (i + 1) % images.length)}
            >
              ›
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="gallery-thumbs">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              className={`gallery-thumb ${i === active ? 'active' : ''}`}
              onClick={() => setActive(i)}
              aria-label={`Ver imagem ${i + 1}`}
            >
              <img src={img.url} alt={img.alt} loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
