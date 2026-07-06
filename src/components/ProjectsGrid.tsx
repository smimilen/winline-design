import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Project = {
  id: string
  title: string
  tag: string
  tone: string // плейсхолдер-заливка, потом заменится на превью
  h: string // высота карточки на десктопе
}

// Данные карточек: поменяйте title/tag и добавьте поле image,
// когда будут готовы реальные превью проектов
const COL_1: Project[] = [
  { id: 'a', title: 'Проект 01', tag: 'Мобильное приложение', tone: '#94959a', h: 'md:h-[560px]' },
  { id: 'b', title: 'Проект 02', tag: 'Веб-платформа', tone: '#8a8b90', h: 'md:h-[620px]' },
]
const COL_2: Project[] = [
  { id: 'c', title: 'Проект 03', tag: 'Брендинг', tone: '#9a9b9f', h: 'md:h-[350px]' },
  { id: 'd', title: 'Проект 04', tag: 'Продуктовый дизайн', tone: '#8f9094', h: 'md:h-[480px]' },
  { id: 'e', title: 'Проект 05', tag: 'Кампания', tone: '#96979b', h: 'md:h-[220px]' },
]
const COL_3: Project[] = [
  { id: 'f', title: 'Проект 06', tag: 'Интерфейс', tone: '#8c8d92', h: 'md:h-[540px]' },
  { id: 'g', title: 'Проект 07', tag: 'Моушен', tone: '#98999d', h: 'md:h-[640px]' },
]

function Card({ p }: { p: Project }) {
  return (
    <a
      href="#top"
      data-card
      className={`project-card block h-[420px] ${p.h}`}
      aria-label={`${p.title} — ${p.tag}`}
    >
      <div className="card-media" style={{ background: p.tone }} />
      <div className="card-overlay" aria-hidden="true" />
      <div className="card-meta">
        <div>
          <p className="text-accent text-[11px] uppercase tracking-[0.2em] mb-1">{p.tag}</p>
          <p className="font-din font-bold italic uppercase text-fg text-2xl">{p.title}</p>
        </div>
        <span className="bg-accent text-bg-deep w-10 h-10 rounded-full flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M2 11L11 2M11 2H4M11 2V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </a>
  )
}

export default function ProjectsGrid() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const cards = gsap.utils.toArray<HTMLElement>('[data-card]', grid)
    const tweens = cards.map((card, i) =>
      gsap.fromTo(
        card,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          delay: (i % 3) * 0.08,
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        },
      ),
    )
    return () => tweens.forEach((t) => {
      t.scrollTrigger?.kill()
      t.kill()
    })
  }, [])

  return (
    <section className="bg-bg-deep py-6 md:py-10">
      <div ref={gridRef} className="max-w-[1440px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 items-start">
          <div className="flex flex-col gap-5 md:gap-6">
            {COL_1.map((p) => <Card key={p.id} p={p} />)}
          </div>
          <div className="flex flex-col gap-5 md:gap-6">
            {COL_2.map((p) => <Card key={p.id} p={p} />)}
          </div>
          <div className="flex flex-col gap-5 md:gap-6">
            {COL_3.map((p) => <Card key={p.id} p={p} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
