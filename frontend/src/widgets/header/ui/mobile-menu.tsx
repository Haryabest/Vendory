'use client';

import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { User, Menu, Package, Heart, ShoppingCart, MessageCircle, PlusCircle } from 'lucide-react';
import { useState } from 'react';

export default function MobileMenu({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="sm:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-white border-b shadow-lg py-4 px-4 z-50">
          <nav className="flex flex-col gap-2">
            {isAuthenticated && (
              <>
                <Link href="/products/create" className="px-4 py-2 bg-purple-50 rounded-lg flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <PlusCircle className="h-4 w-4" />
                  Добавить товар
                </Link>
                <Link href="/chat" className="px-4 py-2 hover:bg-purple-50 rounded-lg flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <MessageCircle className="h-4 w-4" />
                  Чат
                </Link>
                <div className="border-t my-2"></div>
              </>
            )}
            
            <Link href="/catalog" className="px-4 py-2 hover:bg-purple-50 rounded-lg flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <Package className="h-4 w-4" />
              Каталог
            </Link>
            <Link href="/favorites" className="px-4 py-2 hover:bg-purple-50 rounded-lg flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <Heart className="h-4 w-4" />
              Избранное
            </Link>
            <Link href="/orders" className="px-4 py-2 hover:bg-purple-50 rounded-lg flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <ShoppingCart className="h-4 w-4" />
              Заказы
            </Link>
            <Link href={isAuthenticated ? "/profile" : "/auth/signin"} onClick={() => setIsOpen(false)}>
              <Button variant="primary" className="w-full mt-2">
                <User className="h-4 w-4 mr-2" />
                {isAuthenticated ? 'Профиль' : 'Войти'}
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
