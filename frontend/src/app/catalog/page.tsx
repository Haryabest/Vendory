import { createClient } from '@/utils/supabase/server';
import { ProductCard } from '@/entities/product/ui/product-card';
import { Header } from '@/widgets/header/ui/header';
import { Footer } from '@/widgets/footer/ui/footer';
import { Product } from '@/entities/product/model/types';

export default async function CatalogPage() {
  const supabase = await createClient();
  
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false });

  const typedProducts: Product[] = (products || []).map(p => ({
    ...p,
    imageUrl: undefined,
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8">Каталог товаров</h1>
          
          {typedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {typedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Товары пока не добавлены</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
