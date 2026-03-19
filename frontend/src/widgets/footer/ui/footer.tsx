import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* О компании */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-700">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <span className="text-xl font-bold text-white">Vendory</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Современный маркетплейс для покупок и продаж. Лучшие товары по отличным ценам.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Покупателям */}
          <div>
            <h4 className="text-white font-semibold mb-4">Покупателям</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/catalog" className="hover:text-white transition-colors">Каталог товаров</Link></li>
              <li><Link href="/deals" className="hover:text-white transition-colors">Акции и скидки</Link></li>
              <li><Link href="/delivery" className="hover:text-white transition-colors">Доставка</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Возврат</Link></li>
            </ul>
          </div>

          {/* Продавцам */}
          <div>
            <h4 className="text-white font-semibold mb-4">Продавцам</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/seller/start" className="hover:text-white transition-colors">Начать продажи</Link></li>
              <li><Link href="/seller/rules" className="hover:text-white transition-colors">Правила</Link></li>
              <li><Link href="/seller/tariffs" className="hover:text-white transition-colors">Тарифы</Link></li>
              <li><Link href="/seller/support" className="hover:text-white transition-colors">Поддержка</Link></li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="text-white font-semibold mb-4">Контакты</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>8 (800) 123-45-67</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@vendory.ru</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Москва, ул. Примерная, 10</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 Vendory. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
