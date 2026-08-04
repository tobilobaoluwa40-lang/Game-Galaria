import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Category } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import { useLocation } from 'wouter';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useShop } from '@/context/shop-context';
import { formatCurrency } from '@/lib/currency';

export default function Shop() {
  const { products } = useShop();
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const initialCategory = searchParams.get('category') as Category | null;
  const initialSearch = searchParams.get('q') || '';
  
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [priceRange, setPriceRange] = useState([0, 1_000_000]);
  const [sortBy, setSortBy] = useState('featured');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const categories = ['Consoles', 'Games', 'Controllers', 'Headsets', 'Keyboards', 'Chairs', 'Accessories', 'Gift Cards'];

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.brand.toLowerCase().includes(q)
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Simplified newest sort
        result.sort((a, b) => (b.badge === 'New Arrival' ? 1 : 0) - (a.badge === 'New Arrival' ? 1 : 0));
        break;
      default:
        // featured - keep original order roughly
        break;
    }

    return result;
  }, [products, search, selectedCategories, priceRange, sortBy]);

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold mb-4 text-lg">Categories</h3>
        <div className="space-y-3">
          {categories.map(category => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox 
                id={`cat-${category}`} 
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label htmlFor={`cat-${category}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4 text-lg">Price Range</h3>
         <Slider
           defaultValue={[0, 1_000_000]}
           max={1_000_000}
           step={10_000}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mb-6"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground font-mono">
           <span>{formatCurrency(priceRange[0])}</span>
           <span>{formatCurrency(priceRange[1])}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Shop All Gear</h1>
              <p className="text-muted-foreground">Showing {filteredProducts.length} products</p>
            </div>

            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <Filter className="w-4 h-4 mr-2" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="py-6">
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>

              <select 
                className="bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-64 shrink-0 hidden md:block">
              <div className="sticky top-24">
                <FilterSidebar />
              </div>
            </aside>

            <div className="flex-1">
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedCategories.map(cat => (
                    <Badge key={cat} variant="secondary" className="px-3 py-1 bg-primary/10 text-primary border-primary/20 flex items-center gap-1">
                      {cat}
                      <button onClick={() => toggleCategory(cat)} className="hover:text-primary-foreground hover:bg-primary rounded-full p-0.5 ml-1">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  <Button variant="ghost" size="sm" onClick={() => setSelectedCategories([])} className="text-xs h-7 text-muted-foreground">
                    Clear all
                  </Button>
                </div>
              )}

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border border-border border-dashed rounded-xl bg-card/30">
                  <SlidersHorizontal className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your filters or search query.</p>
                  <Button onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange([0, 1000]);
                    setSearch('');
                  }}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Needed to fix Badge undefined error in previous code block
import { Badge } from '@/components/ui/badge';
