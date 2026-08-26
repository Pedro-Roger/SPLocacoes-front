'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Equipment } from '@/lib/types';
import { AVAILABILITY_LABELS, CATEGORY_LABELS, formatBRL } from '@/lib/types';
import { getFavorites, toggleFavorite } from '@/lib/favorites';
import { AxlesIcon, CalendarIcon, HeartIcon, RulerIcon } from './Icons';
import { MotionItem } from './Motion';

export default function EquipmentCard({ equipment }: { equipment: Equipment }) {
  const [favorite, setFavorite] = useState(() => getFavorites().includes(equipment.slug));

  const cover = equipment.images[0];

  return (
    <MotionItem className="motion-card">
      <article className="equip-card">
        <Link href={`/equipamento/${equipment.slug}`} className="equip-card-img-wrap">
          <img
            className="equip-card-img"
            src={cover?.url ?? '/placeholder-trailer.svg'}
            alt={cover?.alt ?? equipment.title}
            loading="lazy"
          />
        </Link>
        <span className={`availability-badge availability-${equipment.availability}`}>
          {AVAILABILITY_LABELS[equipment.availability]}
        </span>
        <button
          type="button"
          className={`fav-btn ${favorite ? 'active' : ''}`}
          aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          onClick={() => {
            const next = toggleFavorite(equipment.slug);
            setFavorite(next.includes(equipment.slug));
          }}
        >
          <HeartIcon size={16} filled={favorite} />
        </button>
        <Link href={`/equipamento/${equipment.slug}`} className="equip-card-body">
          <h3 className="equip-card-title">
            {equipment.brand || equipment.title} {equipment.year}
          </h3>
          <p className="equip-card-sub">{CATEGORY_LABELS[equipment.category] ?? equipment.category}</p>
          <div className="equip-card-meta">
            {equipment.lengthM ? (
              <span>
                <RulerIcon size={12} /> {equipment.lengthM.toLocaleString('pt-BR')}m
              </span>
            ) : (
              <span>
                <CalendarIcon size={12} /> {equipment.year}
              </span>
            )}
            <span>
              <AxlesIcon size={12} /> {equipment.axles} Eixos
            </span>
          </div>
          <p className="equip-card-price">{formatBRL(equipment.priceBRL)}</p>
        </Link>
      </article>
    </MotionItem>
  );
}
