import { Button } from '@/shared/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
            Новые поступления уже здесь!
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Открывайте лучшие товары <br />
            <span className="text-purple-200">по выгодным ценам</span>
          </h1>
          
          <p className="text-lg md:text-xl text-purple-100 mb-8 max-w-2xl">
            Тысячи товаров от проверенных продавцов. Быстрая доставка, гарантия качества и удобные способы оплаты.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button variant="default" size="lg" className="bg-white text-purple-700 hover:bg-purple-50">
              Смотреть каталог
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              Стать продавцом
            </Button>
          </div>
        </div>
      </div>

      {/* Декоративные элементы */}
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl"></div>
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-400/30 rounded-full blur-3xl"></div>
    </section>
  );
}
