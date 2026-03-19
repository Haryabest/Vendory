import { HeroBanner } from '@/widgets/hero-banner/ui/hero-banner';
import { CategoriesBlock } from '@/widgets/categories-block/ui/categories-block';
import { DealsBlock } from '@/widgets/deals-block/ui/deals-block';
import { ProductsBlock } from '@/widgets/products-block/ui/products-block';
import { Product } from '@/entities/product/model/types';

// Демо-данные для товаров
const newProducts: Product[] = [
  {
    id: '1',
    title: 'Беспроводные наушники Pro',
    description: 'Качественный звук с активным шумоподавлением',
    price: 12990,
    status: 'ACTIVE',
    stock: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Смарт-часы Series 5',
    description: 'Фитнес-трекер, уведомления, NFC',
    price: 24990,
    status: 'ACTIVE',
    stock: 30,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Портативная колонка',
    description: 'Мощный звук до 20 часов работы',
    price: 7990,
    status: 'ACTIVE',
    stock: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Умная лампа RGB',
    description: 'Управление со смартфона, 16 млн цветов',
    price: 1490,
    status: 'ACTIVE',
    stock: 200,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const popularProducts: Product[] = [
  {
    id: '5',
    title: 'Ноутбук UltraBook Pro 15',
    description: 'Мощный и легкий ноутбук для работы',
    price: 89990,
    status: 'ACTIVE',
    stock: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Игровая консоль PlayBox',
    description: '4K gaming, 1TB SSD, 2 контроллера',
    price: 49990,
    status: 'ACTIVE',
    stock: 25,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    title: 'Кофемашина Barista',
    description: 'Автоматическая, капучинатор в комплекте',
    price: 34990,
    status: 'ACTIVE',
    stock: 40,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    title: 'Робот-пылесос CleanBot',
    description: 'Сухая и влажная уборка, карта помещения',
    price: 19990,
    status: 'ACTIVE',
    stock: 60,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroBanner />
        <CategoriesBlock />
        <DealsBlock />
        <ProductsBlock
          title="Новые товары"
          products={newProducts}
          viewAllLink="/catalog?sort=new"
        />
        <ProductsBlock
          title="Популярные товары"
          products={popularProducts}
          viewAllLink="/catalog?sort=popular"
        />
      </main>
    </div>
  )
}
