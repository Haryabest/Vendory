import { Card, CardContent } from '@/shared/ui/card';
import { Smartphone, Shirt, Home, Dumbbell, BookOpen, Gamepad2 } from 'lucide-react';

const categories = [
  { id: '1', name: 'Электроника', icon: Smartphone, color: 'from-blue-500 to-blue-600' },
  { id: '2', name: 'Одежда', icon: Shirt, color: 'from-pink-500 to-pink-600' },
  { id: '3', name: 'Дом и сад', icon: Home, color: 'from-green-500 to-green-600' },
  { id: '4', name: 'Спорт', icon: Dumbbell, color: 'from-orange-500 to-orange-600' },
  { id: '5', name: 'Книги', icon: BookOpen, color: 'from-yellow-500 to-yellow-600' },
  { id: '6', name: 'Игры', icon: Gamepad2, color: 'from-purple-500 to-purple-600' },
];

export function CategoriesBlock() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Категории товаров</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-purple-100"
            >
              <CardContent className="p-6 flex flex-col items-center gap-3">
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="h-8 w-8" />
                </div>
                <span className="font-medium text-center text-sm">{category.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
