// Mapping of country codes (ISO alpha-2) to beautiful Unsplash landmark images.
// Using optimized Unsplash URLs with specific size and quality parameters.
const COUNTRY_IMAGES: Record<string, string> = {
  // Europe
  FR: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop',
  GB: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000&auto=format&fit=crop',
  IT: 'https://images.unsplash.com/photo-1529243856184-fd5465488984?q=80&w=1000&auto=format&fit=crop',
  ES: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=1000&auto=format&fit=crop',
  DE: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1000&auto=format&fit=crop',
  CH: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=1000&auto=format&fit=crop',
  PT: 'https://images.unsplash.com/photo-1520610334800-4740e53a22f7?q=80&w=1000&auto=format&fit=crop',
  GR: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1000&auto=format&fit=crop',
  TR: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1000&auto=format&fit=crop',

  // Americas
  US: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=1000&auto=format&fit=crop',
  CA: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=1000&auto=format&fit=crop',

  // Asia & MENA
  JP: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop',
  TH: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000&auto=format&fit=crop',
  KR: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1000&auto=format&fit=crop',
  SG: 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=1000&auto=format&fit=crop',
  AE: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop',
  SA: 'https://images.unsplash.com/photo-1510368170217-02458c30f40d?q=80&w=1000&auto=format&fit=crop',
  EG: 'https://images.unsplash.com/photo-1553915818-52ba2bd32df1?q=80&w=1000&auto=format&fit=crop',
  MA: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1000&auto=format&fit=crop',
  DZ: 'https://images.unsplash.com/photo-1544662227-66a98896068d?q=80&w=1000&auto=format&fit=crop',
  QA: 'https://images.unsplash.com/photo-1595152230551-7f052443f1b0?q=80&w=1000&auto=format&fit=crop',

  // Oceania
  AU: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=1000&auto=format&fit=crop',
};

const REGION_FALLBACKS: Record<string, string> = {
  EUROPE:
    'https://images.unsplash.com/photo-1469796466635-455ede028aca?q=80&w=1000&auto=format&fit=crop',
  ASIA: 'https://images.unsplash.com/photo-1535139262971-c5184570f711?q=80&w=1000&auto=format&fit=crop',
  AMERICAS:
    'https://images.unsplash.com/photo-1466096115517-bceecbfb6fde?q=80&w=1000&auto=format&fit=crop',
  AFRICA:
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1000&auto=format&fit=crop',
  MIDDLE_EAST:
    'https://images.unsplash.com/photo-1541417904950-b855846fe074?q=80&w=1000&auto=format&fit=crop',
  MIDDLEEAST:
    'https://images.unsplash.com/photo-1541417904950-b855846fe074?q=80&w=1000&auto=format&fit=crop',
  GLOBAL:
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000&auto=format&fit=crop',
};

export function getCountryImage(code: string, region?: string): string {
  const normalizedCode = code?.toString().trim().toUpperCase();
  if (normalizedCode && COUNTRY_IMAGES[normalizedCode]) {
    return COUNTRY_IMAGES[normalizedCode];
  }

  if (region) {
    const r = region.toString().trim().toUpperCase();
    // Try original, then without underscores, then without spaces
    if (REGION_FALLBACKS[r]) return REGION_FALLBACKS[r];

    const noUnderscore = r.replace(/_/g, '');
    if (REGION_FALLBACKS[noUnderscore]) return REGION_FALLBACKS[noUnderscore];

    const noSpace = r.replace(/\s/g, '');
    if (REGION_FALLBACKS[noSpace]) return REGION_FALLBACKS[noSpace];
  }

  return REGION_FALLBACKS['GLOBAL'];
}
