'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { User, Mail, Lock, Bell, Globe, Shield, Check, AlertCircle } from 'lucide-react';
import LoadingSpinner from '@/shared/ui/loading-spinner';

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Настройки профиля
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  // Настройки безопасности
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Настройки уведомлений
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  
  // Настройки языка
  const [language, setLanguage] = useState('ru');
  const [currency, setCurrency] = useState('RUB');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setUsername(user.user_metadata?.username || '');
        setAvatarUrl(user.user_metadata?.avatar_url || '');
      }
    };
    getUser();
  }, []);

  const handleUpdateProfile = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { username, avatar_url: avatarUrl },
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Профиль обновлен' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Пароли не совпадают' });
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Пароль должен быть не менее 6 символов' });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Пароль изменен' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        email: user.email,
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'На почту отправлено подтверждение' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          preferences: {
            language,
            currency,
            emailNotifications,
            orderNotifications,
          },
        },
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Настройки сохранены' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Настройки</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <Check className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            {message.text}
          </div>
        )}

        {/* Профиль */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Профиль
            </CardTitle>
            <CardDescription>
              Основная информация о вашем аккаунте
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Имя пользователя</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ваше имя"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">URL аватара</label>
              <Input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="flex gap-2">
                <Input
                  value={user.email}
                  disabled
                  className="flex-1"
                />
                <Button variant="outline" onClick={handleChangeEmail} disabled={loading}>
                  <Mail className="h-4 w-4 mr-2" />
                  Изменить
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Для изменения email свяжитесь с поддержкой
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleUpdateProfile} disabled={loading}>
              Сохранить изменения
            </Button>
          </CardFooter>
        </Card>

        {/* Безопасность */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Безопасность
            </CardTitle>
            <CardDescription>
              Управление паролем и доступом к аккаунту
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Текущий пароль</label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Новый пароль</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Подтверждение пароля</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleChangePassword} disabled={loading}>
              Изменить пароль
            </Button>
          </CardFooter>
        </Card>

        {/* Предпочтения */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Предпочтения
            </CardTitle>
            <CardDescription>
              Язык, валюта и уведомления
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Язык</label>
              <select
                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="ru">Русский</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Валюта</label>
              <select
                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="RUB">Рубли (₽)</option>
                <option value="USD">Доллары ($)</option>
                <option value="EUR">Евро (€)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Уведомления</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">Email уведомления</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={orderNotifications}
                    onChange={(e) => setOrderNotifications(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">Уведомления о заказах</span>
                </label>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSavePreferences} disabled={loading}>
              Сохранить настройки
            </Button>
          </CardFooter>
        </Card>

        {/* Информация об аккаунте */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Информация об аккаунте
            </CardTitle>
            <CardDescription>
              Детали вашего аккаунта
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">ID пользователя</span>
              <span className="text-sm font-mono">{user.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Дата регистрации</span>
              <span className="text-sm">
                {new Date(user.created_at).toLocaleDateString('ru-RU')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Статус</span>
              <Badge variant="success">Активен</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Роль</span>
              <Badge>{user.user_metadata?.role || 'Покупатель'}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
