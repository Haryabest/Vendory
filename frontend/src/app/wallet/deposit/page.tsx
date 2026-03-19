'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Wallet, Ruble, CreditCard, Smartphone } from 'lucide-react';

export default function DepositPage() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Не авторизован');

      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: parseFloat(amount),
          type: 'DEPOSIT',
          status: 'COMPLETED',
          reference_id: crypto.randomUUID(),
        });

      if (error) throw error;

      router.push('/profile');
    } catch (err: any) {
      alert('Ошибка: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [500, 1000, 2000, 5000];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Пополнение баланса</CardTitle>
          <CardDescription>
            Выберите сумму и способ оплаты
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Текущий баланс</p>
              <p className="text-2xl font-bold text-purple-600">0 ₽</p>
            </div>
          </div>

          <form onSubmit={handleDeposit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Сумма пополнения</label>
              <div className="relative">
                <Ruble className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="number"
                  placeholder="0"
                  className="pl-10 text-lg"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="100"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((val) => (
                <Button
                  key={val}
                  type="button"
                  variant="outline"
                  onClick={() => setAmount(val.toString())}
                  className="text-sm"
                >
                  {val} ₽
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Способ оплаты</label>
              <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant="outline" className="h-auto py-3">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Карта
                </Button>
                <Button type="button" variant="outline" className="h-auto py-3">
                  <Smartphone className="h-5 w-5 mr-2" />
                  SBP
                </Button>
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            onClick={handleDeposit}
            disabled={loading || !amount}
          >
            {loading ? 'Обработка...' : `Пополнить на ${amount || '0'} ₽`}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
