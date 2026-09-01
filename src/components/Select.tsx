'use client';

import { useEffect, useRef, useState } from 'react';

export type SelectOption = { value: string; label: string };

type SelectProps = {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
};

// Dropdown custom (o <select> nativo tem popup do SO que não é estilizável).
// Trigger estilo pill + popover com check no item ativo. Fecha em clique fora / ESC.
export default function Select({ label, value, options, onChange }: SelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="select" ref={rootRef}>
      <button
        type="button"
        className={`select-trigger ${selected ? 'has-value' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{selected?.label ?? label}</span>
        <svg
          className="select-chevron"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul className="select-menu" role="listbox" aria-label={label}>
          <li>
            <button
              type="button"
              role="option"
              aria-selected={!selected}
              className={`select-option ${!selected ? 'selected' : ''}`}
              onClick={() => {
                onChange('');
                setOpen(false);
              }}
            >
              {label}
              {!selected && <CheckMark />}
            </button>
          </li>
          {options.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                role="option"
                aria-selected={selected?.value === o.value}
                className={`select-option ${selected?.value === o.value ? 'selected' : ''}`}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
              >
                {o.label}
                {selected?.value === o.value && <CheckMark />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CheckMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
