import type { ImgHTMLAttributes } from 'react';
import type { Product } from '@/lib/data';
import { getProductImageFallback } from '@/lib/data';

type ProductImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
  product: Pick<Product, 'id' | 'category' | 'image' | 'name'>;
};

export function ProductImage({ product, ...props }: ProductImageProps) {
  const fallback = getProductImageFallback(product);

  return (
    <img
      {...props}
      src={product.image}
      alt={product.name}
      onError={(event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = fallback;
      }}
    />
  );
}