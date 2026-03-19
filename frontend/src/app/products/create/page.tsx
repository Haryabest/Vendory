'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import {
  ArrowLeft,
  ImageIcon,
  Package,
  Tag,
  FileText,
  ShoppingCart,
  Zap,
  MessageSquare,
  Check,
  X,
} from 'lucide-react';
import Link from 'next/link';

export default function CreateProductPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '1',
    categoryId: '',
    isDigital: false,
    autoDelivery: false,
    digitalContent: '',
    postPurchaseMessage: '',
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push('/auth/signin?redirect=/products/create');
      } else {
        setIsAuthenticated(true);
      }
    };
    
    checkAuth();
    
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('product_categories')
        .select('*')
        .order('name');
      
      if (data) {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.getUser();
      
      if (error || !data?.user) {
        throw new Error('Пожалуйста, войдите в аккаунт');
      }

      const user = data.user;

      // Получаем или создаем продавца
      let { data: seller, error: sellerError } = await supabase
        .from('sellers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (sellerError && sellerError.code !== 'PGRST116') {
        throw sellerError;
      }

      if (!seller) {
        // Получаем данные пользователя
        const username = user.user_metadata?.username || '';
        const avatar_url = user.user_metadata?.avatar_url || '';
        
        const { data: newSeller, error: createSellerError } = await supabase
          .from('sellers')
          .insert({ 
            user_id: user.id,
            username,
            avatar_url,
          })
          .select()
          .single();
        
        if (createSellerError) throw createSellerError;
        seller = newSeller;
      }

      // Создаем товар
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          seller_id: seller.id,
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          category_id: formData.categoryId || null,
          status: 'ACTIVE',
        })
        .select()
        .single();

      if (productError) throw productError;
      if (!product) throw new Error('Не удалось создать товар');

      // Если есть цифровой контент для автовыдачи
      if (formData.isDigital && formData.autoDelivery && formData.digitalContent) {
        const { error: itemError } = await supabase
          .from('product_items')
          .insert({
            product_id: product.id,
            content: formData.digitalContent,
            is_sold: false,
          });

        if (itemError) throw itemError;
      }

      setMessage({ type: 'success', text: 'Товар успешно создан!' });
      
      // Перенаправление через 2 секунды
      setTimeout(() => {
        router.push('/products/my');
      }, 2000);

    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {!isAuthenticated ? (
        <div className="container mx-auto px-4 max-w-4xl flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-500">Проверка авторизации...</p>
        </div>
      ) : (
        <div className="container mx-auto px-4 max-w-4xl">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Добавить товар</h1>
              <p className="text-gray-500 text-sm">Заполните информацию о товаре</p>
            </div>
          </div>
          <Badge variant="primary">Черновик</Badge>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <Check className="h-5 w-5" />
            ) : (
              <X className="h-5 w-5" />
            )}
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Основная информация */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Основная информация
                </CardTitle>
                <CardDescription>
                  Название и описание товара
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Название *</label>
                  <Input
                    placeholder="Например: iPhone 15 Pro 256GB"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Описание *</label>
                  <textarea
                    className="flex min-h-[150px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                    placeholder="Подробно опишите товар: характеристики, преимущества, комплектацию..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Хорошее описание помогает увеличить продажи
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Цена и категория */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Цена и категория
                </CardTitle>
                <CardDescription>
                  Стоимость и категория товара
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Цена (₽) *</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Количество *</label>
                  <Input
                    type="number"
                    placeholder="1"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    min="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Категория
                  </label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Цифровой товар */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Цифровой товар
                </CardTitle>
                <CardDescription>
                  Настройки автовыдачи
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isDigital}
                      onChange={(e) => setFormData({ ...formData, isDigital: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <span className="text-sm font-medium">Это цифровой товар</span>
                  </label>
                  <p className="text-xs text-gray-500">
                    Ключи, коды, подписки и другие цифровые товары
                  </p>
                </div>

                {formData.isDigital && (
                  <>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.autoDelivery}
                          onChange={(e) => setFormData({ ...formData, autoDelivery: e.target.checked })}
                          className="h-4 w-4"
                        />
                        <span className="text-sm font-medium">Автоматическая выдача</span>
                      </label>
                      <p className="text-xs text-gray-500">
                        Товар будет отправлен покупателю сразу после оплаты
                      </p>
                    </div>

                    {formData.autoDelivery && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Содержимое для выдачи *</label>
                        <textarea
                          className="flex min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                          placeholder="Введите ключ, код или ссылку для выдачи"
                          value={formData.digitalContent}
                          onChange={(e) => setFormData({ ...formData, digitalContent: e.target.value })}
                          required={formData.autoDelivery}
                        />
                        <p className="text-xs text-gray-500">
                          Этот контент получит покупатель после оплаты
                        </p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Сообщение после покупки */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Сообщение после покупки
                </CardTitle>
                <CardDescription>
                  Текст, который получит покупатель после оплаты
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <textarea
                  className="flex min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  placeholder="Спасибо за покупку! Если у вас возникнут вопросы, свяжитесь с нами..."
                  value={formData.postPurchaseMessage}
                  onChange={(e) => setFormData({ ...formData, postPurchaseMessage: e.target.value })}
                />
                <p className="text-xs text-gray-500">
                  Необязательно. Оставьте пустым, чтобы использовать сообщение по умолчанию
                </p>
              </CardContent>
            </Card>

            {/* Фотографии */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Фотографии
                </CardTitle>
                <CardDescription>
                  Добавьте фотографии товара
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-1">
                    Перетащите фото сюда или нажмите для загрузки
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG до 10MB (максимум 5 фото)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Кнопки действий */}
          <div className="flex justify-end gap-4 mt-6">
            <Link href="/profile">
              <Button type="button" variant="outline">
                Отмена
              </Button>
            </Link>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Публикация...' : 'Опубликовать товар'}
            </Button>
          </div>
        </form>
        </div>
      )}
    </div>
  );
}
