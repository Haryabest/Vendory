import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { ShoppingCart, Search, User, Menu, Heart, Bell, Package, PlusCircle, MessageCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { UserMenu } from '@/widgets/user-menu/ui/user-menu';
import MobileMenu from './mobile-menu';

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Логотип */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-700">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-xl font-bold hidden sm:inline-block">Vendory</span>
          </Link>

          {/* Поиск */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Поиск товаров..."
                className="pl-10 bg-gray-50 border-purple-100 focus:bg-white"
              />
            </div>
          </div>

          {/* Действия */}
          <div className="flex items-center gap-2">
            <Link href="/catalog">
              <Button variant="ghost" className="hidden lg:flex">
                <Package className="h-5 w-5 mr-2" />
                Каталог
              </Button>
            </Link>
            
            {user && (
              <>
                <Link href="/products/create">
                  <Button variant="primary" size="sm" className="hidden sm:flex">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Добавить товар
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button variant="ghost" size="icon" className="hidden sm:flex">
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                </Link>
              </>
            )}
            
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Bell className="h-5 w-5" />
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            
            {user ? (
              <UserMenu 
                userEmail={user.email || ''} 
                userBalance={0}
                avatarUrl={user.user_metadata?.avatar_url}
              />
            ) : (
              <Link href="/auth/signin">
                <Button variant="primary" size="default" className="hidden sm:flex">
                  <User className="h-4 w-4 mr-2" />
                  Войти
                </Button>
              </Link>
            )}
            
            <MobileMenuButton isAuthenticated={!!user} />
          </div>
        </div>
      </div>
    </header>
  );
}

async function MobileMenuButton({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <MobileMenu isAuthenticated={isAuthenticated} />
  );
}
