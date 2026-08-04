import { Link } from 'wouter';
import { Gamepad2, Twitter, Instagram, Youtube, Twitch } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Gamepad2 className="w-6 h-6 text-primary" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                GAME<span className="text-primary">GALARIA</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your ultimate destination for the latest games, top-tier consoles, and elite gaming gear. Upgrade your setup today.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Youtube className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitch className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Shop Categories</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/shop?category=Consoles" className="hover:text-primary transition-colors">Consoles & Hardware</Link></li>
              <li><Link href="/shop?category=Games" className="hover:text-primary transition-colors">Video Games</Link></li>
              <li><Link href="/shop?category=Accessories" className="hover:text-primary transition-colors">Accessories & Gadgets</Link></li>
              <li><Link href="/shop?category=Chairs" className="hover:text-primary transition-colors">Gaming Chairs</Link></li>
              <li><Link href="/shop?badge=Deal" className="hover:text-primary transition-colors">Hot Deals</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Customer Service</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/account" className="hover:text-primary transition-colors">My Account</Link></li>
              <li><Link href="/account?tab=orders" className="hover:text-primary transition-colors">Order Tracking</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Returns & Refunds</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">Subscribe to our newsletter for exclusive deals and new releases.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
              <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </form>
          </div>

        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Game Galaria. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground">Terms of Service</Link>
            <Link href="/admin" className="hover:text-primary">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
