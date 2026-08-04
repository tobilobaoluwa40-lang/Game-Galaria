import { Link } from 'wouter';
import { ShoppingCart, Heart, User, Search, Menu, X, Gamepad2 } from 'lucide-react';
import { useState } from 'react';
import { useShop } from '@/context/shop-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/react';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart, wishlist } = useShop();
  const { isLoaded, isSignedIn, user } = useUser();

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'Consoles', href: '/shop?category=Consoles' },
    { label: 'Games', href: '/shop?category=Games' },
    { label: 'Accessories', href: '/shop?category=Accessories' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Gamepad2 className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">
              GAME<span className="text-primary">GALARIA</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search games, consoles..." 
              className="w-48 lg:w-64 h-9 bg-muted/30 border border-border rounded-full pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-muted/50 transition-all placeholder:text-muted-foreground"
            />
          </div>

          <Link href={isSignedIn ? '/account' : '/login'}>
            <Button variant="ghost" size="icon" className="relative">
              <User className="w-5 h-5" />
            </Button>
          </Link>

          {isLoaded && !isSignedIn && (
            <div className="hidden items-center gap-2 lg:flex">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Create account</Button>
              </Link>
            </div>
          )}

          {isLoaded && isSignedIn && (
            <Link href="/account" className="hidden max-w-28 truncate text-xs font-medium text-muted-foreground hover:text-primary lg:block">
              {user?.firstName || 'My account'}
            </Link>
          )}
          
          <Link href="/account?tab=wishlist">
            <Button variant="ghost" size="icon" className="relative hidden sm:flex">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground border-none">
                  {wishlist.length}
                </Badge>
              )}
            </Button>
          </Link>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground border-none">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </Link>

          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full h-10 bg-muted/30 border border-border rounded-lg pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link 
                key={link.label} 
                href={link.href} 
                className="px-4 py-3 text-sm font-medium hover:bg-muted/50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link href={isSignedIn ? '/account' : '/login'} onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">{isSignedIn ? 'My account' : 'Log in'}</Button>
              </Link>
              {!isSignedIn && (
                <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full">Create account</Button>
                </Link>
              )}
            </div>
            <Link 
              href="/admin"
              className="px-4 py-3 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors flex items-center justify-between"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
