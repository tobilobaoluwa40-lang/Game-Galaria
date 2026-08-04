export type Category = string;
export type Platform = string;

export interface Product {
  id: string;
  name: string;
  category: Category;
  platform: Platform;
  brand: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: string;
  images?: string[];
  stock: number;
  description: string;
  specs: Record<string, string>;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'PlayStation 5 Console - Disc Edition',
    category: 'Consoles',
    platform: 'PS5',
    brand: 'Sony',
    price: 750000,
    rating: 4.9,
    reviewCount: 2451,
    image: 'https://placehold.co/600x600/1A2525/C2C7AC?font=Montserrat&text=PS5+Console',
    badge: 'Top Selling',
    stock: 45,
    description: 'Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio.',
    specs: {
      'Storage': '825GB SSD',
      'Resolution': '4K at 120Hz, 8K support',
      'CPU': 'AMD Ryzen Zen 2'
    }
  },
  {
    id: '2',
    name: 'Xbox Series X Console',
    category: 'Consoles',
    platform: 'Xbox Series X|S',
    brand: 'Microsoft',
    price: 750000,
    rating: 4.8,
    reviewCount: 1842,
    image: 'https://placehold.co/600x600/1A2525/C2C7AC?font=Montserrat&text=Xbox+Series+X',
    badge: 'Popular',
    stock: 20,
    description: 'The fastest, most powerful Xbox ever. Play thousands of titles from four generations of consoles.',
    specs: {
      'Storage': '1TB Custom NVME SSD',
      'Resolution': 'True 4K, up to 120 FPS',
      'CPU': '8-Core AMD Zen 2'
    }
  },
  {
    id: '3',
    name: 'DualSense Wireless Controller',
    category: 'Controllers',
    platform: 'PS5',
    brand: 'Sony',
    price: 105000,
    compareAtPrice: 112500,
    rating: 4.9,
    reviewCount: 3120,
    image: 'https://placehold.co/600x600/1A2525/C2C7AC?font=Montserrat&text=DualSense',
    badge: 'Deal',
    stock: 150,
    description: 'Discover a deeper, highly immersive gaming experience that brings the action to life in the palms of your hands.',
    specs: {
      'Connectivity': 'Bluetooth 5.1, USB-C',
      'Battery': '1560mAh rechargeable',
      'Features': 'Haptic feedback, Adaptive triggers'
    }
  },
  {
    id: '4',
    name: 'Cyberpunk 2077: Ultimate Edition',
    category: 'Games',
    platform: 'Multiplatform',
    brand: 'CD Projekt Red',
    price: 90000,
    rating: 4.5,
    reviewCount: 856,
    image: 'https://placehold.co/600x600/1A2525/C2C7AC?font=Montserrat&text=Cyberpunk+2077',
    stock: 200,
    description: 'An open-world, action-adventure RPG set in the megalopolis of Night City.',
    specs: {
      'Genre': 'RPG',
      'Modes': 'Single-player'
    }
  },
  {
    id: '5',
    name: 'Razer BlackWidow V4 Pro',
    category: 'Keyboards',
    platform: 'PC',
    brand: 'Razer',
    price: 345000,
    rating: 4.7,
    reviewCount: 412,
    image: 'https://placehold.co/600x600/1A2525/C2C7AC?font=Montserrat&text=BlackWidow+V4',
    badge: 'New Arrival',
    stock: 35,
    description: 'Advanced mechanical gaming keyboard with Razer Command Dial and dedicated macro keys.',
    specs: {
      'Switches': 'Razer Green Mechanical',
      'Lighting': 'Razer Chroma RGB',
      'Connectivity': 'Wired - Detachable Type-C'
    }
  },
  {
    id: '6',
    name: 'SteelSeries Arctis Nova Pro Wireless',
    category: 'Headsets',
    platform: 'Multiplatform',
    brand: 'SteelSeries',
    price: 525000,
    rating: 4.8,
    reviewCount: 524,
    image: 'https://placehold.co/600x600/1A2525/C2C7AC?font=Montserrat&text=Arctis+Nova+Pro',
    badge: 'Featured',
    stock: 18,
    description: 'Premium wireless gaming headset with active noise cancellation and hot-swappable batteries.',
    specs: {
      'Drivers': '40mm Neodymium',
      'Battery Life': 'Up to 44 hours',
      'Microphone': 'ClearCast Gen 2 Retractable'
    }
  },
  {
    id: '7',
    name: 'Nintendo Switch OLED Model',
    category: 'Consoles',
    platform: 'Nintendo Switch',
    brand: 'Nintendo',
    price: 525000,
    rating: 4.9,
    reviewCount: 4210,
    image: 'https://placehold.co/600x600/1A2525/C2C7AC?font=Montserrat&text=Switch+OLED',
    stock: 80,
    description: 'Play at home on the TV or on-the-go with a vibrant 7-inch OLED screen.',
    specs: {
      'Screen': '7.0" OLED touch screen',
      'Storage': '64GB Internal',
      'Battery': '4.5 - 9 Hours'
    }
  },
  {
    id: '8',
    name: 'Secretlab TITAN Evo',
    category: 'Chairs',
    platform: 'Multiplatform',
    brand: 'Secretlab',
    price: 823500,
    rating: 4.9,
    reviewCount: 1540,
    image: 'https://placehold.co/600x600/1A2525/C2C7AC?font=Montserrat&text=TITAN+Evo',
    badge: 'Top Selling',
    stock: 12,
    description: 'The most advanced ergonomic gaming chair. Next-generation ergonomics for long gaming sessions.',
    specs: {
      'Material': 'Neo Hybrid Leatherette',
      'Lumbar Support': '4-way L-ADAPT',
      'Armrests': 'Full-Metal 4D'
    }
  }
];
