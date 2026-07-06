import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ballImg from '../assets/ball.png'

import imgA from '../assets/projects/card-a-lockerroom.webp'
import imgB from '../assets/projects/card-b-luckyday.webp'
import imgC from '../assets/projects/card-c-dragon.webp'
import imgD from '../assets/projects/card-d-ronaldinho.webp'
import imgE from '../assets/projects/card-e-gear.webp'
import imgF from '../assets/projects/card-f-esports.webp'
import imgG from '../assets/projects/card-g-trophy.webp'

/*
  Режим «3D-пространство» в духе таблетки на shopify.design:
  по клику на мяч страница уходит в тёмный космос, где карточки
  проектов парят наклонной плоскостью в перспективе. Движение
  курсора вращает сцену, колесо — приближает/отдаляет.
*/

type SpaceCard = { img: string; x: number; y: number; z: number; w: number }

const LAYOUT: SpaceCard[] = [
  { img: imgA, x: -480, y: -190, z: 60,  w: 300 },
  { img: imgB, x: -440, y: 230,  z: 140, w: 280 },
  { img: imgC, x: -10,  y: -290, z: 100, w: 320 },
  { img: imgD, x: 15,   y: 40,   z: 190, w: 300 },
  { img: imgE, x: -5,   y: 330,  z: 40,  w: 340 },
  { img: imgF, x: 470,  y: -190, z: 120, w: 290 },
  { img: imgG, x: 455,  y: 215,  z: 70,  w: 280 },
]

