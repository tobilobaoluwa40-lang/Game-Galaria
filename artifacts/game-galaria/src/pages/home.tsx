import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { MOCK_PRODUCTS } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import { Gamepad2, Cpu, Headphones, Keyboard, MonitorPlay, ChevronRight, Zap, Badge } from 'lucide-react';

export default function Home() {
  const newArrivals = MOCK_PRODUCTS.filter(p => p.badge === 'New Arrival' || p.badge === 'Top Selling').slice(0, 4);
  const featured = MOCK_PRODUCTS.filter(p => p.badge === 'Featured' || p.badge === 'Deal').slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
          
          <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <Zap className="w-4 h-4" /> Next-Gen Hardware is Here
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                LEVEL UP YOUR <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">GAMING SETUP</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl">
                Discover the ultimate collection of consoles, high-performance PC parts, immersive games, and elite accessories at Game Galaria.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop">
                  <Button size="lg" className="h-12 px-8 text-base font-bold">
                    Shop Now <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/shop?category=Consoles">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base font-bold bg-background/50 backdrop-blur-md">
                    Explore Consoles
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Abstract background decorative elements */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
        </section>

        {/* Categories Section */}
        <section className="py-20 border-b border-border bg-card/30">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">Browse by Category</h2>
                <p className="text-muted-foreground">Find exactly what you need for your setup</p>
              </div>
              <Link href="/shop" className="hidden sm:flex items-center text-primary hover:text-primary/80 font-medium">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { name: 'Consoles', icon: Gamepad2, count: 24 },
                { name: 'Games', icon: MonitorPlay, count: 156 },
                { name: 'Accessories', icon: Keyboard, count: 89 },
                { name: 'Headsets', icon: Headphones, count: 42 },
                { name: 'PC Parts', icon: Cpu, count: 112 },
              ].map((category) => (
                <Link 
                  key={category.name} 
                  href={`/shop?category=${category.name}`}
                  className="group flex flex-col items-center justify-center p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:bg-primary/5"
                >
                  <category.icon className="w-10 h-10 mb-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="font-bold text-lg mb-1">{category.name}</span>
                  <span className="text-xs text-muted-foreground">{category.count} items</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">Trending Now</h2>
                <p className="text-muted-foreground">Top selling and most wanted gear</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Promo Banner */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="relative rounded-3xl overflow-hidden bg-card border border-border p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 neon-box">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
              <div className="relative z-10 max-w-xl">
                <Badge className="bg-primary text-primary-foreground mb-4">Limited Time Offer</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Get 20% Off All Next-Gen Titles</h2>
                <p className="text-muted-foreground mb-6">Level up your game library with massive discounts on blockbuster titles for PS5 and Xbox Series X.</p>
                <Link href="/shop?badge=Deal">
                  <Button size="lg" className="font-bold">Claim Deal</Button>
                </Link>
              </div>
              <div className="relative z-10 w-full md:w-auto">
                 <div className="w-full max-w-sm aspect-video bg-muted/20 rounded-xl border border-primary/20 flex items-center justify-center p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <MonitorPlay className="w-24 h-24 text-primary/50" />
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Just Added */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold tracking-tight mb-10">New Arrivals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
