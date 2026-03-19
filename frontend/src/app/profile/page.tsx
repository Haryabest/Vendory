'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { User, Mail, Wallet, ShoppingBag, Star, Calendar, MessageCircle, Edit2, Check, X, LogOut, Settings, Package, Trash2 } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import Image from 'next/image';
import LoadingSpinner from '@/shared/ui/loading-spinner';
import Link from 'next/link';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  category_id?: string;
  views_count?: number;
  favorites_count?: number;
  created_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setUsername(user.user_metadata?.username || '');
        setAvatarUrl(user.user_metadata?.avatar_url || '');
        setIsOnline(true);
        
        // Загружаем товары пользователя
        await loadUserProducts(user.id);
        
        // Загружаем баланс
        await loadBalance(user.id);
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const loadUserProducts = async (userId: string) => {
    // Сначала получаем seller_id
    const { data: seller } = await supabase
      .from('sellers')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (seller) {
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', seller.id)
        .order('created_at', { ascending: false });

      if (products) {
        setProducts(products);
      }
    }
  };

  const loadBalance = async (userId: string) => {
    const { data: transactions } = await supabase
      .from('transactions')
      .select('amount, type')
      .eq('user_id', userId)
      .eq('status', 'COMPLETED');

    if (transactions) {
      const total = transactions.reduce((acc, t) => {
        if (t.type === 'DEPOSIT' || t.type === 'SALE') return acc + Number(t.amount);
        if (t.type === 'WITHDRAWAL' || t.type === 'PURCHASE') return acc - Number(t.amount);
        return acc;
      }, 0);
      setBalance(total);
    }
  };

  const handleSave = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { username, avatar_url: avatarUrl },
    });
    if (!error) {
      setEditing(false);
      setUser({ ...user, user_metadata: { ...user.user_metadata, username, avatar_url: avatarUrl } });
      
      // Обновляем данные продавца
      const { data: seller } = await supabase
        .from('sellers')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (seller) {
        await supabase
          .from('sellers')
          .update({ username, avatar_url: avatarUrl })
          .eq('id', seller.id);
      }
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (!error) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!user) return <div className="min-h-screen flex items-center justify-center">Не авторизован</div>;

  const memberSince = new Date(user.created_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Профиль</h1>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Выйти
          </Button>
        </div>

        {/* Карточка профиля */}
        <Card className="mb-6 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-purple-500 to-purple-700"></div>
          <CardContent className="p-6 -mt-16">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
              {/* Аватарка с загрузкой */}
              <div className="relative group">
                {avatarUrl ? (
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
                    <Image
                      src={avatarUrl}
                      alt={username || 'User'}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-purple-200 flex items-center justify-center text-purple-600 text-4xl font-bold overflow-hidden">
                    {(username || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <Edit2 className="h-6 w-6 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Загружаем файл в Supabase Storage
                        const fileExt = file.name.split('.').pop();
                        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
                        
                        const { data, error } = await supabase.storage
                          .from('avatars')
                          .upload(fileName, file);

                        if (data) {
                          const { data: { publicUrl } } = supabase.storage
                            .from('avatars')
                            .getPublicUrl(fileName);

                          setAvatarUrl(publicUrl);
                          
                          // Сохраняем в профиль
                          await supabase.auth.updateUser({
                            data: { avatar_url: publicUrl },
                          });
                          
                          setUser({ 
                            ...user, 
                            user_metadata: { ...user.user_metadata, avatar_url: publicUrl } 
                          });
                          
                          // Обновляем продавца
                          const { data: seller } = await supabase
                            .from('sellers')
                            .select('id')
                            .eq('user_id', user.id)
                            .single();
                          
                          if (seller) {
                            await supabase
                              .from('sellers')
                              .update({ avatar_url: publicUrl })
                              .eq('id', seller.id);
                          }
                        }
                      }
                    }}
                  />
                </label>
                {isOnline && (
                  <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              {/* Информация */}
              <div className="flex-1 text-center sm:text-left">
                {editing ? (
                  <div className="flex flex-col sm:flex-row gap-2 items-center">
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Ваше имя"
                      className="max-w-xs"
                    />
                    <div className="flex gap-2">
                      <Button size="icon" onClick={handleSave}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => setEditing(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <h2 className="text-2xl font-bold">{username || 'Аноним'}</h2>
                    <Button size="icon" variant="ghost" onClick={() => setEditing(true)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-2">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </p>
              </div>

              {/* Статус онлайн */}
              <Badge variant={isOnline ? 'success' : 'secondary'} className="hidden sm:flex">
                {isOnline ? 'Онлайн' : 'Офлайн'}
              </Badge>
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
              <p className="text-2xl font-bold">5.0</p>
              <p className="text-sm text-gray-500">Рейтинг</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-lg font-bold">{memberSince}</p>
              <p className="text-sm text-gray-500">Дата регистрации</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Wallet className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{balance.toLocaleString('ru-RU')} ₽</p>
              <p className="text-sm text-gray-500">Баланс</p>
            </CardContent>
          </Card>
        </div>

        {/* Объявления пользователя */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Package className="h-5 w-5" />
                Мои объявления
              </h2>
              <Link href="/products/create">
                <Button size="sm" variant="primary">
                  <Package className="h-4 w-4 mr-1" />
                  Добавить
                </Button>
              </Link>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg line-clamp-1">{product.title}</h3>
                      <Badge variant={product.status === 'ACTIVE' ? 'success' : 'secondary'}>
                        {product.status === 'ACTIVE' ? 'Активно' : 'Архив'}
                      </Badge>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl font-bold text-purple-600">{product.price.toLocaleString('ru-RU')} ₽</span>
                      <span className="text-sm text-gray-500">Остаток: {product.stock}</span>
                    </div>
                    {/* Статистика */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
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
                    <div className="flex gap-2 mt-3">
                      <Link href={`/products/${product.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          Просмотр
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>У вас пока нет объявлений</p>
                <Link href="/products/create">
                  <Button variant="primary" className="mt-2">
                    Добавить первое объявление
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Действия */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href="/chat">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">Сообщения</p>
                  <p className="text-sm text-gray-500">Чат с покупателями</p>
                </div>
              </CardContent>
            </Card>
          </a>
          <a href="/wallet/deposit">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <Wallet className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">Кошелёк</p>
                  <p className="text-sm text-gray-500">Пополнить баланс</p>
                </div>
              </CardContent>
            </Card>
          </a>
          <a href="/settings">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                  <Settings className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">Настройки</p>
                  <p className="text-sm text-gray-500">Пароль и уведомления</p>
                </div>
              </CardContent>
            </Card>
          </a>
        </div>
      </div>
    </div>
  );
}
