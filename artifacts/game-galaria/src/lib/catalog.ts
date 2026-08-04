import { Product } from '@/lib/data';

export interface CatalogCategory {
  slug: string;
  label: string;
  description: string;
  matches: (product: Product) => boolean;
}

const normalize = (value: string) => value.trim().toLowerCase();

const hasAny = (product: Product, values: string[]) => {
  const searchable = normalize(`${product.name} ${product.brand} ${product.platform} ${product.category}`);
  return values.some((value) => searchable.includes(normalize(value)));
};

export const CATALOG_CATEGORIES: CatalogCategory[] = [
  {
    slug: 'consoles',
    label: 'Consoles',
    description: 'Current-generation consoles and handheld hardware.',
    matches: (product) => normalize(product.category) === 'consoles',
  },
  {
    slug: 'playstation',
    label: 'PlayStation',
    description: 'PlayStation consoles, games, and compatible gear.',
    matches: (product) => hasAny(product, ['playstation', 'ps1', 'ps2', 'ps3', 'ps4', 'ps5', 'sony']),
  },
  {
    slug: 'xbox',
    label: 'Xbox',
    description: 'Xbox consoles, games, and compatible gear.',
    matches: (product) => hasAny(product, ['xbox', 'microsoft']),
  },
  {
    slug: 'nintendo',
    label: 'Nintendo',
    description: 'Nintendo consoles, games, and family favorites.',
    matches: (product) => hasAny(product, ['nintendo', 'switch', 'wii', 'game boy']),
  },
  {
    slug: 'gaming-pcs',
    label: 'Gaming PCs',
    description: 'Ready-to-play desktops, components, and PC setups.',
    matches: (product) => hasAny(product, ['gaming pc', 'desktop', 'computer', 'pc']),
  },
  {
    slug: 'video-games',
    label: 'Video Games',
    description: 'New releases and essential games for every platform.',
    matches: (product) => normalize(product.category) === 'games',
  },
  {
    slug: 'accessories',
    label: 'Accessories',
    description: 'The extras that make your setup more comfortable and capable.',
    matches: (product) => normalize(product.category) === 'accessories',
  },
  {
    slug: 'controllers',
    label: 'Controllers',
    description: 'Precision controllers for console and PC play.',
    matches: (product) => normalize(product.category) === 'controllers',
  },
  {
    slug: 'game-pads',
    label: 'Game Pads',
    description: 'Responsive game pads and controllers for precise play.',
    matches: (product) => normalize(product.category) === 'controllers',
  },
  {
    slug: 'headsets',
    label: 'Headsets',
    description: 'Hear every callout with immersive gaming audio.',
    matches: (product) => normalize(product.category) === 'headsets',
  },
  {
    slug: 'keyboards',
    label: 'Keyboards',
    description: 'Mechanical keyboards built for fast, comfortable play.',
    matches: (product) => normalize(product.category) === 'keyboards',
  },
  {
    slug: 'chairs',
    label: 'Gaming Chairs',
    description: 'Supportive seating for long sessions and ranked grinds.',
    matches: (product) => normalize(product.category) === 'chairs',
  },
  {
    slug: 'gift-cards',
    label: 'Gift Cards',
    description: 'Give gamers the freedom to choose their next favorite.',
    matches: (product) => normalize(product.category) === 'gift cards',
  },
];

export function slugifyCategory(value: string) {
  return normalize(value)
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getCatalogCategory(value?: string | null) {
  if (!value) return undefined;
  const aliases: Record<string, string> = {
    games: 'video-games',
    'video-game': 'video-games',
    'gaming-pc': 'gaming-pcs',
    accessories: 'accessories',
    'gift-card': 'gift-cards',
    chairs: 'chairs',
    gamepad: 'game-pads',
    gamepads: 'game-pads',
    pads: 'game-pads',
  };
  const normalizedValue = aliases[slugifyCategory(value)] || slugifyCategory(value);
  return CATALOG_CATEGORIES.find(
    (category) => category.slug === normalizedValue || slugifyCategory(category.label) === normalizedValue,
  );
}

export function resolveCatalogCategory(value: string | null | undefined, customLabels: string[] = []) {
  const builtIn = getCatalogCategory(value);
  if (builtIn) return builtIn;
  if (!value) return undefined;
  const customLabel = customLabels.find((label) => slugifyCategory(label) === slugifyCategory(value));
  if (!customLabel) return undefined;
  return {
    slug: slugifyCategory(customLabel),
    label: customLabel,
    description: `Browse the latest ${customLabel.toLowerCase()} in the Game Galaria catalog.`,
    matches: (product: Product) => product.category.trim().toLowerCase() === customLabel.trim().toLowerCase(),
  };
}

export function getCategoryLabel(value?: string | null) {
  return getCatalogCategory(value)?.label || value || 'All Gear';
}