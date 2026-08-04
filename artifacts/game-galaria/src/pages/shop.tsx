import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/product-card';
import { Link, useLocation, useParams } from 'wouter';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Filter, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useShop } from '@/context/shop-context';
import { CATALOG_CATEGORIES, getCatalogCategory, getCategoryLabel, resolveCatalogCategory, slugifyCategory } from '@/lib/catalog';
import { formatCurrency } from '@/lib/currency';

const PAGE_SIZE = 8;

export default function Shop() {
  const { products, categories } = useShop();
  const [location, setLocation] = useLocation();
  const params = useParams<{ category?: string }>();
  const routeCategory = useMemo(() => resolveCatalogCategory(params.category, categories), [params.category, categories]);
  const [queryString, setQueryString] = useState(() => window.location.search);
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1_000_000]);
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const syncQueryString = () => setQueryString(window.location.search);
    window.addEventListener('popstate', syncQueryString);
    window.addEventListener('gg:navigation', syncQueryString);
    syncQueryString();
    return () => {
      window.removeEventListener('popstate', syncQueryString);
      window.removeEventListener('gg:navigation', syncQueryString);
    };
  }, [location]);

  const queryState = useMemo(() => {
    const searchParams = new URLSearchParams(queryString);
    const queryCategory = resolveCatalogCategory(searchParams.get('category'), categories);
    return {
      search: searchParams.get('q') || '',
      category: routeCategory || queryCategory,
    };
  }, [queryString, routeCategory, categories]);

  useEffect(() => {
    setSearch(queryState.search);
    setSelectedCategories(queryState.category ? [queryState.category.slug] : []);
    setPage(1);
  }, [queryState.search, queryState.category?.slug]);

  const toggleCategory = (categorySlug: string) => {
    const category = resolveCatalogCategory(categorySlug, categories);
    if (!category) return;
    if (routeCategory) {
      setLocation(`/shop/${category.slug}`);
      return;
    }
    const next = selectedCategories.includes(category.slug)
      ? selectedCategories.filter((slug) => slug !== category.slug)
      : [...selectedCategories, category.slug];
    setSelectedCategories(next);
    setPage(1);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];
    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((product) => `${product.name} ${product.brand} ${product.platform} ${product.category}`.toLowerCase().includes(query));
    }
    if (queryState.category) {
      result = result.filter(queryState.category.matches);
    } else if (selectedCategories.length > 0) {
      const categories = selectedCategories.map(getCatalogCategory).filter(Boolean);
      result = result.filter((product) => categories.some((category) => category?.matches(product)));
    }
    result = result.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1]);
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    if (sortBy === 'newest') result.sort((a, b) => Number(b.badge === 'New Arrival') - Number(a.badge === 'New Arrival'));
    return result;
  }, [products, search, queryState.category, selectedCategories, priceRange, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const visibleProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const title = queryState.category?.label || (search ? `Search results for “${search}”` : 'Shop All Gear');
  const description = queryState.category?.description || 'Browse the full Game Galaria catalog, organized for faster discovery.';
  const groupedProducts = useMemo(() => {
    const groups = new Map<string, typeof visibleProducts>();
    visibleProducts.forEach((product) => {
      const group = groups.get(product.category) || [];
      group.push(product);
      groups.set(product.category, group);
    });
    return Array.from(groups.entries());
  }, [visibleProducts]);
  const showGroupedOverview = !queryState.category && !search.trim() && selectedCategories.length === 0;

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1_000_000]);
    setSearch('');
    setPage(1);
    setLocation('/shop');
  };

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Categories</h3>
        <div className="space-y-3">
          {CATALOG_CATEGORIES.map((category) => (
            <div key={category.slug} className="flex items-center space-x-2">
              <Checkbox id={`cat-${category.slug}`} checked={selectedCategories.includes(category.slug)} onCheckedChange={() => toggleCategory(category.slug)} />
              <Label htmlFor={`cat-${category.slug}`} className="cursor-pointer text-sm font-medium leading-none">{category.label}</Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Price Range</h3>
        <Slider value={priceRange} max={1_000_000} step={10_000} onValueChange={setPriceRange} className="mb-6" />
        <div className="flex items-center justify-between font-mono text-sm text-muted-foreground">
          <span>{formatCurrency(priceRange[0])}</span><span>{formatCurrency(priceRange[1])}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8 lg:py-10">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <span>Catalog</span><span className="text-border">/</span><span>{queryState.category?.label || 'All products'}</span>
              </div>
              <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
              <p className="max-w-2xl text-muted-foreground">{description} Showing {filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'}.</p>
            </div>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild><Button variant="outline" className="md:hidden"><Filter className="mr-2 h-4 w-4" /> Filters</Button></SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]"><SheetHeader><SheetTitle>Catalog filters</SheetTitle></SheetHeader><div className="py-6"><FilterSidebar /></div></SheetContent>
              </Sheet>
              <select aria-label="Sort products" className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" value={sortBy} onChange={(event) => { setSortBy(event.target.value); setPage(1); }}>
                <option value="featured">Featured</option><option value="newest">Newest Arrivals</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-8 md:flex-row">
            <aside className="hidden w-64 shrink-0 md:block"><div className="sticky top-24"><FilterSidebar /></div></aside>
            <div className="min-w-0 flex-1">
              {(selectedCategories.length > 0 || search) && (
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  {selectedCategories.map((slug) => <Badge key={slug} variant="secondary" className="flex items-center gap-1 border-primary/20 bg-primary/10 px-3 py-1 text-primary">{getCategoryLabel(slug)}{!routeCategory && <button type="button" onClick={() => toggleCategory(slug)} aria-label={`Remove ${getCategoryLabel(slug)} filter`}><X className="ml-1 h-3 w-3" /></button>}</Badge>)}
                  {search && <Badge variant="secondary" className="flex items-center gap-1 border-primary/20 bg-primary/10 px-3 py-1 text-primary">Search: {search}</Badge>}
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs text-muted-foreground">Clear all</Button>
                </div>
              )}

              {visibleProducts.length > 0 ? (
                <>
                      {showGroupedOverview ? (
                        <div className="space-y-12">
                          {groupedProducts.map(([category, categoryProducts]) => (
                            <section key={category} aria-labelledby={`category-${slugifyCategory(category)}`}>
                              <div className="mb-5 flex items-end justify-between gap-4 border-b border-border pb-3">
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Category</p>
                                  <h2 id={`category-${slugifyCategory(category)}`} className="mt-1 text-2xl font-bold">{getCategoryLabel(category)}</h2>
                                </div>
                                <Link href={`/shop/${resolveCatalogCategory(category, categories)?.slug || slugifyCategory(category)}`} className="text-sm font-semibold text-primary hover:text-foreground">View category</Link>
                              </div>
                              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{categoryProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
                            </section>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
                      )}
                  {totalPages > 1 && (
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Product pagination">
                      <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((current) => current - 1)}><ChevronLeft className="mr-1 h-4 w-4" /> Previous</Button>
                      {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => <Button key={pageNumber} variant={pageNumber === page ? 'default' : 'outline'} size="sm" onClick={() => setPage(pageNumber)} aria-current={pageNumber === page ? 'page' : undefined}>{pageNumber}</Button>)}
                      <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)}>Next <ChevronRight className="ml-1 h-4 w-4" /></Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-card/30 py-20 text-center"><SlidersHorizontal className="mx-auto mb-4 h-12 w-12 text-muted-foreground" /><h3 className="mb-2 text-xl font-bold">No products found</h3><p className="mb-6 text-muted-foreground">Try another category, price range, or search term.</p><Button onClick={clearFilters}>Clear Filters</Button></div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}