import { Link, useLocation } from 'wouter';
import { ShoppingCart, Heart, User, Search, Menu, X, Gamepad2, Moon, Sun, ChevronDown } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { useShop } from '@/context/shop-context';
import { useTheme } from '@/context/theme-context';
import { CATALOG_CATEGORIES } from '@/lib/catalog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/react';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { cart, wishlist } = useShop();
  const { theme, toggleTheme } = useTheme();
  const { isLoaded, isSignedIn, user } = useUser();
  const [, setLocation] = useLocation();

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearch(params.get('q') || '');
  }, []);

  const navLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'Consoles', href: '/shop/consoles' },
    { label: 'PlayStation', href: '/shop/playstation' },
    { label: 'Xbox', href: '/shop/xbox' },
    { label: 'Nintendo', href: '/shop/nintendo' },
    { label: 'Games', href: '/shop/video-games' },
    { label: 'Accessories', href: '/shop/accessories' },
  ];

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    setLocation(query ? `/shop?q=${encodeURIComponent(query)}` : '/shop');
    window.dispatchEvent(new Event('gg:navigation'));
    setIsMobileMenuOpen(false);
  };

  const themeLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex min-h-16 items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 items-center gap-4 lg:gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-2 group" aria-label="Game Galaria home">
            <div className="rounded-lg bg-primary/10 p-2 transition-colors group-hover:bg-primary/20">
              <Gamepad2 className="h-6 w-6 text-primary" />
            </div>
            <span className="hidden text-xl font-bold tracking-tight sm:block">
              GAME<span className="text-primary">GALARIA</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 xl:flex">
            {navLinks.slice(0, 2).map((link) => (
              <Link key={link.label} href={link.href} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground">
                {link.label}
              </Link>
            ))}
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                aria-expanded={isCategoryMenuOpen}
                onClick={() => setIsCategoryMenuOpen((open) => !open)}
              >
                Categories <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isCategoryMenuOpen && (
                <div className="absolute left-0 top-full mt-2 grid w-[420px] grid-cols-2 gap-1 rounded-[10px] border border-border bg-popover p-2 text-popover-foreground shadow-xl">
                  {CATALOG_CATEGORIES.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/shop/${category.slug}`}
                      onClick={() => setIsCategoryMenuOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted hover:text-primary"
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
          <form onSubmit={submitSearch} className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search products"
              placeholder="Search games, consoles..."
              className="h-9 w-40 rounded-[10px] border border-border bg-muted/30 pl-9 pr-3 text-sm transition-all placeholder:text-muted-foreground focus:bg-muted/50 focus:outline-none focus:ring-1 focus:ring-primary md:w-52 lg:w-64"
            />
          </form>

          <Button type="button" variant="ghost" size="icon" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Link href={isSignedIn ? '/account' : '/login'} aria-label={isSignedIn ? 'Open account' : 'Log in'}>
            <Button variant="ghost" size="icon" className="relative">
              <User className="h-5 w-5" />
            </Button>
          </Link>

          {isLoaded && !isSignedIn && (
            <div className="hidden items-center gap-2 lg:flex">
              <Link href="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
              <Link href="/register"><Button size="sm">Create account</Button></Link>
            </div>
          )}

          {isLoaded && isSignedIn && (
            <Link href="/account" className="hidden max-w-28 truncate text-xs font-medium text-muted-foreground hover:text-primary lg:block">
              {user?.firstName || 'My account'}
            </Link>
          )}

          <Link href="/account?tab=wishlist" aria-label="Wishlist">
            <Button variant="ghost" size="icon" className="relative hidden sm:flex">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center border-none bg-primary p-0 text-[10px] text-primary-foreground">{wishlist.length}</Badge>}
            </Button>
          </Link>

          <Link href="/cart" aria-label="Shopping cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center border-none bg-primary p-0 text-[10px] text-primary-foreground">{cartItemsCount}</Badge>}
            </Button>
          </Link>

          <Button type="button" variant="ghost" size="icon" className="xl:hidden" onClick={() => setIsMobileMenuOpen((open) => !open)} aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}>
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-border bg-background p-4 xl:hidden">
          <form onSubmit={submitSearch} className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search products" placeholder="Search products..." className="h-10 w-full rounded-lg border border-border bg-muted/30 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          </form>
          <div className="grid grid-cols-2 gap-1">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} onClick={() => setIsMobileMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                {link.label}
              </Link>
            ))}
            {CATALOG_CATEGORIES.filter((category) => !navLinks.some((link) => link.href.endsWith(`/${category.slug}`))).map((category) => (
              <Link key={category.slug} href={`/shop/${category.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                {category.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link href={isSignedIn ? '/account' : '/login'} onClick={() => setIsMobileMenuOpen(false)}><Button variant="outline" className="w-full">{isSignedIn ? 'My account' : 'Log in'}</Button></Link>
            {!isSignedIn && <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}><Button className="w-full">Create account</Button></Link>}
          </div>
        </div>
      )}
    </nav>
  );
}