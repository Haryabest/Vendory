'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AuthConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const supabase = createClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const type = searchParams.get('type');
      const code = searchParams.get('code');

      if (type === 'email' && code) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          setStatus('success');
          
          // Перенаправление через 3 секунды
          setTimeout(() => {
            router.push('/');
          }, 3000);
        } catch {
          setStatus('error');
        }
      } else if (searchParams.get('error')) {
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, [searchParams, router, supabase.auth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
              <CardTitle>Подтверждение...</CardTitle>
              <CardDescription>Проверяем вашу ссылку</CardDescription>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Email подтверждён!</CardTitle>
              <CardDescription>
                Ваш аккаунт активирован. Перенаправляем на главную...
              </CardDescription>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <CardTitle>Ошибка подтверждения</CardTitle>
              <CardDescription>
                Ссылка недействительна или истекла
              </CardDescription>
            </>
          )}
        </CardHeader>
        
        <CardContent className="flex flex-col gap-3">
          {status === 'error' && (
            <>
              <Link href="/auth/signin" className="w-full">
                <Button variant="primary" className="w-full">
                  Войти заново
                </Button>
              </Link>
              <Link href="/auth/signup" className="w-full">
                <Button variant="outline" className="w-full">
                  Зарегистрироваться
                </Button>
              </Link>
            </>
          )}
          
          {status === 'success' && (
            <Link href="/" className="w-full">
              <Button variant="primary" className="w-full">
                Перейти на главную
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
