'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Wallet, Banknote } from 'lucide-react';

export default function WithdrawPage() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [requisites, setRequisites] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Не авторизован');

      const { error } = await supabase
        .from('withdrawals')
        .insert({
          user_id: user.id,
          amount: parseFloat(amount),
          method: 'card',
          status: 'PENDING',
        });

      if (error) throw error;

      router.push('/profile');
    } catch (err: any) {
      alert('Ошибка: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Вывод средств</CardTitle>
          <CardDescription>
            Вывод на банковскую карту или счет
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Доступно для вывода</p>
              <p className="text-2xl font-bold text-purple-600">0 ₽</p>
            </div>
          </div>

          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Сумма вывода</label>
              <div className="relative">
                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
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

            <div>
              <label className="text-sm font-medium mb-2 block">Реквизиты</label>
              <Input
                placeholder="Номер карты или счета"
                value={requisites}
                onChange={(e) => setRequisites(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Минимальная сумма вывода: 100 ₽
              </p>
            </div>
          </form>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            onClick={handleWithdraw}
            disabled={loading || !amount || !requisites}
          >
            {loading ? 'Обработка...' : `Вывести ${amount || '0'} ₽`}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
