'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
  User,
  LogOut,
  Settings,
  ShoppingBag,
  Wallet,
  ChevronRight,
  Package,
  MessageCircle,
  PlusCircle,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/popover';
import Image from 'next/image';

interface UserMenuProps {
  userEmail: string;
  userBalance?: number;
  avatarUrl?: string;
}

export function UserMenu({ userEmail, userBalance = 0, avatarUrl }: UserMenuProps) {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUsername(user.user_metadata?.username || '');
        setUserId(user.id);
      }
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const menuItems = [
    {
      label: 'Профиль',
      icon: User,
      href: `/profile/${userId}`,
    },
    {
      label: 'Сообщения',
      icon: MessageCircle,
      href: '/chat',
    },
    {
      label: 'Мои заказы',
      icon: ShoppingBag,
      href: '/orders',
    },
    {
      label: 'Мои объявления',
      icon: Package,
      href: '/products/my',
    },
    {
      label: 'Настройки',
      icon: Settings,
      href: '/settings',
    },
  ];

  const displayName = username || userEmail.split('@')[0];
  const userInitial = (displayName || userEmail)[0].toUpperCase();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 hover:bg-purple-50 h-10 px-2"
        >
          {avatarUrl ? (
            <div className="h-8 w-8 rounded-full overflow-hidden">
              <Image
                src={avatarUrl}
                alt={displayName}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 font-semibold text-sm">
              {userInitial}
            </div>
          )}
          <div className="hidden lg:flex flex-col items-start">
            <span className="text-sm font-medium max-w-24 truncate">{displayName}</span>
            <span className="text-xs text-purple-600 font-semibold">
              {userBalance.toLocaleString('ru-RU')} ₽
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400 hidden lg:block" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-72 p-0" align="end">
        <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-purple-100">
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <div className="h-12 w-12 rounded-full overflow-hidden">
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-200 text-purple-700 font-bold text-lg">
                {userInitial}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{displayName}</p>
              <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              <div className="flex items-center gap-1 text-sm text-purple-600 mt-1">
                <Wallet className="h-4 w-4" />
                <span className="font-medium">{userBalance.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="py-2">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-purple-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              <item.icon className="h-4 w-4 text-gray-500" />
              <span className="flex-1">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </a>
          ))}
        </div>
        
        <div className="border-t p-2">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <a href="/wallet/deposit">
              <Button variant="outline" size="sm" className="w-full text-sm">
                <Wallet className="h-4 w-4 mr-1" />
                Пополнить
              </Button>
            </a>
            <a href="/wallet/withdraw">
              <Button variant="outline" size="sm" className="w-full text-sm">
                <Package className="h-4 w-4 mr-1" />
                Вывести
              </Button>
            </a>
          </div>
          
          <a href="/products/create">
            <Button variant="primary" size="sm" className="w-full mb-2">
              <PlusCircle className="h-4 w-4 mr-1" />
              Добавить товар
            </Button>
          </a>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Выйти
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
