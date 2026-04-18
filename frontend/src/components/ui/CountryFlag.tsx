/**
 * CountryFlag component - renders a flag image from flagcdn.com
 * Works on all platforms including Windows where emoji flags don't render.
 */

interface CountryFlagProps {
  code: string; // ISO 3166-1 alpha-2 country code (e.g. "FR", "US")
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_MAP = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  xl: 'w-14 h-14',
};

export default function CountryFlag({
  code,
  size = 'md',
  className = '',
}: CountryFlagProps) {
  if (!code) return <span className={SIZE_MAP[size]}>🌐</span>;

  const lowerCode = code.toLowerCase();
  // Use flagcdn.com for high-quality SVG flags
  const flagUrl = `https://flagcdn.com/${lowerCode}.svg`;

  return (
    <img
      src={flagUrl}
      alt={`${code} flag`}
      className={`${SIZE_MAP[size]} rounded-md object-cover shadow-sm ${className}`}
      loading="lazy"
      onError={(e) => {
        // Fallback to a globe emoji if image fails
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
      }}
    />
  );
}
