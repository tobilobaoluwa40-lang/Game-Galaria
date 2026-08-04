import { Link } from 'wouter';
import { ShoppingCart, Heart, Star, Check } from 'lucide-react';
import { Product } from '@/lib/data';
import { useShop } from '@/context/shop-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/currency';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsAdding(true);
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added.`,
    });
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[10px] border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_16px_32px_hsl(180_17.5%_12.4%_/_0.35)]">
      
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {product.badge && (
          <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 font-semibold px-2.5 py-0.5 backdrop-blur-md">
            {product.badge}
          </Badge>
        )}
        {product.compareAtPrice && (
          <Badge variant="destructive" className="font-semibold px-2.5 py-0.5 shadow-sm">
            SALE
          </Badge>
        )}
      </div>

      <button 
        onClick={handleWishlist}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md border transition-all ${
          isInWishlist(product.id) 
            ? 'bg-primary/20 border-primary text-primary' 
            : 'bg-background/50 border-border text-muted-foreground hover:text-foreground hover:bg-background'
        }`}
      >
        <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
      </button>

      {/* Image */}
      <Link href={`/product/${product.id}`} className="aspect-square bg-muted/20 relative overflow-hidden flex items-center justify-center p-6">
        <img 
          src={product.image} 
          alt={product.name}
          className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
          <span>{product.brand}</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>{product.platform}</span>
        </div>

        <Link href={`/product/${product.id}`} className="block mb-2 flex-1">
          <h3 className="font-bold text-lg leading-tight line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-4">
          <Star className="w-4 h-4 fill-primary text-primary" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        <div className="flex items-end justify-between mt-auto">
          <div>
            {product.compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through block mb-0.5">
                {formatCurrency(product.compareAtPrice)}
              </span>
            )}
            <span className="text-xl font-bold font-mono text-primary">
              {formatCurrency(product.price)}
            </span>
          </div>

          <Button 
            size="icon" 
            variant={isAdding ? "secondary" : "default"}
            className={`rounded-full w-10 h-10 shadow-lg ${isAdding ? 'bg-primary/20 text-primary hover:bg-primary/20' : ''}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {isAdding ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
