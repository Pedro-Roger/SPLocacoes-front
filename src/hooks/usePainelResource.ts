'use client';

import { useEffect, useState, type DependencyList } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface UsePainelResourceOptions<T, R> {
  // Transforma a resposta crua da API (ex.: desembrulha `{ items: T[] }`)
  select?: (raw: R) => T;
  // Dependências do fetch; padrão é refazer só quando `path` muda
  deps?: DependencyList;
}

// Hook compartilhado pelas páginas do painel: busca um recurso autenticado
// em `path`, e centraliza o tratamento de sessão expirada — igual ao guard
// do AdminShell, redireciona para /login em vez de cada página precisar
// tratar o erro "Não autenticado" no próprio JSX. `setData` fica exposto
// para as páginas atualizarem o estado local após mutações (toggle de
// status, exclusão, etc.) sem precisar refazer a busca.
export function usePainelResource<T, R = T>(
  path: string,
  init: T,
  options: UsePainelResourceOptions<T, R> = {}
) {
  const router = useRouter();
  const [data, setData] = useState<T>(init);
  const [error, setError] = useState('');
  const { select } = options;
  const deps = options.deps ?? [path];

  useEffect(() => {
    api<R>(path)
      .then((raw) => setData(select ? select(raw) : (raw as unknown as T)))
      .catch((err) => {
        if (err.message === 'Não autenticado') {
          router.replace('/login');
          return;
        }
        setError(err.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, setData };
}
