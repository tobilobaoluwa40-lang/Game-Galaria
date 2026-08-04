import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { useShop } from '@/context/shop-context';
import { useParams, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Check, Share2, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/currency';
import { resolveCatalogCategory, slugifyCategory } from '@/lib/catalog';
import { ProductImage } from '@/components/product-image';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { products, categories, addToCart, toggleWishlist, isInWishlist } = useShop();
  const product = products.find(p => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">The item you're looking for doesn't exist or has been removed.</p>
            <Link href="/shop">
              <Button>Back to Shop</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdding(true);
    toast({
      title: "Added to Cart",
      description: `${quantity}x ${product.name} added to your cart.`,
    });
    setTimeout(() => setIsAdding(false), 1000);
  };

  const isWished = isInWishlist(product.id);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8 lg:py-12">
        <div className="container mx-auto px-4">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <span>/</span>
            <Link href={`/shop/${resolveCatalogCategory(product.category, categories)?.slug || slugifyCategory(product.category)}`} className="hover:text-foreground transition-colors">{product.category}</Link>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-wxs">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl bg-card border border-border flex items-center justify-center p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <ProductImage
                  product={product}
                  className="w-full h-full object-contain relative z-10"
                />
                {product.badge && (
                  <Badge className="absolute top-4 left-4 z-20 bg-primary text-primary-foreground font-bold px-3 py-1">
                    {product.badge}
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`aspect-square rounded-[10px] border flex items-center justify-center p-4 cursor-pointer bg-card ${i === 1 ? 'border-primary shadow-[0_8px_20px_hsl(180_17.5%_12.4%_/_0.3)]' : 'border-border hover:border-primary/50'}`}>
                    <ProductImage product={product} className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-bold text-primary tracking-widest uppercase">{product.brand}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-border" />
                <span className="text-sm text-muted-foreground">{product.platform}</span>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-primary text-primary" />
                  <span className="font-bold">{product.rating}</span>
                </div>
                <button className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4">
                  Read {product.reviewCount} Reviews
                </button>
                <div className="flex items-center gap-2 text-sm">
                  {product.stock > 0 ? (
                    <span className="flex items-center text-primary font-medium"><Check className="w-4 h-4 mr-1" /> In Stock ({product.stock})</span>
                  ) : (
                    <span className="text-destructive font-medium">Out of Stock</span>
                  )}
                </div>
              </div>

              <div className="flex items-end gap-3 mb-8">
                <span className="text-4xl font-bold font-mono text-foreground">{formatCurrency(product.price)}</span>
                {product.compareAtPrice && (
                  <span className="text-xl text-muted-foreground line-through mb-1 font-mono">{formatCurrency(product.compareAtPrice)}</span>
                )}
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {product.description}
              </p>

              <Separator className="mb-8" />

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center border border-border rounded-lg bg-card w-full sm:w-auto h-14">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-full flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors rounded-l-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 h-full flex items-center justify-center font-bold font-mono text-lg border-x border-border">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-12 h-full flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors rounded-r-lg"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Button 
                  size="lg" 
                  className={`flex-1 h-14 text-lg font-bold shadow-[0_12px_28px_hsl(180_17.5%_12.4%_/_0.3)] ${isAdding ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  {isAdding ? (
                    <><Check className="w-5 h-5 mr-2" /> Added</>
                  ) : (
                    <><ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart</>
                  )}
                </Button>

                <Button 
                  size="icon" 
                  variant="outline" 
                  className={`h-14 w-14 shrink-0 border-border ${isWished ? 'border-primary text-primary bg-primary/10' : ''}`}
                  onClick={() => toggleWishlist(product.id)}
                >
                  <Heart className={`w-5 h-5 ${isWished ? 'fill-current' : ''}`} />
                </Button>
                
                <Button size="icon" variant="ghost" className="h-14 w-14 shrink-0 hidden sm:flex">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-card border border-border text-sm">
                <div className="flex flex-col items-center text-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                  <span className="font-medium">1 Year Warranty</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck className="w-6 h-6 text-primary" />
                  <span className="font-medium">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RotateCcw className="w-6 h-6 text-primary" />
                  <span className="font-medium">30-Day Returns</span>
                </div>
              </div>

            </div>
          </div>

          {/* Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="specs" className="w-full">
              <TabsList className="w-full justify-start border-b border-border bg-transparent rounded-none h-auto p-0 space-x-8">
                <TabsTrigger 
                  value="specs" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 font-bold text-base"
                >
                  Technical Specifications
                </TabsTrigger>
                <TabsTrigger 
                  value="description" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 font-bold text-base"
                >
                  Full Description
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-4 font-bold text-base"
                >
                  Reviews ({product.reviewCount})
                </TabsTrigger>
              </TabsList>
              
              <div className="py-8 bg-card rounded-b-xl border border-t-0 border-border p-6 mt-0">
                <TabsContent value="specs" className="mt-0 outline-none">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex flex-col py-3 border-b border-border/50">
                        <span className="text-sm text-muted-foreground font-medium mb-1">{key}</span>
                        <span className="font-semibold">{value}</span>
                      </div>
                    ))}
                    <div className="flex flex-col py-3 border-b border-border/50">
                      <span className="text-sm text-muted-foreground font-medium mb-1">SKU</span>
                      <span className="font-semibold font-mono">GG-{product.id}-{Math.floor(Math.random()*10000)}</span>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="description" className="mt-0 outline-none prose prose-invert max-w-none text-muted-foreground">
                  <p className="text-lg leading-relaxed">{product.description}</p>
                  <p className="mt-4">Designed for gamers who demand the best, this product integrates cutting-edge technology with premium build quality. Whether you're competing at the highest level or immersing yourself in a single-player epic, it delivers an uncompromising experience.</p>
                </TabsContent>

                <TabsContent value="reviews" className="mt-0 outline-none">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="text-5xl font-bold font-mono text-primary">{product.rating}</div>
                    <div>
                      <div className="flex mb-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-5 h-5 ${s <= Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-muted'}`} />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground">Based on {product.reviewCount} reviews</div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {/* Mock Reviews */}
                    {[1, 2, 3].map((r) => (
                      <div key={r} className="border-b border-border/50 pb-6 last:border-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-xs">
                              U{r}
                            </div>
                            <span className="font-semibold">Gamer{Math.floor(Math.random()*999)}</span>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-sm">Verified</span>
                          </div>
                          <span className="text-sm text-muted-foreground">2 weeks ago</span>
                        </div>
                        <div className="flex mb-3">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className="w-4 h-4 fill-primary text-primary" />
                          ))}
                        </div>
                        <p className="text-muted-foreground">Absolutely incredible product. Exceeded my expectations in every way. The build quality is top notch and performance is flawless. Would definitely recommend to anyone looking to upgrade their setup.</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
