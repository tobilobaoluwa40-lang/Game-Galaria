import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, MOCK_PRODUCTS } from '@/lib/data';

interface CartItem {
  product: Product;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

interface ShopContextType {
  cart: CartItem[];
  savedForLater: Product[];
  wishlist: string[]; // product IDs
  orders: Order[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  moveToSaved: (productId: string) => void;
  moveToCart: (productId: string) => void;
  removeSaved: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  createOrder: (shippingDetails: any) => Order;
  getCartTotal: () => number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [savedForLater, setSavedForLater] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('gg_cart');
      const savedWishlist = localStorage.getItem('gg_wishlist');
      const savedOrders = localStorage.getItem('gg_orders');
      const savedLater = localStorage.getItem('gg_saved');
      
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      if (savedLater) setSavedForLater(JSON.parse(savedLater));
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('gg_cart', JSON.stringify(cart));
    localStorage.setItem('gg_wishlist', JSON.stringify(wishlist));
    localStorage.setItem('gg_orders', JSON.stringify(orders));
    localStorage.setItem('gg_saved', JSON.stringify(savedForLater));
  }, [cart, wishlist, orders, savedForLater]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const moveToSaved = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    if (item) {
      removeFromCart(productId);
      if (!savedForLater.some((p) => p.id === productId)) {
        setSavedForLater((prev) => [...prev, item.product]);
      }
    }
  };

  const moveToCart = (productId: string) => {
    const product = savedForLater.find((p) => p.id === productId);
    if (product) {
      setSavedForLater((prev) => prev.filter((p) => p.id !== productId));
      addToCart(product, 1);
    }
  };

  const removeSaved = (productId: string) => {
    setSavedForLater((prev) => prev.filter((p) => p.id !== productId));
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const createOrder = (shippingDetails: any) => {
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      date: new Date().toISOString(),
      items: [...cart],
      total: getCartTotal(),
      status: 'Pending',
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        savedForLater,
        wishlist,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        moveToSaved,
        moveToCart,
        removeSaved,
        toggleWishlist,
        isInWishlist,
        createOrder,
        getCartTotal,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
