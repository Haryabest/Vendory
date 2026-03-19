'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { ArrowLeft, Star, Package, CheckCircle, MessageCircle, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from '@/shared/ui/loading-spinner';

interface Seller {
  id: string;
  user_id: string;
  rating: number;
  reviews_count: number;
  total_sales: number;
  is_verified: boolean;
  created_at: string;
}

interface UserData {
  id: string;
  username?: string;
  avatar_url?: string;
  email?: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  created_at: string;
}

export default function SellerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadSeller = async () => {
      // Загружаем продавца
      const { data: sellerData } = await supabase
        .from('sellers')
        .select('*')
        .eq('id', params.id)
        .single();

      if (sellerData) {
        setSeller(sellerData);

        // Загружаем данные пользователя
        const { data: userData } = await supabase
          .from('users')
          .select('id, username, avatar_url, email')
          .eq('id', sellerData.user_id)
          .single();

        if (userData) {
          setUserData(userData);
        }

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

    loadSeller();
  }, [params.id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!seller || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Продавец не найден</h2>
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

        {/* Профиль продавца */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Аватарка */}
              <div className="flex-shrink-0">
                {userData.avatar_url ? (
                  <Image
                    src={userData.avatar_url}
                    alt={userData.username || 'Продавец'}
                    width={128}
                    height={128}
                    className="w-32 h-32 rounded-full object-cover border-4 border-purple-200 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-5xl font-bold border-4 border-purple-200 shadow-lg">
                    {(userData.username || 'P')[0].toUpperCase()}
                  </div>
                )}
              </div>

              {/* Информация */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                  <h1 className="text-3xl font-bold">{userData.username || 'Продавец'}</h1>
                  {seller.is_verified && (
                    <Badge variant="success" className="text-sm">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Проверен
                    </Badge>
                  )}
                </div>
                <p className="text-gray-500 mb-4">
                  На площадке с {memberSince}
                </p>

                {/* Статистика */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Star className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                    <p className="text-2xl font-bold">{seller.rating.toFixed(1)}</p>
                    <p className="text-sm text-gray-500">Рейтинг</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Package className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                    <p className="text-2xl font-bold">{products.length}</p>
                    <p className="text-sm text-gray-500">Товаров</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
                    <p className="text-2xl font-bold">{seller.total_sales}</p>
                    <p className="text-sm text-gray-500">Продаж</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                    <p className="text-2xl font-bold">{seller.reviews_count}</p>
                    <p className="text-sm text-gray-500">Отзывов</p>
                  </div>
                </div>

                {/* Кнопки */}
                <div className="flex gap-3 justify-center md:justify-start">
                  <Button variant="primary">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Написать
                  </Button>
                  <Button variant="outline">
                    <Star className="h-4 w-4 mr-2" />
                    Оставить отзыв
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Товары продавца */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Package className="h-6 w-6" />
              Товары продавца
            </h2>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{product.title}</h3>
                        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-purple-600">
                            {product.price.toLocaleString('ru-RU')} ₽
                          </span>
                          <Badge variant={product.stock > 0 ? 'success' : 'secondary'} className="text-xs">
                            {product.stock > 0 ? `${product.stock} шт.` : 'Нет'}
                          </Badge>
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
