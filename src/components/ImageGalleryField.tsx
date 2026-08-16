'use client';

import { useRef, useState } from 'react';
import { uploadImage } from '@/lib/upload';
import type { EquipmentImage } from '@/lib/types';

// Galeria de fotos do anúncio — upload múltiplo (mesma otimização automática
// do backend: redimensiona + WebP), reordenação e remoção. O modelo
// (`images: [{url,alt,order}]`) e o carrossel público já suportam múltiplas
// fotos; este campo é o que faltava no painel para preenchê-las.
export default function ImageGalleryField({
  name,
  initialImages = [],
}: {
  name: string;
  initialImages?: EquipmentImage[];
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<EquipmentImage[]>(initialImages);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  async function handleFiles(files: FileList) {
    setSending(true);
    setError(false);
    try {
      for (const file of Array.from(files)) {
        const url = await uploadImage(file);
        setImages((prev) => [...prev, { url, alt: '' }]);
      }
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  }

  function remove(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function move(index: number, direction: -1 | 1) {
    setImages((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div>
      {images.length > 0 && (
        <div className="gallery-grid">
          {images.map((img, i) => (
            <div className="gallery-item" key={img.url}>
              <img className="gallery-thumb" src={img.url} alt={img.alt || 'Foto do anúncio'} />
              {i === 0 && <span className="gallery-cover-badge">Capa</span>}
              <div className="gallery-item-actions">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                  aria-label="Mover foto para cima"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  disabled={i === images.length - 1}
                  onClick={() => move(i, 1)}
                  aria-label="Mover foto para baixo"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => remove(i)}
                  aria-label="Remover foto"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        className="btn btn-outline btn-sm"
        disabled={sending}
        onClick={() => fileRef.current?.click()}
      >
        {sending ? 'Enviando...' : 'Adicionar fotos'}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
      <input type="hidden" name={name} value={JSON.stringify(images)} />
      {error && (
        <p className="form-feedback error">Falha no envio de uma ou mais fotos. Tente novamente.</p>
      )}
    </div>
  );
}
