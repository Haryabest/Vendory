'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 px-4 py-12">
      <div className="text-center max-w-md">
        {/* Иллюстрация */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
            <Search className="h-16 w-16 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-16 h-16 bg-yellow-400 rounded-full opacity-60 blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-purple-300 rounded-full opacity-60 blur-xl"></div>
        </div>

        {/* Текст */}
        <h1 className="text-6xl font-bold text-purple-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Страница не найдена
        </h2>
        <p className="text-gray-600 mb-8">
          К сожалению, мы не смогли найти страницу, которую вы ищете. 
          Возможно, она была удалена или перемещена.
        </p>

        {/* Кнопки */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="primary" size="lg">
              <Home className="h-5 w-5 mr-2" />
              На главную
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Назад
          </Button>
        </div>

        {/* Дополнительные ссылки */}
        <div className="mt-12 pt-8 border-t border-purple-200">
          <p className="text-sm text-gray-500 mb-4">Или перейдите в один из разделов:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/catalog" className="text-purple-600 hover:text-purple-700 hover:underline text-sm">
              Каталог товаров
            </Link>
            <Link href="/auth/signin" className="text-purple-600 hover:text-purple-700 hover:underline text-sm">
              Войти
            </Link>
            <Link href="/auth/signup" className="text-purple-600 hover:text-purple-700 hover:underline text-sm">
              Регистрация
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
