const PALETTE = [
  '#1a73c7', '#2e7d32', '#7b1fa2', '#c62828',
  '#00838f', '#ad1457', '#f57f17', '#4527a0',
  '#00695c', '#6d4c41',
];

function getColour(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

type AvatarProps = {
  src?: string | null;
  name: string;
  className?: string;
};

export default function Avatar({ src, name, className = 'mbc-avatar' }: AvatarProps) {
  if (src && !src.startsWith('/avatars/')) {
    return (
      <img
        src={src}
        alt={name}
        className={className}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
      />
    );
  }

  const bg = getColour(name);
  const initials = getInitials(name);

  return (
    <span
      className={`mbc-avatar-initials ${className}`}
      style={{ background: bg }}
      aria-label={name}
    >
      {initials}
    </span>
  );
}
