import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { useShop } from '@/context/shop-context';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import { ShieldCheck, Truck, CreditCard, Banknote, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Checkout() {
  const { cart, getCartTotal, createOrder } = useShop();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const total = getCartTotal();
  const shipping = total > 100 ? 0 : 15;
  const tax = total * 0.08;
  const finalTotal = total + shipping + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network delay
    setTimeout(() => {
      const order = createOrder({
        // form data would go here
      });
      setOrderId(order.id);
      setIsSuccess(true);
      setIsSubmitting(false);
    }, 1500);
  };

  if (cart.length === 0 && !isSuccess) {
    setLocation('/cart');
    return null;
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="max-w-md w-full bg-card border border-primary/30 rounded-2xl p-8 text-center shadow-[0_0_40px_rgba(0,255,204,0.1)] neon-box">
            <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-6">Your gear is getting ready to ship.</p>
            
            <div className="bg-muted/30 rounded-lg p-4 mb-8">
              <div className="text-sm text-muted-foreground mb-1">Order Reference</div>
              <div className="text-xl font-bold font-mono tracking-wider">{orderId}</div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button onClick={() => setLocation('/account?tab=orders')} className="w-full">
                Track Order
              </Button>
              <Button variant="outline" onClick={() => setLocation('/')} className="w-full">
                Return Home
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => setLocation('/cart')}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                
                {/* Contact */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="font-bold text-xl mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">1</span>
                    Contact Information
                  </h2>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="gamer@example.com" required className="bg-background" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" required className="bg-background" />
                    </div>
                  </div>
                </div>

                {/* Shipping */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="font-bold text-xl mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">2</span>
                    Shipping Address
                  </h2>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="fname">First Name</Label>
                        <Input id="fname" required className="bg-background" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="lname">Last Name</Label>
                        <Input id="lname" required className="bg-background" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input id="address" required className="bg-background" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" required className="bg-background" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="postal">Postal Code</Label>
                        <Input id="postal" required className="bg-background" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="font-bold text-xl mb-6 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">3</span>
                    Payment Method
                  </h2>
                  
                  <RadioGroup defaultValue="card" className="grid gap-4">
                    <div className="flex items-center space-x-2 border border-border p-4 rounded-lg bg-background has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 flex justify-between items-center cursor-pointer">
                        <span className="font-medium">Credit / Debit Card</span>
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                      </Label>
                    </div>
                    
                    {/* Fake Card inputs that show when selected */}
                    <div className="pl-8 pr-4 grid gap-4 mb-2">
                      <Input placeholder="Card Number" className="font-mono bg-background" />
                      <div className="grid grid-cols-2 gap-4">
                        <Input placeholder="MM/YY" className="font-mono bg-background" />
                        <Input placeholder="CVC" className="font-mono bg-background" />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 border border-border p-4 rounded-lg bg-background has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors">
                      <RadioGroupItem value="transfer" id="transfer" />
                      <Label htmlFor="transfer" className="flex-1 flex justify-between items-center cursor-pointer">
                        <span className="font-medium">Bank Transfer</span>
                        <Banknote className="w-5 h-5 text-muted-foreground" />
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 border border-border p-4 rounded-lg bg-background has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 flex justify-between items-center cursor-pointer">
                        <span className="font-medium">Cash on Delivery</span>
                        <Truck className="w-5 h-5 text-muted-foreground" />
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

              </form>
            </div>

            {/* Summary */}
            <div>
              <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                <h2 className="font-bold text-xl mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-muted/20 rounded-md p-1 border border-border shrink-0 flex items-center justify-center relative">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain" />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-muted rounded-full flex items-center justify-center text-xs font-bold border border-border">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm line-clamp-2">{item.product.name}</div>
                        <div className="text-muted-foreground text-xs mt-1">{item.product.platform}</div>
                      </div>
                      <div className="font-mono font-medium text-sm">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="mb-6" />

                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-mono">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-mono">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes</span>
                    <span className="font-mono">${tax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator className="mb-6" />

                <div className="flex justify-between items-end mb-8">
                  <span className="font-bold text-lg">Total</span>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground mb-1">USD</div>
                    <span className="font-bold text-3xl font-mono text-primary">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  form="checkout-form" 
                  type="submit" 
                  size="lg" 
                  className="w-full h-14 text-lg font-bold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Complete Purchase'}
                </Button>
                
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-primary" /> 
                  Encrypted & Secure Payment
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
