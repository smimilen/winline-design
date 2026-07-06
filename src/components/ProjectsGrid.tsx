import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import imgA from '../assets/projects/card-a-lockerroom.webp'
import imgB from '../assets/projects/card-b-luckyday.webp'
import imgC from '../assets/projects/card-c-dragon.webp'
import imgD from '../assets/projects/card-d-ronaldinho.webp'
import imgE from '../assets/projects/card-e-gear.webp'
import imgF from '../assets/projects/card-f-esports.webp'
import imgG from '../assets/projects/card-g-trophy.webp'

gsap.registerPlugin(ScrollTrigger)

type Project = {
  id: string
  title: string
  tag: string
  image: string
  ratio: string // aspect-ratio, чтобы сетка не прыгала при загрузке
}

// Порядок и пропорции соответствуют макету
const COL_1: Project[] = [
  { id: 'a', title: 'Раздевалка', tag: 'Игровое приложение', image: imgA, ratio: '1193 / 1656' },
  { id: 'b', title: 'Счастливый день', tag: 'Мини-игра', image: imgB, ratio: '1192 / 1884' },
]
const COL_2: Project[] = [
  { id: 'c', title: 'Игровой арт', tag: 'Иллюстрация', image: imgC, ratio: '1194 / 1056' },
  { id: 'd', title: 'Рональдиньо', tag: 'Коллекционные карточки', image: imgD, ratio: '1194 / 1726' },
  { id: 'e', title: 'Экипировка', tag: 'Стикеры и айтемы', image: imgE, ratio: '1194 / 714' },
]
const COL_3: Project[] = [
  { id: 'f', title: 'Киберспорт', tag: 'Беттинг-интерфейс', image: imgF, ratio: '1193 / 1656' },
  { id: 'g', title: 'Кубок', tag: '3D и кампании', image: imgG, ratio: '1192 / 1884' },
]

function Card({ p }: { p: Project }) {
  return (
    <a
      href="#top"
      data-card
      className="project-card block w-full"
      style={{ aspectRatio: p.ratio }}
      aria-label={`${p.title} — ${p.tag}`}
    >
      <img
        src={p.image}
        alt={`${p.title} — ${p.tag}`}
        loading="lazy"
        className="card-media w-full h-full object-cover"
      />
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

    // Появление в духе shopify.design: карточки мягко «всплывают»
    // со сдвигом, лёгким масштабом и ступенчатой задержкой по колонкам
    const tweens = cards.map((card, i) =>
      gsap.fromTo(
        card,
        { y: 90, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: 'power3.out',
          delay: (i % 3) * 0.1,
          clearProps: 'transform,opacity', // иначе инлайновый transform GSAP перебивает :hover
          scrollTrigger: {
            trigger: card,
            start: 'top 92%',
            toggleActions: 'play none none none',
          },
        },
      ),
    )

    // Лёгкий параллакс: средняя колонка едет чуть медленнее остальных
    const cols = gsap.utils.toArray<HTMLElement>('[data-col]', grid)
    const parallax = cols.map((col, i) =>
      gsap.fromTo(
        col,
        { y: 0 },
        {
          y: i === 1 ? -46 : -12,
          ease: 'none',
          scrollTrigger: {
            trigger: grid,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        },
      ),
    )

    // Фирменный эффект shopify.design: «желейный» скос карточек
    // пропорционально скорости скролла с пружинистым возвратом
    const clampSkew = gsap.utils.clamp(-5, 5)
    const proxy = { skew: 0 }
    const skewSetters = cols.map((col) => gsap.quickSetter(col, 'skewY', 'deg'))
    const applySkew = () => skewSetters.forEach((set) => set(proxy.skew))

    const velocityST = ScrollTrigger.create({
      trigger: grid,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const skew = clampSkew(self.getVelocity() / -350)
        if (Math.abs(skew) > Math.abs(proxy.skew)) {
          proxy.skew = skew
          gsap.to(proxy, {
            skew: 0,
            duration: 0.9,
            ease: 'power3.out',
            overwrite: true,
            onUpdate: applySkew,
          })
        }
      },
    })

    return () => {
      velocityST.kill()
      ;[...tweens, ...parallax].forEach((t) => {
        t.scrollTrigger?.kill()
        t.kill()
      })
    }
  }, [])

  return (
    <section className="bg-bg-deep py-8 md:py-14 overflow-hidden">
      <div ref={gridRef} className="max-w-[1440px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 items-start">
          <div data-col className="flex flex-col gap-5 md:gap-6">
            {COL_1.map((p) => <Card key={p.id} p={p} />)}
          </div>
          <div data-col className="flex flex-col gap-5 md:gap-6">
            {COL_2.map((p) => <Card key={p.id} p={p} />)}
          </div>
          <div data-col className="flex flex-col gap-5 md:gap-6">
            {COL_3.map((p) => <Card key={p.id} p={p} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
