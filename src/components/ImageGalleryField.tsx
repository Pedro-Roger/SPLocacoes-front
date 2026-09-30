'use client';

import { useRef, useState } from 'react';
import { uploadImage } from '@/lib/upload';
import type { EquipmentImage } from '@/lib/types';
import ImageCropModal from './ImageCropModal';

// Galeria de fotos do anúncio — upload múltiplo com recorte real por imagem
// (uma por vez, em fila) antes do envio. O arquivo recortado vai pro backend
// já redimensionado/recortado; o modelo e o carrossel público continuam iguais.
export default function ImageGalleryField({
  name,
  initialImages = [],
}: {
  name: string;
  initialImages?: EquipmentImage[];
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<EquipmentImage[]>(initialImages);
  const [queue, setQueue] = useState<File[]>([]);
  const [cropping, setCropping] = useState<File | null>(null);
  const [error, setError] = useState(false);

  // Abre a fila de recorte: o primeiro arquivo vira o modal; os demais entram
  // na fila e são processados um por vez à medida que o anterior é confirmado
  // ou cancelado.
  function handleFiles(files: FileList) {
    const arr = Array.from(files);
    if (!arr.length) return;
    setQueue(arr);
    setCropping(arr[0]);
  }

  function advanceQueue() {
    setQueue((prev) => {
      const rest = prev.slice(1);
      if (rest.length) setCropping(rest[0]);
      else setCropping(null);
      return rest;
    });
  }

  // Usuário confirmou o recorte: envia o arquivo já recortado e parte pro próximo.
  async function handleCropConfirm(cropped: File) {
    setError(false);
    try {
      const url = await uploadImage(cropped);
      setImages((prev) => [...prev, { url, alt: '' }]);
    } catch {
      setError(true);
    } finally {
      advanceQueue();
    }
  }

  // Usuário cancelou a foto atual: não envia e pula pro próximo.
  function handleCropCancel() {
    advanceQueue();
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
        disabled={cropping !== null}
        onClick={() => fileRef.current?.click()}
      >
        {cropping ? 'Recortando...' : 'Adicionar fotos'}
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
      {cropping && (
        <ImageCropModal
          file={cropping}
          aspect={4 / 3}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}
