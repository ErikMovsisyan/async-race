interface Props {
  color: string;
  size?: number;
}

export default function CarIcon({ color, size = 80 }: Props) {
  const h = size * 0.45;
  return (
    <svg width={size} height={h} viewBox="0 0 80 36">
      <rect x="5" y="14" width="70" height="17" rx="4" fill={color} />
      <rect x="18" y="6" width="38" height="13" rx="3" fill={color} />
      <circle cx="19" cy="32" r="5" fill="#2c2c2c" />
      <circle cx="19" cy="32" r="2.5" fill="#888" />
      <circle cx="61" cy="32" r="5" fill="#2c2c2c" />
      <circle cx="61" cy="32" r="2.5" fill="#888" />
      <rect x="62" y="15" width="8" height="5" rx="1" fill="#ffe066" opacity="0.9" />
      <rect x="10" y="15" width="6" height="4" rx="1" fill="#ff6b6b" opacity="0.8" />
    </svg>
  );
}
