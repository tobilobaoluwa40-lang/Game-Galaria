import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { MOCK_PRODUCTS, Product } from '@/lib/data';

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Rejected';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  customerName?: string;
  customerEmail?: string;
  shippingDetails?: Record<string, string>;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  joined: string;
  status: 'Active' | 'Suspended';
  addresses: string[];
  supportRequests: number;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  uses: number;
  active: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  active: boolean;
}

export interface StoreSettings {
  logo: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  paymentInstructions: string;
  terms: string;
  privacy: string;
}

const defaultCategories = ['Consoles', 'Games', 'Controllers', 'Headsets', 'Keyboards', 'Chairs', 'Accessories', 'Gift Cards'];
const defaultCustomers: Customer[] = [
  { id: 'cus-1', name: 'John Doe', email: 'john@example.com', phone: '+1 555 0123', joined: '2026-06-04', status: 'Active', addresses: ['42 Pixel Lane, Austin, TX'], supportRequests: 0 },
  { id: 'cus-2', name: 'Maya Chen', email: 'maya@example.com', phone: '+1 555 0188', joined: '2026-06-18', status: 'Active', addresses: ['18 Arcade Ave, Seattle, WA'], supportRequests: 1 },
  { id: 'cus-3', name: 'Chris Walker', email: 'chris@example.com', phone: '+1 555 0199', joined: '2026-07-02', status: 'Active', addresses: ['9 Respawn Road, Denver, CO'], supportRequests: 2 },
];
const defaultSettings: StoreSettings = {
  logo: 'GAMEGALARIA',
  contactEmail: 'support@gamegalaria.com',
  contactPhone: '+1 (800) 555-GAME',
  address: '100 Pixel Avenue, Austin, TX',
  deliveryFee: 15,
  freeDeliveryThreshold: 100,
  paymentInstructions: 'Bank transfer details will be sent with your order confirmation.',
  terms: 'Orders are subject to availability and confirmation by our store team.',
  privacy: 'We use customer information only to process orders and provide support.',
};

function stored<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

const LEGACY_PLACEHOLDER_PREFIX = 'https://placehold.co/600x600/121212/00ffcc';
const CURRENT_PLACEHOLDER_PREFIX = 'https://placehold.co/600x600/1A2525/C2C7AC';

function migrateProductImage(image: string) {
  return image.startsWith(LEGACY_PLACEHOLDER_PREFIX)
    ? image.replace(LEGACY_PLACEHOLDER_PREFIX, CURRENT_PLACEHOLDER_PREFIX)
    : image;
}

function migrateProduct(product: Product): Product {
  return {
    ...product,
    image: migrateProductImage(product.image),
    images: product.images?.map(migrateProductImage),
  };
}

function migrateCartItems(items: CartItem[]): CartItem[] {
  return items.map((item) => ({ ...item, product: migrateProduct(item.product) }));
}

function migrateOrders(items: Order[]): Order[] {
  return items.map((order) => ({ ...order, items: migrateCartItems(order.items) }));
}

