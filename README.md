# Winline Design — сайт

Одностраничный лендинг: hero-видео со скраббингом по скроллу, bento-сетка проектов, анимированные ленты WINLINE в футере.

**Стек:** Vite + React + TypeScript + Tailwind CSS v4 + GSAP ScrollTrigger

## Локальный запуск

```bash
npm install
npm run dev
```

## Деплой на GitHub Pages (один раз настроить)

1. Создай на GitHub новый репозиторий (любое имя, например `winline-design`)
2. В этой папке выполни:

```bash
git init
git add .
git commit -m "Winline Design site"
git branch -M main
git remote add origin https://github.com/ТВОЙ_ЛОГИН/ИМЯ_РЕПОЗИТОРИЯ.git
git push -u origin main
```

3. На GitHub открой **Settings → Pages → Source** и выбери **GitHub Actions**
4. Готово: при каждом пуше в `main` сайт автоматически собирается и публикуется на
   `https://ТВОЙ_ЛОГИН.github.io/ИМЯ_РЕПОЗИТОРИЯ/`

В `vite.config.ts` стоит `base: './'` (относительные пути) — сайт работает при любом имени репозитория без дополнительной настройки.

## Что где менять

| Что | Где |
|---|---|
| Карточки проектов (названия, теги, превью) | `src/components/ProjectsGrid.tsx` — массивы `COL_1/2/3`. Добавь поле `image` и подставь в `card-media` вместо заливки `tone` |
| Тексты hero и футера | `src/components/HeroVideo.tsx`, `src/components/Footer.tsx` |
| Цвета, радиусы, шрифты | `src/index.css`, блок `@theme` |
| Видео | `public/video/hero-video.mp4` (+ `.webm`). Для плавного скраббинга видео перекодировано с ключевым кадром на каждом фрейме (`ffmpeg -g 1`) — новое видео обрабатывай так же |
| Шрифт PF DIN | Положи `.woff2` в `public/fonts/` с именами `PFDinTextCompPro-Regular/Medium/Bold.woff2` — подхватятся автоматически. Пока их нет, работает фоллбэк на Onest |
| Ссылка на Telegram | `src/components/Footer.tsx` (сейчас заглушка `t.me/winlinedesign`) |

## Анимации

- **Hero:** секция 320vh, видео sticky, кадр привязан к прогрессу скролла (GSAP ScrollTrigger + сглаживание через ticker)
- **Карточки:** stagger fade-up при входе в viewport; на ховер — scale, зум превью, появление названия и стрелки
- **Футер:** две диагональные оранжевые ленты с бегущим словом WINLINE, скорость реагирует на скорость скролла
- Всё отключается при prefers-reduced-motion
