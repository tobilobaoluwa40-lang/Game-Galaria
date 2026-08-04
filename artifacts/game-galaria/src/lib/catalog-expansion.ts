import type { Product } from '@/lib/data';

const asset = (slug: string) => `${import.meta.env.BASE_URL}products/catalog-${slug}.jpg`;

type CategorySeed = {
  slug: string;
  category: string;
  names: string[];
  platform: string;
  brand: string;
  price: number;
  step: number;
  description: string;
};

const categorySeeds: CategorySeed[] = [
  {
    slug: 'consoles',
    category: 'Consoles',
    names: ['NovaCore X1 Console', 'Vertex Pro Console', 'Orbit One Console', 'PulseStation 4K', 'ArcadeBox Elite', 'HyperDeck Console', 'LumaPlay Console', 'TitanCore Digital', 'Quantum One Console', 'Summit Gaming Console'],
    platform: 'Multiplatform',
    brand: 'Game Galaria',
    price: 485000,
    step: 35000,
    description: 'A powerful gaming console built for fast loading, smooth 4K play, and unforgettable sessions.',
  },
  {
    slug: 'playstation',
    category: 'PlayStation',
    names: ['PlayStation Pulse Edition', 'PlayStation Edge Bundle', 'PlayStation Digital Slim', 'PlayStation VR2 Set', 'PlayStation Portal Remote', 'PlayStation Midnight Edition', 'PlayStation Pro Cooling Stand', 'PlayStation Dual Charger', 'PlayStation HD Camera Kit', 'PlayStation Racing Bundle'],
    platform: 'PlayStation',
    brand: 'Sony',
    price: 95000,
    step: 32000,
    description: 'Officially inspired PlayStation gear for cinematic adventures, competitive play, and comfortable sessions.',
  },
  {
    slug: 'xbox',
    category: 'Xbox',
    names: ['Xbox Carbon Wireless Pad', 'Xbox Elite Charge Kit', 'Xbox Game Pass Controller', 'Xbox Velocity Expansion', 'Xbox Play & Charge Pack', 'Xbox Racing Wheel Set', 'Xbox Wireless Headset', 'Xbox Media Remote', 'Xbox Adaptive Controller', 'Xbox Console Carry Case'],
    platform: 'Xbox Series X|S',
    brand: 'Microsoft',
    price: 85000,
    step: 28000,
    description: 'Xbox-ready hardware and accessories tuned for responsive play across generations.',
  },
  {
    slug: 'nintendo',
    category: 'Nintendo',
    names: ['Nintendo Switch Pro Pad', 'Nintendo Switch Carry Case', 'Nintendo Joy-Con Pair', 'Nintendo Switch Dock Set', 'Nintendo Switch Racing Wheel', 'Nintendo Switch Travel Kit', 'Nintendo Switch Lite Shell', 'Nintendo Amiibo Display Stand', 'Nintendo Wireless Adapter', 'Nintendo Switch Family Bundle'],
    platform: 'Nintendo Switch',
    brand: 'Nintendo',
    price: 45000,
    step: 24000,
    description: 'Playful Nintendo accessories and hardware for gaming at home or wherever the adventure takes you.',
  },
  {
    slug: 'gaming-pcs',
    category: 'Gaming PCs',
    names: ['Forge RTX Gaming PC', 'Nebula Creator PC', 'Sentinel Compact PC', 'Vanguard 1440p PC', 'Apex Streaming PC', 'Eclipse Mini Tower', 'Striker Liquid PC', 'Atlas Work & Play PC', 'Phantom RGB Tower', 'Titan 4K Gaming PC'],
    platform: 'PC',
    brand: 'Game Galaria Builds',
    price: 1250000,
    step: 185000,
    description: 'A performance-focused gaming PC with fast storage, upgrade-ready components, and smooth high-refresh play.',
  },
  {
    slug: 'video-games',
    category: 'Games',
    names: ['Neon Horizon', 'Kingdoms of Ember', 'Starfall Protocol', 'Riftbound Legends', 'Street Circuit 26', 'Wildlands: Afterlight', 'Mecha Frontier', 'The Last Signal', 'Dungeon Atlas', 'Velocity League'],
    platform: 'Multiplatform',
    brand: 'Game Galaria Publishing',
    price: 25000,
    step: 6500,
    description: 'A complete video game experience with a world to explore, challenges to master, and stories worth replaying.',
  },
  {
    slug: 'accessories',
    category: 'Accessories',
    names: ['RGB Desk Mat XL', 'Universal Charging Dock', 'Aluminum Cable Kit', 'Gaming Monitor Light Bar', 'Controller Display Stand', 'USB-C Hub Pro', 'Adjustable Webcam Mount', 'Magnetic Headset Hanger', 'Portable Game Stand', 'Setup Cable Sleeve'],
    platform: 'Multiplatform',
    brand: 'Game Galaria Gear',
    price: 18000,
    step: 7500,
    description: 'A thoughtful setup accessory designed to keep your space cleaner, smarter, and ready for the next match.',
  },
  {
    slug: 'controllers',
    category: 'Controllers',
    names: ['Apex Wireless Controller', 'Strike Pro Controller', 'Orbit Hall-Effect Pad', 'Tactile Combat Controller', 'Velocity Wired Pad', 'Core Bluetooth Controller', 'Arena Tournament Pad', 'Fusion Mobile Controller', 'Pulse Macro Controller', 'Summit Precision Pad'],
    platform: 'Multiplatform',
    brand: 'Game Galaria Gear',
    price: 58000,
    step: 9500,
    description: 'A responsive controller with comfortable grips, accurate inputs, and reliable connectivity for every genre.',
  },
  {
    slug: 'game-pads',
    category: 'Game Pads',
    names: ['Game Pad Core One', 'Game Pad Elite Grip', 'Game Pad Turbo X', 'Game Pad Driftless Pro', 'Game Pad Compact', 'Game Pad Tournament', 'Game Pad Wireless Duo', 'Game Pad Night Runner', 'Game Pad Arcade Pro', 'Game Pad Travel Edition'],
    platform: 'Multiplatform',
    brand: 'Game Galaria Gear',
    price: 42000,
    step: 8500,
    description: 'A comfortable game pad with precise controls, low-latency response, and an easy all-day grip.',
  },
  {
    slug: 'headsets',
    category: 'Headsets',
    names: ['EchoStrike Wireless', 'Voidline ANC Headset', 'ClearCall Tournament', 'Nebula 7.1 Headset', 'Auralis USB Headset', 'Comet Mobile Headset', 'Sentinel Pro Audio', 'PulseCast Wireless', 'Nightwave Headset', 'FocusMix Studio'],
    platform: 'Multiplatform',
    brand: 'Game Galaria Audio',
    price: 72000,
    step: 12000,
    description: 'Immersive gaming audio with a clear microphone, comfortable cushions, and detail you can hear in every scene.',
  },
  {
    slug: 'keyboards',
    category: 'Keyboards',
    names: ['Forge 60 Mechanical Keyboard', 'Tactile Pro Keyboard', 'Nightshift TKL Keyboard', 'Apex Low-Profile Board', 'Pulse RGB Keyboard', 'Command Dial Keyboard', 'Orbit Wireless Mechanical', 'Summit 75 Keyboard', 'Velocity Macro Board', 'Core Compact Keyboard'],
    platform: 'PC',
    brand: 'Game Galaria Gear',
    price: 65000,
    step: 11000,
    description: 'A fast mechanical keyboard with satisfying switches, durable construction, and focused gaming controls.',
  },
  {
    slug: 'gaming-chairs',
    category: 'Gaming Chairs',
    names: ['Atlas Ergonomic Chair', 'Forge Racing Chair', 'Sentinel Mesh Chair', 'Vertex Recline Chair', 'Summit XL Chair', 'Orbit Fabric Chair', 'Apex Lumbar Chair', 'Nightfall Executive Chair', 'Pulse Compact Chair', 'Vanguard Pro Chair'],
    platform: 'Multiplatform',
    brand: 'Game Galaria Comfort',
    price: 385000,
    step: 45000,
    description: 'Supportive ergonomic seating with adjustable comfort for long gaming sessions and focused work.',
  },
  {
    slug: 'gift-cards',
    category: 'Gift Cards',
    names: ['Game Galaria Gift Card ₦10,000', 'Game Galaria Gift Card ₦20,000', 'Game Galaria Gift Card ₦30,000', 'Game Galaria Gift Card ₦50,000', 'Game Galaria Gift Card ₦75,000', 'Game Galaria Gift Card ₦100,000', 'Game Galaria Gift Card ₦150,000', 'Game Galaria Gift Card ₦200,000', 'Game Galaria Gift Card ₦250,000', 'Game Galaria Gift Card ₦500,000'],
    platform: 'Multiplatform',
    brand: 'Game Galaria',
    price: 10000,
    step: 10000,
    description: 'A flexible Game Galaria gift card that lets every gamer choose the gear, games, or upgrades they want.',
  },
];

export const CATALOG_EXPANSION_PRODUCTS: Product[] = categorySeeds.flatMap((seed) =>
  seed.names.map((name, index) => ({
    id: `catalog-${seed.slug}-${String(index + 1).padStart(2, '0')}`,
    name,
    category: seed.category,
    platform: seed.platform,
    brand: seed.brand,
    price: seed.price + seed.step * index,
    compareAtPrice: index % 4 === 0 ? seed.price + seed.step * index + Math.round(seed.price * 0.12) : undefined,
    rating: Number((4.3 + ((index * 7) % 7) / 10).toFixed(1)),
    reviewCount: 120 + index * 137,
    image: asset(seed.slug),
    badge: index === 0 ? 'Featured' : index === 1 ? 'New Arrival' : index === 2 ? 'Popular' : undefined,
    stock: 18 + ((index * 17) % 95),
    description: seed.description,
    specs: {
      Category: seed.category,
      Platform: seed.platform,
      Collection: `${seed.brand} ${index + 1}`,
    },
  })),
);