'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { User, Mail, Wallet, ShoppingBag, Star, Calendar, MessageCircle, Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from '@/shared/ui/loading-spinner';

interface Seller {
  id: string;
  user_id: string;
  username?: string;
  avatar_url?: string;
  rating: number;
  reviews_count: number;
  total_sales: number;
  is_verified: boolean;
  created_at: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  views_count?: number;
  favorites_count?: number;
  created_at: string;
}

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProfile = async () => {
      // Загружаем продавца
      const { data: sellerData } = await supabase
        .from('sellers')
        .select('*')
        .eq('id', params.id)
        .single();

      if (sellerData) {
        setSeller(sellerData);

        // Загружаем товары продавца
        const { data: productsData } = await supabase
          .from('products')
          .select('*')
          .eq('seller_id', sellerData.id)
          .eq('status', 'ACTIVE')
          .order('created_at', { ascending: false });

        if (productsData) {
          setProducts(productsData);
        }
      }

      setLoading(false);
    };

    loadProfile();
  }, [params.id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Профиль не найден</h2>
            <Link href="/catalog">
              <Button variant="primary">Вернуться в каталог</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const memberSince = new Date(seller.created_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Навигация */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
        </div>

        {/* Заголовок профиля */}
        <Card className="mb-6 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-purple-500 to-purple-700"></div>
          <CardContent className="p-6 -mt-16">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              {/* Аватарка */}
              <div className="relative">
                {seller?.avatar_url ? (
                  <Image
                    src={seller.avatar_url}
                    alt={seller?.username || 'User'}
                    width={128}
                    height={128}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-purple-200 flex items-center justify-center text-purple-600 text-5xl font-bold">
                    {(seller?.username || 'U')[0].toUpperCase()}
                  </div>
                )}
              </div>

              {/* Информация */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">
                  {seller?.username || `Продавец #${seller?.id.slice(0, 8)}`}
                </h1>
                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                  {seller.is_verified && (
                    <Badge variant="success">
                      <User className="h-3 w-3 mr-1" />
                      Проверенный продавец
                    </Badge>
                  )}
                  <Badge variant="secondary">
                    <Calendar className="h-3 w-3 mr-1" />
                    С {memberSince}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <ShoppingBag className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{products.length}</p>
              <p className="text-sm text-gray-500">Объявления</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{seller.rating?.toFixed(1) || '0.0'}</p>
              <p className="text-sm text-gray-500">Рейтинг</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{seller.total_sales || 0}</p>
              <p className="text-sm text-gray-500">Продаж</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{seller.reviews_count || 0}</p>
              <p className="text-sm text-gray-500">Отзывов</p>
            </CardContent>
          </Card>
        </div>

        {/* Объявления продавца */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Package className="h-6 w-6" />
              Товары продавца
            </h2>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.title}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-purple-600">
                            {product.price.toLocaleString('ru-RU')} ₽
                          </span>
                          <Badge variant={product.stock > 0 ? 'success' : 'secondary'} className="text-xs">
                            {product.stock > 0 ? `${product.stock} шт.` : 'Нет'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-2">
                          <span className="flex items-center gap-1">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {product.views_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {product.favorites_count || 0}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>У продавца пока нет товаров</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
