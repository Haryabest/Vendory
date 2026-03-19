import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Clock, ArrowRight } from 'lucide-react';

export function DealsBlock() {
  const deals = [
    {
      id: 1,
      title: 'Скидки до 70%',
      subtitle: 'На электронику',
      gradient: 'from-orange-500 to-red-600',
      deadline: '2 дня',
    },
    {
      id: 2,
      title: '2 по цене 1',
      subtitle: 'На одежду',
      gradient: 'from-purple-500 to-pink-600',
      deadline: '5 дней',
    },
    {
      id: 3,
      title: 'Бесплатная доставка',
      subtitle: 'От 5000 ₽',
      gradient: 'from-green-500 to-emerald-600',
      deadline: 'Неделя',
    },
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Акции и предложения</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <div
              key={deal.id}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${deal.gradient} p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group`}
            >
              <div className="absolute top-4 right-4">
                <Badge className="bg-white/20 backdrop-blur-sm border-white/30">
                  <Clock className="h-3 w-3 mr-1" />
                  {deal.deadline}
                </Badge>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-2">{deal.title}</h3>
                <p className="text-white/80 text-lg mb-6">{deal.subtitle}</p>
                <Button className="bg-white text-gray-900 hover:bg-white/90 group-hover:scale-105 transition-transform">
                  Подробнее
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              {/* Декоративные круги */}
              <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-white/10 rounded-full"></div>
              <div className="absolute -top-16 -left-16 w-40 h-40 bg-white/10 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