export default function SpaceMode() {
  const [active, setActive] = useState(false)
  const sceneRef = useRef<HTMLDivElement>(null)
  const ballRef = useRef<HTMLDivElement>(null)

  const stop = useCallback(() => setActive(false), [])

  useEffect(() => {
    if (!active) return
    const scene = sceneRef.current
    if (!scene) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.innerWidth < 768
    const k = mobile ? 0.45 : 1 // масштаб раскладки под мобильные

    const cards = gsap.utils.toArray<HTMLElement>('[data-space-card]', scene)

    // Базовый наклон сцены — «плоскость в перспективе»
    const base = { rx: 42, rz: -8, scale: mobile ? 0.62 : 0.92 }
    gsap.set(scene, {
      rotationX: base.rx,
      rotationZ: base.rz,
      scale: base.scale,
      transformStyle: 'preserve-3d',
    })

    // Расставить карточки и мяч по позициям
    cards.forEach((el, i) => {
      const p = LAYOUT[i]
      gsap.set(el, { x: p.x * k, y: p.y * k, z: p.z * k, xPercent: -50, yPercent: -50 })
    })
    if (ballRef.current) {
      gsap.set(ballRef.current, { x: 320 * k, y: 380 * k, z: 260 * k, xPercent: -50, yPercent: -50 })
    }

    // Влёт: карточки поднимаются из глубины с разлётом
    const entry = gsap.from([...cards, ballRef.current], {
      z: '-=700',
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out',
      stagger: 0.07,
    })

    // Парение: каждая карточка мягко дышит по высоте (z) в своей фазе
    const floats = reduced
      ? []
      : [...cards.map((el, i) =>
          gsap.to(el, {
            z: `+=${26 * k}`,
            duration: 2.4 + (i % 4) * 0.5,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
            delay: i * 0.25,
          }),
        ),
        ballRef.current
          ? gsap.to(ballRef.current, {
              z: `+=${60 * k}`,
              rotationZ: 360,
              duration: 5,
              yoyo: true,
              repeat: -1,
              ease: 'sine.inOut',
            })
          : null,
      ].filter(Boolean) as gsap.core.Tween[]

    // Орбита за курсором/пальцем — с демпфированием
    const rxTo = gsap.quickTo(scene, 'rotationX', { duration: 0.9, ease: 'power2.out' })
    const rzTo = gsap.quickTo(scene, 'rotationZ', { duration: 0.9, ease: 'power2.out' })
    const ryTo = gsap.quickTo(scene, 'rotationY', { duration: 0.9, ease: 'power2.out' })

    const onMove = (cx: number, cy: number) => {
      const nx = cx / window.innerWidth - 0.5
      const ny = cy / window.innerHeight - 0.5
      rxTo(base.rx - ny * 18)
      rzTo(base.rz + nx * 12)
      ryTo(nx * 10)
    }
    const onMouse = (e: MouseEvent) => onMove(e.clientX, e.clientY)
    const onTouch = (e: TouchEvent) => onMove(e.touches[0].clientX, e.touches[0].clientY)

    // Зум колесом
    const zoom = { v: base.scale }
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      zoom.v = gsap.utils.clamp(0.45, 1.35, zoom.v - e.deltaY * 0.0008)
      gsap.to(scene, { scale: zoom.v, duration: 0.5, ease: 'power2.out', overwrite: 'auto' })
    }

    if (!reduced) {
      window.addEventListener('mousemove', onMouse)
      window.addEventListener('touchmove', onTouch, { passive: true })
    }
    window.addEventListener('wheel', onWheel, { passive: false })
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && stop()
    window.addEventListener('keydown', onKey)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      entry.kill()
      floats.forEach((t) => t.kill())
    }
  }, [active, stop])

  return (
    <>
      {/* Плавающий мяч-кнопка */}
      <button
        type="button"
        onClick={() => setActive(true)}
        aria-label="Включить 3D-режим"
        className={`ball-toggle fixed bottom-6 right-6 z-[60] w-16 h-16 md:w-20 md:h-20 rounded-full ${active ? 'opacity-0 pointer-events-none' : ''}`}
      >
        <img src={ballImg} alt="" className="w-full h-full" draggable={false} />
      </button>

      {active && (
        <div className="fixed inset-0 z-[70] bg-[#0b0c0f] overflow-hidden select-none">
          {/* Фоновое свечение пространства */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 55% at 50% 62%, rgba(255,106,19,0.10) 0%, rgba(255,106,19,0.03) 45%, transparent 70%)',
            }}
          />

          {/* Перспективная сцена */}
          <div className="absolute inset-0" style={{ perspective: '1300px' }}>
            <div
              ref={sceneRef}
              className="absolute left-1/2 top-1/2 w-0 h-0"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Плоскость-подложка с сеткой */}
              <div
                aria-hidden="true"
                className="absolute left-0 top-0 rounded-[40px]"
                style={{
                  width: 1500,
                  height: 1100,
                  transform: 'translate(-50%, -50%) translateZ(0px)',
                  background:
                    'repeating-linear-gradient(0deg, rgba(255,255,255,0.045) 0 1px, transparent 1px 90px), repeating-linear-gradient(90deg, rgba(255,255,255,0.045) 0 1px, transparent 1px 90px)',
                  maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 40%, transparent 75%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 40%, transparent 75%)',
                }}
              />
              {LAYOUT.map((p, i) => (
                <div
                  key={i}
                  data-space-card
                  className="absolute left-0 top-0 rounded-2xl overflow-hidden"
                  style={{
                    width: p.w,
                    boxShadow: '0 40px 90px -30px rgba(0,0,0,0.9)',
                    willChange: 'transform',
                  }}
                >
                  <img src={p.img} alt="" className="block w-full h-auto" draggable={false} />
                </div>
              ))}
              <div ref={ballRef} className="absolute left-0 top-0 w-[120px]" style={{ willChange: 'transform' }}>
                <img src={ballImg} alt="" className="w-full" draggable={false} />
              </div>
            </div>
          </div>

          <p className="absolute top-6 left-1/2 -translate-x-1/2 text-muted text-[11px] uppercase tracking-[0.3em] pointer-events-none">
            Двигай курсором · колесо — зум · Esc — выход
          </p>
          <button
            type="button"
            onClick={stop}
            aria-label="Выйти из 3D-режима"
            className="absolute top-5 right-5 z-10 w-11 h-11 rounded-full bg-accent text-bg-deep flex items-center justify-center hover:rotate-90 transition-transform duration-300"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}
