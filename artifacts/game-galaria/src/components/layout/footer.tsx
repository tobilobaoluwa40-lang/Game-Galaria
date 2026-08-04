import { Link } from 'wouter';
import { Twitter, Instagram, Youtube, Twitch } from 'lucide-react';
import { CATALOG_CATEGORIES } from '@/lib/catalog';
import { StoreLogo } from '@/components/store-logo';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <StoreLogo className="max-h-10 max-w-56 object-contain" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Your ultimate destination for the latest games, top-tier consoles, and elite gaming gear. Upgrade your setup today.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="Game Galaria on X" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Game Galaria on Instagram" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="Game Galaria on YouTube" className="text-muted-foreground hover:text-primary transition-colors"><Youtube className="w-5 h-5" /></a>
              <a href="https://twitch.tv" target="_blank" rel="noreferrer" aria-label="Game Galaria on Twitch" className="text-muted-foreground hover:text-primary transition-colors"><Twitch className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Shop Categories</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-muted-foreground">
              {CATALOG_CATEGORIES.slice(0, 8).map((category) => (
                <li key={category.slug}><Link href={`/shop/${category.slug}`} className="transition-colors hover:text-primary">{category.label}</Link></li>
              ))}
            </ul>
            <Link href="/shop" className="mt-4 inline-block text-sm font-semibold text-primary transition-colors hover:text-foreground">View all products</Link>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Customer Service</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/account" className="hover:text-primary transition-colors">My Account</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Login</Link></li>
              <li><Link href="/register" className="hover:text-primary transition-colors">Create Account</Link></li>
              <li><Link href="/account?tab=orders" className="hover:text-primary transition-colors">Order Tracking</Link></li>
              <li><Link href="/shop" className="transition-colors hover:text-primary">Shipping Policy</Link></li>
              <li><Link href="/account?tab=orders" className="transition-colors hover:text-primary">Returns & Refunds</Link></li>
              <li><a href="mailto:support@gamegalaria.com" className="transition-colors hover:text-primary">Contact Us</a></li>
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
            <Link href="/account" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/account" className="hover:text-foreground">Terms of Service</Link>
            <Link href="/admin" className="hover:text-primary">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
