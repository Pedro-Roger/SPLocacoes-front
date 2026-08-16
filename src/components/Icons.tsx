// Ícones inline (traço 1.8, estilo dos mockups) — sem dependência externa
type IconProps = { size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export function SearchIcon({ size = 20 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function TruckIcon({ size = 20 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden>
      <path d="M1 7h13v9H1zM14 10h4l3 3v3h-7z" />
      <circle cx="6" cy="18" r="1.8" />
      <circle cx="17.5" cy="18" r="1.8" />
    </svg>
  );
}

export function HeartIcon({ size = 20, filled = false }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base(size)} fill={filled ? 'currentColor' : 'none'} aria-hidden>
      <path d="M12 20.5C7 16.5 3 13.3 3 9.3 3 6.9 4.9 5 7.3 5c1.7 0 3.4 1 4.7 2.8C13.3 6 15 5 16.7 5 19.1 5 21 6.9 21 9.3c0 4-4 7.2-9 11.2Z" />
    </svg>
  );
}

export function UserIcon({ size = 20 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
    </svg>
  );
}

export function CalendarIcon({ size = 20 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  );
}

export function AxlesIcon({ size = 20 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden>
      <path d="M3 12h18" />
      <circle cx="7" cy="12" r="2.5" />
      <circle cx="17" cy="12" r="2.5" />
    </svg>
  );
}

export function CapacityIcon({ size = 20 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </svg>
  );
}

export function RulerIcon({ size = 20 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden>
      <rect x="2" y="9" width="20" height="6" rx="1" />
      <path d="M6 9v3M10 9v3M14 9v3M18 9v3" />
    </svg>
  );
}

export function EditIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden>
      <path d="M14.5 5.5 18.5 9.5 8 20l-4.5.5L4 16 14.5 5.5Z" />
      <path d="m13 7 4 4" />
    </svg>
  );
}

export function TrashIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden>
      <path d="M4 7h16M9 7V5h6v2M6.5 7l1 13h9l1-13" />
      <path d="M10 11v5M14 11v5" />
    </svg>
  );
}

export function ArrowRightIcon({ size = 16 }: IconProps) {
  return (
    <svg {...base(size)} aria-hidden>
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </svg>
  );
}

export function WhatsAppIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.1-.7l.4-.5c.1-.2.1-.3.2-.5v-.5L9.6 7c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.9.9-1.2 2.1-.4 3.6a12 12 0 0 0 4.6 4.4c1.7.9 2.6 1 3.5.8.6-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.7-.2Z" />
    </svg>
  );
}
