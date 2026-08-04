import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { useShop } from '@/context/shop-context';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ArrowRight, Heart, BookmarkPlus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, NGN_DELIVERY_FEE, NGN_FREE_DELIVERY_THRESHOLD } from '@/lib/currency';

export default function Cart() {
  const { cart, savedForLater, updateQuantity, removeFromCart, getCartTotal, moveToSaved, moveToCart, removeSaved } = useShop();

  const total = getCartTotal();
  const shipping = total > NGN_FREE_DELIVERY_THRESHOLD ? 0 : NGN_DELIVERY_FEE;
  const tax = total * 0.08;
  const finalTotal = total + shipping + tax;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8 lg:py-12 bg-background">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>

          {cart.length === 0 ? (
            <div className="text-center py-20 border border-border border-dashed rounded-xl bg-card/30 mb-12">
              <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">Looks like you haven't added any gear to your cart yet.</p>
              <Link href="/shop">
                <Button size="lg" className="font-bold">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="p-6 border-b border-border bg-muted/10">
                    <h2 className="font-bold text-lg">Cart Items ({cart.length})</h2>
                  </div>
                  
                  <ul className="divide-y divide-border">
                    {cart.map((item) => (
                      <li key={item.product.id} className="p-6 flex flex-col sm:flex-row gap-6">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-muted/20 rounded-lg p-2 flex items-center justify-center border border-border">
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                        </div>
                        
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <div>
                              <Link href={`/product/${item.product.id}`} className="font-bold text-lg hover:text-primary transition-colors line-clamp-2">
                                {item.product.name}
                              </Link>
                              <span className="text-sm text-muted-foreground mt-1 block">{item.product.platform}</span>
                            </div>
                            <div className="text-right">
                                <div className="font-bold font-mono text-lg text-primary">{formatCurrency(item.product.price * item.quantity)}</div>
                              {item.quantity > 1 && (
                                 <div className="text-xs text-muted-foreground">{formatCurrency(item.product.price)} each</div>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-auto flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center border border-border rounded-lg bg-background h-10">
                              <button 
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="w-10 h-full flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors rounded-l-lg"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-10 h-full flex items-center justify-center font-bold font-mono text-sm border-x border-border">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="w-10 h-full flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors rounded-r-lg"
                                disabled={item.quantity >= item.product.stock}
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-muted-foreground hover:text-primary h-9"
                                onClick={() => moveToSaved(item.product.id)}
                              >
                                <BookmarkPlus className="w-4 h-4 mr-2" /> Save for Later
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-muted-foreground hover:text-destructive h-9"
                                onClick={() => removeFromCart(item.product.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-xl p-6 sticky top-24 shadow-lg">
                  <h2 className="font-bold text-lg mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-mono font-medium">{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Shipping</span>
                      <span className="font-mono font-medium">{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Tax</span>
                      <span className="font-mono font-medium">{formatCurrency(tax)}</span>
                    </div>
                  </div>
                  
                  <Separator className="mb-6" />
                  
                  <div className="flex justify-between items-end mb-8">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl font-mono text-primary">{formatCurrency(finalTotal)}</span>
                  </div>

                  <Link href="/checkout">
                    <Button size="lg" className="w-full h-14 text-lg font-bold">
                      Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="w-4 h-4" /> Secure checkout. SSL encrypted.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Saved for Later */}
          {savedForLater.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold tracking-tight mb-6">Saved for Later ({savedForLater.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {savedForLater.map((product) => (
                  <div key={product.id} className="bg-card border border-border rounded-xl p-4 flex flex-col">
                    <div className="aspect-square bg-muted/20 rounded-lg p-4 mb-4 flex items-center justify-center">
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                    </div>
                    <h3 className="font-bold line-clamp-2 mb-2">{product.name}</h3>
                    <div className="font-bold text-primary font-mono mb-4">{formatCurrency(product.price)}</div>
                    <div className="mt-auto flex gap-2">
                      <Button className="flex-1" onClick={() => moveToCart(product.id)}>
                        Add to Cart
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => removeSaved(product.id)}>
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { ShoppingCart, ShieldCheck } from 'lucide-react';