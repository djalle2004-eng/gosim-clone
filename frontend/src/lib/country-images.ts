// Mapping of country codes (ISO alpha-2) to beautiful Unsplash landmark images.
// Using optimized Unsplash URLs with specific size and quality parameters.
const COUNTRY_IMAGES: Record<string, string> = {
  // Europe
  FR: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800&auto=format&fit=crop', // Paris / Eiffel Tower
  GB: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop', // London
  IT: 'https://images.unsplash.com/photo-1516483638261-f40af5afca48?q=80&w=800&auto=format&fit=crop', // Italy / Colosseum
  ES: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=800&auto=format&fit=crop', // Spain / Madrid
  DE: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800&auto=format&fit=crop', // Germany / Neuschwanstein or Berlin
  CH: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop', // Switzerland
  PT: 'https://images.unsplash.com/photo-1520610334800-4740e53a22f7?q=80&w=800&auto=format&fit=crop', // Portugal
  GR: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800&auto=format&fit=crop', // Greece / Santorini
  TR: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=800&auto=format&fit=crop', // Turkey / Cappadocia or Istanbul
  
  // Americas
  US: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?q=80&w=800&auto=format&fit=crop', // USA / New York
  CA: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=800&auto=format&fit=crop', // Canada

  // Asia & MENA
  JP: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop', // Japan / Mount Fuji
  TH: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=800&auto=format&fit=crop', // Thailand
  KR: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=800&auto=format&fit=crop', // South Korea
  SG: 'https://images.unsplash.com/photo-1525625299-524ced088ee3?q=80&w=800&auto=format&fit=crop', // Singapore
  AE: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop', // UAE / Dubai
  SA: 'https://images.unsplash.com/photo-1580418827493-f2b232e73ce6?q=80&w=800&auto=format&fit=crop', // Saudi Arabia
  EG: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2b50?q=80&w=800&auto=format&fit=crop', // Egypt / Pyramids
  MA: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=800&auto=format&fit=crop', // Morocco
  DZ: 'https://images.unsplash.com/photo-1584281722889-49cbfcfab2eb?q=80&w=800&auto=format&fit=crop', // Algeria

  // Oceania
  AU: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=800&auto=format&fit=crop', // Australia / Sydney
};

const REGION_FALLBACKS: Record<string, string> = {
  EUROPE: 'https://images.unsplash.com/photo-1469796466635-455ede028aca?q=80&w=800&auto=format&fit=crop',
  ASIA: 'https://images.unsplash.com/photo-1535139262971-c5184570f711?q=80&w=800&auto=format&fit=crop',
  AMERICAS: 'https://images.unsplash.com/photo-1466096115517-bceecbfb6fde?q=80&w=800&auto=format&fit=crop',
  AFRICA: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=800&auto=format&fit=crop',
  MIDDLEEAST: 'https://images.unsplash.com/photo-1541417904950-b855846fe074?q=80&w=800&auto=format&fit=crop',
  GLOBAL: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop' // beautiful generic travel/plane wing
};

export function getCountryImage(code: string, region?: string): string {
  if (code && COUNTRY_IMAGES[code.toUpperCase()]) {
    return COUNTRY_IMAGES[code.toUpperCase()];
  }
  if (region && REGION_FALLBACKS[region.toUpperCase()]) {
    return REGION_FALLBACKS[region.toUpperCase()];
  }
  return REGION_FALLBACKS['GLOBAL'];
}