interface ShopContextType {
  products: Product[];
  categories: string[];
  cart: CartItem[];
  savedForLater: Product[];
  wishlist: string[];
  orders: Order[];
  customers: Customer[];
  coupons: Coupon[];
  banners: Banner[];
  settings: StoreSettings;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  moveToSaved: (productId: string) => void;
  moveToCart: (productId: string) => void;
  removeSaved: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  createOrder: (shippingDetails: Record<string, string>) => Order;
  getCartTotal: () => number;
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, stock: number) => void;
  addCategory: (name: string) => void;
  updateCategory: (oldName: string, newName: string) => void;
  deleteCategory: (name: string) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'uses'>) => void;
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  updateSettings: (updates: Partial<StoreSettings>) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => stored<Product[]>('gg_products', MOCK_PRODUCTS).map(migrateProduct));
  const [categories, setCategories] = useState<string[]>(() => stored('gg_categories', defaultCategories));
  const [cart, setCart] = useState<CartItem[]>(() => migrateCartItems(stored('gg_cart', [])));
  const [savedForLater, setSavedForLater] = useState<Product[]>(() => stored<Product[]>('gg_saved', []).map(migrateProduct));
  const [wishlist, setWishlist] = useState<string[]>(() => stored('gg_wishlist', []));
  const [orders, setOrders] = useState<Order[]>(() => migrateOrders(stored('gg_orders', [])));
  const [customers, setCustomers] = useState<Customer[]>(() => stored('gg_customers', defaultCustomers));
  const [coupons, setCoupons] = useState<Coupon[]>(() => stored('gg_coupons', []));
  const [banners, setBanners] = useState<Banner[]>(() => stored('gg_banners', []));
  const [settings, setSettings] = useState<StoreSettings>(() => stored('gg_settings', defaultSettings));

  useEffect(() => {
    localStorage.setItem('gg_products', JSON.stringify(products));
    localStorage.setItem('gg_categories', JSON.stringify(categories));
    localStorage.setItem('gg_cart', JSON.stringify(cart));
    localStorage.setItem('gg_saved', JSON.stringify(savedForLater));
    localStorage.setItem('gg_wishlist', JSON.stringify(wishlist));
    localStorage.setItem('gg_orders', JSON.stringify(orders));
    localStorage.setItem('gg_customers', JSON.stringify(customers));
    localStorage.setItem('gg_coupons', JSON.stringify(coupons));
    localStorage.setItem('gg_banners', JSON.stringify(banners));
    localStorage.setItem('gg_settings', JSON.stringify(settings));
  }, [products, categories, cart, savedForLater, wishlist, orders, customers, coupons, banners, settings]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      return existing
        ? prev.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
        : [...prev, { product, quantity }];
    });
  };
  const removeFromCart = (productId: string) => setCart((prev) => prev.filter((item) => item.product.id !== productId));
  const updateQuantity = (productId: string, quantity: number) => quantity <= 0
    ? removeFromCart(productId)
    : setCart((prev) => prev.map((item) => item.product.id === productId ? { ...item, quantity } : item));
  const clearCart = () => setCart([]);
  const moveToSaved = (productId: string) => {
    const item = cart.find((candidate) => candidate.product.id === productId);
    if (!item) return;
    removeFromCart(productId);
    setSavedForLater((prev) => prev.some((product) => product.id === productId) ? prev : [...prev, item.product]);
  };
  const moveToCart = (productId: string) => {
    const product = savedForLater.find((candidate) => candidate.id === productId);
    if (!product) return;
    setSavedForLater((prev) => prev.filter((candidate) => candidate.id !== productId));
    addToCart(product);
  };
  const removeSaved = (productId: string) => setSavedForLater((prev) => prev.filter((product) => product.id !== productId));
  const toggleWishlist = (productId: string) => setWishlist((prev) => prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]);
  const isInWishlist = (productId: string) => wishlist.includes(productId);
  const getCartTotal = () => cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const createOrder = (shippingDetails: Record<string, string>) => {
    const order: Order = {
      id: `ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      date: new Date().toISOString(),
      items: [...cart],
      total: getCartTotal(),
      status: 'Pending',
      customerName: [shippingDetails.fname, shippingDetails.lname].filter(Boolean).join(' ') || 'Guest Customer',
      customerEmail: shippingDetails.email,
      shippingDetails,
    };
    setOrders((prev) => [order, ...prev]);
    if (shippingDetails.email && !customers.some((customer) => customer.email === shippingDetails.email)) {
      setCustomers((prev) => [...prev, {
        id: `cus-${Date.now()}`,
        name: order.customerName || 'Guest Customer',
        email: shippingDetails.email,
        phone: shippingDetails.phone || '',
        joined: new Date().toISOString().slice(0, 10),
        status: 'Active',
        addresses: [shippingDetails.address || ''],
        supportRequests: 0,
      }]);
    }
    clearCart();
    return order;
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const created = { ...product, id: `prod-${Date.now()}` };
    setProducts((prev) => [created, ...prev]);
    return created;
  };
  const updateProduct = (id: string, updates: Partial<Product>) => setProducts((prev) => prev.map((product) => product.id === id ? { ...product, ...updates } : product));
  const deleteProduct = (id: string) => setProducts((prev) => prev.filter((product) => product.id !== id));
  const updateStock = (id: string, stock: number) => updateProduct(id, { stock: Math.max(0, stock) });
  const addCategory = (name: string) => setCategories((prev) => prev.includes(name) ? prev : [...prev, name]);
  const updateCategory = (oldName: string, newName: string) => {
    setCategories((prev) => prev.map((category) => category === oldName ? newName : category));
    setProducts((prev) => prev.map((product) => product.category === oldName ? { ...product, category: newName } : product));
  };
  const deleteCategory = (name: string) => setCategories((prev) => prev.filter((category) => category !== name));
  const updateOrderStatus = (id: string, status: OrderStatus) => setOrders((prev) => prev.map((order) => order.id === id ? { ...order, status } : order));
  const updateCustomer = (id: string, updates: Partial<Customer>) => setCustomers((prev) => prev.map((customer) => customer.id === id ? { ...customer, ...updates } : customer));
  const addCoupon = (coupon: Omit<Coupon, 'id' | 'uses'>) => setCoupons((prev) => [{ ...coupon, id: `coupon-${Date.now()}`, uses: 0 }, ...prev]);
  const addBanner = (banner: Omit<Banner, 'id'>) => setBanners((prev) => [{ ...banner, id: `banner-${Date.now()}` }, ...prev]);
  const updateSettings = (updates: Partial<StoreSettings>) => setSettings((prev) => ({ ...prev, ...updates }));

  return (
    <ShopContext.Provider value={{
      products, categories, cart, savedForLater, wishlist, orders, customers, coupons, banners, settings,
      addToCart, removeFromCart, updateQuantity, clearCart, moveToSaved, moveToCart, removeSaved,
      toggleWishlist, isInWishlist, createOrder, getCartTotal, addProduct, updateProduct, deleteProduct,
      updateStock, addCategory, updateCategory, deleteCategory, updateOrderStatus, updateCustomer,
      addCoupon, addBanner, updateSettings,
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
}