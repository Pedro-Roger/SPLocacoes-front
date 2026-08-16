'use client';

import { useRef, useState } from 'react';
import { uploadImage } from '@/lib/upload';

// Upload com otimização automática no backend (redimensiona + WebP).
// Preenche um input hidden `name` com a URL final da imagem.
export default function ImageUploadField({
  name,
  initialUrl,
}: {
  name: string;
  initialUrl?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl ?? '');
  const [state, setState] = useState<'idle' | 'sending' | 'error'>('idle');

  async function handleFile(file: File) {
    setState('sending');
    try {
      const uploadedUrl = await uploadImage(file);
      setUrl(uploadedUrl);
      setState('idle');
    } catch {
      setState('error');
    }
  }

  return (
    <div>
      <div className="upload-field">
        {url ? (
          <img className="upload-preview" src={url} alt="Pré-visualização" />
        ) : (
          <div className="upload-preview" aria-hidden />
        )}
        <button
          type="button"
          className="btn btn-outline btn-sm upload-btn"
          disabled={state === 'sending'}
          onClick={() => fileRef.current?.click()}
        >
          {state === 'sending'
            ? 'Enviando...'
            : url
              ? 'Trocar foto'
              : 'Enviar foto'}
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <input type="hidden" name={name} value={url} />
      {state === 'error' && (
        <p className="form-feedback error">Falha no envio da imagem. Tente novamente.</p>
      )}
    </div>
  );
}
