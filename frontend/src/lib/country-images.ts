// Mapping of country codes (ISO alpha-2) to beautiful Unsplash landmark images.
// Using optimized Unsplash URLs with specific size and quality parameters.

// These specific images are known to work and not be blocked by DNS/adblockers:
const KNOWN_WORKING = {
  CITY_AE:
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1000&auto=format&fit=crop',
  MOSQUE_MA:
    'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1000&auto=format&fit=crop',
  TREE_AFRICA:
    'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=1000&auto=format&fit=crop',
  MOUNTAIN_CA:
    'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=1000&auto=format&fit=crop',
  CITY_GLOBAL:
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1000&auto=format&fit=crop',
  CITY_ASIA:
    'https://images.unsplash.com/photo-1535139262971-c5184570f711?q=80&w=1000&auto=format&fit=crop',
  CITY_EU:
    'https://images.unsplash.com/photo-1469796466635-455ede028aca?q=80&w=1000&auto=format&fit=crop',
};

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
  CA: KNOWN_WORKING.MOUNTAIN_CA,

  // Asia & MENA
  JP: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop',
  TH: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1000&auto=format&fit=crop',
  KR: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1000&auto=format&fit=crop',
  SG: 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=1000&auto=format&fit=crop',

  // Known working MENA/Africa overrides
  AE: KNOWN_WORKING.CITY_AE,
  SA: KNOWN_WORKING.CITY_AE,
  QA: KNOWN_WORKING.CITY_AE,
  MA: KNOWN_WORKING.MOSQUE_MA,
  DZ: KNOWN_WORKING.MOSQUE_MA,
  EG: KNOWN_WORKING.TREE_AFRICA,

  // Oceania
  AU: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=1000&auto=format&fit=crop',
};

const REGION_FALLBACKS: Record<string, string> = {
  EUROPE: KNOWN_WORKING.CITY_EU,
  ASIA: KNOWN_WORKING.CITY_ASIA,
  AMERICAS: KNOWN_WORKING.MOUNTAIN_CA,
  AFRICA: KNOWN_WORKING.TREE_AFRICA,
  MIDDLE_EAST: KNOWN_WORKING.CITY_AE,
  MIDDLEEAST: KNOWN_WORKING.CITY_AE,
  GLOBAL: KNOWN_WORKING.CITY_GLOBAL,
};

export function getCountryImage(code: string, region?: string): string {
  const normalizedCode = code?.toString().trim().toUpperCase();
  if (normalizedCode && COUNTRY_IMAGES[normalizedCode]) {
    return COUNTRY_IMAGES[normalizedCode];
  }

  if (region) {
    const r = region.toString().trim().toUpperCase();
    if (REGION_FALLBACKS[r]) return REGION_FALLBACKS[r];

    const noUnderscore = r.replace(/_/g, '');
    if (REGION_FALLBACKS[noUnderscore]) return REGION_FALLBACKS[noUnderscore];

    const noSpace = r.replace(/\s/g, '');
    if (REGION_FALLBACKS[noSpace]) return REGION_FALLBACKS[noSpace];
  }

  return REGION_FALLBACKS['GLOBAL'];
}
