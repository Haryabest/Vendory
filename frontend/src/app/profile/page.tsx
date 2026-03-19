'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { User, Mail, Wallet, ShoppingBag, Star, Calendar, MessageCircle, Edit2, Check, X, LogOut, Settings } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import Image from 'next/image';

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setUsername(user.user_metadata?.username || '');
        setAvatarUrl(user.user_metadata?.avatar_url || '');
        setIsOnline(true);
      }
      setLoading(false);
    };
    getUser();
  }, []);

  const handleSave = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { username, avatar_url: avatarUrl },
    });
    if (!error) {
      setEditing(false);
      setUser({ ...user, user_metadata: { ...user.user_metadata, username, avatar_url: avatarUrl } });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center">Не авторизован</div>;

  const memberSince = new Date(user.created_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
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
              {/* Аватарка */}
              <div className="relative">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={username || 'User'}
                    width={128}
                    height={128}
                    className="rounded-full border-4 border-white shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-purple-200 flex items-center justify-center text-purple-600 text-4xl font-bold">
                    {(username || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
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
                    <Input
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="URL аватарки"
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
              <p className="text-2xl font-bold">0</p>
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
              <p className="text-2xl font-bold">0 ₽</p>
              <p className="text-sm text-gray-500">Баланс</p>
            </CardContent>
          </Card>
        </div>

        {/* Действия */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href="/products/my">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold">Мои объявления</p>
                  <p className="text-sm text-gray-500">Управление товарами</p>
                </div>
              </CardContent>
            </Card>
          </a>
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
