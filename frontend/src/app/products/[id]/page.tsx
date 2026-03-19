'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { ArrowLeft, Package, User, Calendar, ShoppingCart, Heart, Share2, Star, CheckCircle, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from '@/shared/ui/loading-spinner';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  category_id?: string;
  seller_id: string;
  created_at: string;
  updated_at: string;
}

interface ProductImage {
  id: string;
  product_id: string;
  url: string;
}

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

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Получаем текущего пользователя
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    
    getCurrentUser();
    
    const loadProduct = async () => {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', params.id)
        .single();

      if (productError || !product) {
        setLoading(false);
        return;
      }

      setProduct(product);

      // Загружаем изображения и продавца параллельно
      const [productImagesResult, sellerResult] = await Promise.all([
        supabase
          .from('product_images')
          .select('*')
          .eq('product_id', product.id),
        supabase
          .from('sellers')
          .select('*')
          .eq('id', product.seller_id)
          .single()
      ]);

      if (productImagesResult.data) {
        setImages(productImagesResult.data);
      }

      if (sellerResult.data && !sellerResult.error) {
        setSeller(sellerResult.data);
      }

      setLoading(false);
      
      // Увеличиваем счетчик просмотров асинхронно (не блокируем загрузку)
      supabase
        .from('products')
        .update({ views_count: ((product.views_count || 0) + 1) })
        .eq('id', product.id);
    };

    loadProduct();
  }, [params.id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Товар не найден</h2>
            <Link href="/catalog">
              <Button variant="primary">Вернуться в каталог</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Изображения */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                {images.length > 0 ? (
                  <div className="aspect-square rounded-lg bg-gray-100 overflow-hidden mb-4">
                    <Image
                      src={images[selectedImage]?.url || '/placeholder.png'}
                      alt={product.title}
                      width={600}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                    <Package className="h-24 w-24 text-gray-400" />
                  </div>
                )}

                {/* Миниатюры */}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((img, index) => (
                      <button
                        key={img.id}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === index ? 'border-purple-600' : 'border-transparent'
                        }`}
                      >
                        <Image
                          src={img.url || '/placeholder.png'}
                          alt={`Фото ${index + 1}`}
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Информация о товаре */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">{product.title}</CardTitle>
                    <CardDescription>
                      Добавлено {new Date(product.created_at).toLocaleDateString('ru-RU')}
                    </CardDescription>
                  </div>
                  <Badge variant={product.status === 'ACTIVE' ? 'success' : 'secondary'} className="text-sm">
                    {product.status === 'ACTIVE' ? 'В наличии' : 'Нет в наличии'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Цена */}
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-purple-600">
                    {product.price.toLocaleString('ru-RU')} ₽
                  </span>
                  {product.stock > 0 && (
                    <span className="text-sm text-gray-500">
                      Осталось: {product.stock} шт.
                    </span>
                  )}
                </div>

                {/* Описание */}
                <div>
                  <h3 className="font-semibold mb-2">Описание</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
                </div>

                {/* Просмотры и избранное */}
                <div className="flex items-center gap-6 py-3 border-y">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                      <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Просмотры</p>
                      <p className="text-lg font-semibold">{product.views_count || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                      <Heart className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">В избранном</p>
                      <p className="text-lg font-semibold">{product.favorites_count || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Продавец */}
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Продавец</h3>
                  {seller ? (
                    <Link href={`/profile/${seller.id}`}>
                      <div className="flex items-center gap-3 hover:bg-gray-50 p-3 rounded-lg transition-colors cursor-pointer border border-gray-200">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-bold text-lg border-2 border-purple-200">
                          {seller.rating >= 4.5 ? '✓' : 'S'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">
                              {seller?.username || `Продавец #${seller?.id.slice(0, 8)}`}
                            </span>
                            {seller?.is_verified && (
                              <Badge variant="success" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Проверен
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-medium">{seller?.rating?.toFixed(1) || '0.0'}</span>
                              <span className="text-gray-400">({seller?.reviews_count || 0} отзывов)</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Package className="h-4 w-4 text-purple-600" />
                              <span>{seller?.total_sales || 0} продаж</span>
                            </span>
                          </div>
                        </div>
                        <ArrowLeft className="h-5 w-5 text-gray-400 rotate-180" />
                      </div>
                    </Link>
                  ) : (
                    <div className="text-gray-500 text-sm py-4">
                      Информация о продавце загружается...
                    </div>
                  )}
                </div>

                {/* Кнопки действий */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button variant="primary" size="lg" className="flex-1" disabled={product.stock === 0}>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {product.stock === 0 ? 'Нет в наличии' : 'Купить'}
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>

                {/* Чат с продавцом */}
                {currentUser && seller && (
                  <div className="pt-4 border-t">
                    <Link href={`/chat?seller=${seller.id}&product=${product.id}`}>
                      <Button variant="outline" className="w-full">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Написать продавцу
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Дополнительная информация */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">ID товара</span>
                  <span className="font-mono">{product.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Дата публикации</span>
                  <span>{new Date(product.created_at).toLocaleDateString('ru-RU')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Обновлено</span>
                  <span>{new Date(product.updated_at).toLocaleDateString('ru-RU')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
