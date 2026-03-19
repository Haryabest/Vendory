import { createClient } from '@/utils/supabase/server';
import { ProductCard } from '@/entities/product/ui/product-card';
import { Product } from '@/entities/product/model/types';
import Link from 'next/link';
import LoadingSpinner from '@/shared/ui/loading-spinner';

export default async function CatalogPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Ошибка загрузки товаров</p>
      </div>
    );
  }

  const typedProducts: Product[] = (products || []).map(p => ({
    ...p,
    imageUrl: undefined,
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Каталог товаров</h1>

          {typedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {typedProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <ProductCard product={product} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Товары пока не добавлены</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
