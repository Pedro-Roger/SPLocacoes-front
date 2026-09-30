'use client';

import { useCallback, useEffect, useState } from 'react';
import Cropper, { type Area } from 'react-easy-crop';

// Presets de proporção disponíveis para o recorte. O chamador define o default
// via prop `aspect`, mas o usuário pode trocar dentro do modal.
export const CROP_ASPECTS: { label: string; value: number }[] = [
  { label: '4:3', value: 4 / 3 }, // cards catálogo
  { label: '16:10', value: 16 / 10 }, // card storefront
  { label: '16:9', value: 16 / 9 }, // notícias / hero
  { label: '1:1', value: 1 }, // thumb quadrada
];

interface ImageCropModalProps {
  file: File;
  aspect?: number;
  onConfirm: (cropped: File) => void;
  onCancel: () => void;
}

// Modal de recorte real (client-side) antes do upload. Posiciona a máscara,
// ajusta zoom, escolhe a proporção e exporta um canvas -> WebP 0.9 (fallback
// JPEG 0.9) que já vai para o backend/S3 recortado. O backend não muda.
export default function ImageCropModal({ file, aspect = 4 / 3, onConfirm, onCancel }: ImageCropModalProps) {
  const [src, setSrc] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropArea, setCropArea] = useState<Area | null>(null);
  const [ratio, setRatio] = useState(aspect);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    // Object URL é criado fora do render e precisa de revoke no cleanup — uso
    // intencional de setState no efeito (não é disparo em cascata de render).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Fecha com ESC e trava o scroll do body (mesmo padrão do drawer)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onCancel]);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCropArea(croppedAreaPixels);
  }, []);

  async function handleConfirm() {
    if (!cropArea) return;
    setBusy(true);
    try {
      const cropped = await cropImage(file, src, cropArea);
      onConfirm(cropped);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="crop-overlay" role="dialog" aria-modal="true" aria-label="Recortar imagem">
      <div className="crop-modal">
        <div className="crop-head">
          <h3>Recortar imagem</h3>
          <button type="button" className="crop-close" onClick={onCancel} aria-label="Fechar">
            ×
          </button>
        </div>

        <div className="crop-stage">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={ratio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="crop-controls">
          <div className="crop-presets" role="group" aria-label="Proporção de recorte">
            {CROP_ASPECTS.map((p) => (
              <button
                key={p.label}
                type="button"
                className={`crop-preset ${ratio === p.value ? 'active' : ''}`}
                onClick={() => setRatio(p.value)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <label className="crop-zoom">
            <span>Zoom</span>
            <input
              type="range"
              min={1}
              max={4}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
            <span className="crop-zoom-val">{Math.round(zoom * 100)}%</span>
          </label>
        </div>

        <div className="crop-actions">
          <button type="button" className="btn btn-outline" onClick={onCancel} disabled={busy}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={busy || !cropArea}
          >
            {busy ? 'Processando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}

async function cropImage(file: File, src: string, area: Area): Promise<File> {
  const image = await loadImage(src);
  const { x, y, width: cw, height: ch } = area;

  // Limita o tamanho do canvas de saída para evitar arquivos gigantes
  const MAX = 2000;
  const scale = Math.min(1, MAX / Math.max(cw, ch));
  const outW = Math.max(1, Math.round(cw * scale));
  const outH = Math.max(1, Math.round(ch * scale));

  const canvas = document.createElement('canvas');
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas não suportado');

  ctx.drawImage(image, x, y, cw, ch, 0, 0, outW, outH);

  const blob = await canvasToBlob(canvas);
  const base = file.name.replace(/\.[^/.]+$/, '') || 'imagem';
  const ext = blob.type === 'image/webp' ? 'webp' : 'jpg';
  return new File([blob], `${base}-recortada.${ext}`, { type: blob.type });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Exporta canvas -> WebP 0.9; se o browser não suportar WebP, cai para JPEG 0.9.
function canvasToBlob(canvas: HTMLCanvasElement, quality = 0.9): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const toJpeg = () =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Falha ao exportar imagem'))),
        'image/jpeg',
        quality
      );

    if (canvas.toBlob) {
      canvas.toBlob((blob) => {
        if (blob && blob.type === 'image/webp') resolve(blob);
        else toJpeg();
      }, 'image/webp', quality);
    } else {
      toJpeg();
    }
  });
}