# Vendory Marketplace

Современный маркетплейс на Next.js и Nest.js с Supabase.

## Структура проекта

```
Vendory/
├── frontend/     # Next.js приложение + Supabase
└── backend/      # Nest.js API + TypeORM + Supabase DB
```

## Настройка Supabase

1. **Выполни SQL в Supabase SQL Editor:**
   - Открой https://supabase.com/dashboard/project/svdovudqxchwvuymohoj
   - Перейди в **SQL Editor**
   - Вставь содержимое `backend/supabase-schema.sql`
   - Нажми **Run**

2. **Получи пароль от базы данных:**
   - Перейди в **Settings** → **Database**
   - Скопируй **Database password**
   - Вставь в `backend/.env` вместо `SUPABASE_DB_PASSWORD`

## Запуск

### Одновременный запуск (рекомендуется)

```bash
npm install:all    # Установка всех зависимостей
npm run dev        # Запуск фронтенда и бэкенда одновременно
```

### Раздельный запуск

**Backend:**
```bash
cd backend
npm install
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Порты

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Swagger API:** http://localhost:3001/api

## Технологии

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Supabase (Auth, Realtime)

### Backend
- Nest.js
- TypeORM
- PostgreSQL (Supabase)
- Swagger API

## Переменные окружения

### Backend (.env)
```
SUPABASE_URL=https://svdovudqxchwvuymohoj.supabase.co
SUPABASE_ANON_KEY=sb_publishable_jxFIZWf9joa2pP7uMBYyWA_YgcPjpiA
SUPABASE_DB_PASSWORD=your_password_here
DB_HOST=db.svdovudqxchwvuymohoj.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_DATABASE=postgres
```

### Frontend (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://svdovudqxchwvuymohoj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_jxFIZWf9joa2pP7uMBYyWA_YgcPjpiA
NEXT_PUBLIC_API_URL=http://localhost:3001
```
