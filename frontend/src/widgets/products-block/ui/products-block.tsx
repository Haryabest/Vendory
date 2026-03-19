import { ProductCard } from '@/entities/product/ui/product-card';
import { Product } from '@/entities/product/model/types';
import { Button } from '@/shared/ui/button';
import { ArrowRight, Flame } from 'lucide-react';

interface ProductsBlockProps {
  title: string;
  products: Product[];
  viewAllLink?: string;
}

export function ProductsBlock({ title, products, viewAllLink }: ProductsBlockProps) {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Flame className="h-5 w-5" />
            </div>
            <h2 className="text-3xl font-bold">{title}</h2>
          </div>
          {viewAllLink && (
            <Button variant="link" className="text-purple-600">
              Смотреть все
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Товары скоро появятся
          </div>
        )}
      </div>
    </section>
  );
}
