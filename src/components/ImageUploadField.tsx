'use client';

import { useRef, useState } from 'react';
import { uploadImage } from '@/lib/upload';
import ImageCropModal from './ImageCropModal';

// Upload com recorte real (client-side) antes do envio — proporção padrão
// 16:9 (capa de notícia). O arquivo recortado vai pro backend já cortado.
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
  const [cropFile, setCropFile] = useState<File | null>(null);

  // Abre o modal de recorte; o upload só acontece após o usuário confirmar.
  function handleFile(file: File) {
    setCropFile(file);
  }

  async function handleCropConfirm(cropped: File) {
    setState('sending');
    setCropFile(null);
    try {
      const uploadedUrl = await uploadImage(cropped);
      setUrl(uploadedUrl);
      setState('idle');
    } catch {
      setState('error');
    }
  }

  function handleCropCancel() {
    setCropFile(null);
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
      {cropFile && (
        <ImageCropModal
          file={cropFile}
          aspect={16 / 9}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}
