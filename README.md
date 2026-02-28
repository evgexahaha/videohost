# 🎬 VideoHost Client

Современный клиент для видеохостинга VideoHost, написанный на Vue.js 3.

## 🚀 Технологии

- **Vue 3** (Options API)
- **TypeScript**
- **Pinia** (State Management)
- **Vue Router** (Навигация)
- **Bootstrap 5** (UI Framework)
- **Axios** (HTTP Client)

## 📦 Установка

```bash
npm install
```

## 🏃 Запуск (локально)

```bash
npm run dev
```

Сайт будет доступен по адресу: http://localhost:5173

## 🔨 Сборка для production

```bash
npm run build
```

## 🌐 Демо

Сайт размещён на GitHub Pages: [https://evgexahaha.github.io/videohost/](https://evgexahaha.github.io/videohost/)

## ⚙️ Конфигурация

API URL настраивается в `src/config.ts`:

```typescript
export const config = {
  // Для хостинга
  apiBaseUrl: 'http://a1238201.xsph.ru',
  storageUrl: 'http://a1238201.xsph.ru/storage',
  
  // Для локальной разработки (раскомментируй):
  // apiBaseUrl: 'http://localhost:8000',
  // storageUrl: 'http://localhost:8000/storage',
}
```

## 📁 Структура проекта

```
videohost-client/
├── src/
│   ├── api/           # API функции
│   ├── components/    # Vue компоненты
│   ├── stores/        # Pinia stores
│   ├── router/        # Маршруты
│   ├── views/         # Страницы
│   ├── assets/        # Стили
│   └── config.ts      # Конфигурация
├── public/            # Статические файлы
└── dist/              # Production сборка
```

## 🎨 Функционал

- ✅ Регистрация / Вход / Выход
- ✅ Просмотр видео с плеером
- ✅ Загрузка видео (до 1GB)
- ✅ Лайки и комментарии
- ✅ Подписки на каналы
- ✅ Профиль пользователя с аватаром
- ✅ Редактирование профиля
- ✅ Поиск видео
- ✅ Тёмная/Светлая тема
- ✅ Просмотр лайкнеров видео
- ✅ Просмотр подписчиков канала

## 📝 Лицензия

MIT

---

**Создано с ❤️ для VideoHost**
