import { useCallback, useEffect, useRef, useState } from 'react'
import Matter from 'matter-js'
import ballImg from '../assets/ball.png'

/*
  Easter egg в духе shopify.design: плавающий мяч в углу,
  по клику карточки проектов «обрушиваются» с 2D-физикой —
  падают, сталкиваются, пружинят, и их можно таскать мышью/пальцем.
*/

type BodyEl = { body: Matter.Body; el: HTMLElement }

export default function PhysicsMode() {
  const [active, setActive] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  const stop = useCallback(() => {
    cleanupRef.current?.()
    cleanupRef.current = null
    setActive(false)
  }, [])

  useEffect(() => {
    if (!active) return
    const overlay = overlayRef.current
    if (!overlay) return

    const W = window.innerWidth
    const H = window.innerHeight

    const engine = Matter.Engine.create()
    engine.gravity.y = 1.15

    const wallOpts = { isStatic: true, restitution: 0.4 }
    const walls = [
      Matter.Bodies.rectangle(W / 2, H + 60, W + 400, 120, wallOpts), // пол
      Matter.Bodies.rectangle(-60, H / 2, 120, H * 3, wallOpts),
      Matter.Bodies.rectangle(W + 60, H / 2, 120, H * 3, wallOpts),
      Matter.Bodies.rectangle(W / 2, -H - 60, W + 400, 120, wallOpts), // потолок выше экрана
    ]

    const pairs: BodyEl[] = []

    // Клонируем видимые карточки с их текущих позиций на экране
    const cards = [...document.querySelectorAll<HTMLElement>('[data-card]')]
    const scale = W < 768 ? 0.42 : 0.55
    cards.forEach((card, i) => {
      const img = card.querySelector('img')
      if (!img) return
      const rect = card.getBoundingClientRect()
      const bw = Math.max(90, rect.width * scale)
      const bh = Math.max(90, rect.height * scale)
      // стартуем с текущей позиции, если карточка на экране, иначе — сверху
      const onScreen = rect.bottom > 0 && rect.top < H
      const x = onScreen ? rect.left + rect.width / 2 : (W / 8) + (i % 4) * (W / 4) + Math.random() * 40
      const y = onScreen ? rect.top + rect.height / 2 : -bh - i * 160 - Math.random() * 120

      const body = Matter.Bodies.rectangle(x, y, bw, bh, {
        restitution: 0.35,
        friction: 0.6,
        frictionAir: 0.012,
        angle: (Math.random() - 0.5) * 0.2,
      })
      Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.12)

      const el = document.createElement('div')
      el.style.cssText = `position:absolute;left:0;top:0;width:${bw}px;height:${bh}px;border-radius:16px;overflow:hidden;box-shadow:0 18px 40px -14px rgba(0,0,0,.7);will-change:transform;cursor:grab;`
      const im = document.createElement('img')
      im.src = (img as HTMLImageElement).src
      im.alt = ''
      im.draggable = false
      im.style.cssText = 'width:100%;height:100%;object-fit:cover;pointer-events:none;'
      el.appendChild(im)
      overlay.appendChild(el)
      pairs.push({ body, el })
    })

    // Мяч — прыгучий круг
    const ballR = W < 768 ? 46 : 62
    const ballBody = Matter.Bodies.circle(W - 120, H - 160, ballR, {
      restitution: 0.82,
      friction: 0.25,
      frictionAir: 0.006,
      density: 0.0016,
    })
    Matter.Body.setVelocity(ballBody, { x: -6, y: -14 })
    Matter.Body.setAngularVelocity(ballBody, -0.25)
    const ballEl = document.createElement('div')
    ballEl.style.cssText = `position:absolute;left:0;top:0;width:${ballR * 2}px;height:${ballR * 2}px;will-change:transform;cursor:grab;`
    const ballIm = document.createElement('img')
    ballIm.src = ballImg
    ballIm.alt = ''
    ballIm.draggable = false
    ballIm.style.cssText = 'width:100%;height:100%;pointer-events:none;'
    ballEl.appendChild(ballIm)
    overlay.appendChild(ballEl)
    pairs.push({ body: ballBody, el: ballEl })

    Matter.Composite.add(engine.world, [...walls, ...pairs.map((p) => p.body)])

    // Перетаскивание мышью и пальцем
    const mouse = Matter.Mouse.create(overlay)
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.18, damping: 0.08, render: { visible: false } },
    })
    Matter.Composite.add(engine.world, mouseConstraint)

    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(now - last, 33)
      last = now
      Matter.Engine.update(engine, dt)
      for (const { body, el } of pairs) {
        const w = parseFloat(el.style.width)
        const h = parseFloat(el.style.height)
        el.style.transform = `translate(${body.position.x - w / 2}px, ${body.position.y - h / 2}px) rotate(${body.angle}rad)`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') stop()
    }
    window.addEventListener('keydown', onKey)

    cleanupRef.current = () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      Matter.Composite.clear(engine.world, false)
      Matter.Engine.clear(engine)
      overlay.replaceChildren()
    }
    return () => {
      cleanupRef.current?.()
      cleanupRef.current = null
    }
  }, [active, stop])

  return (
    <>
      {/* Плавающий мяч-кнопка */}
      <button
        type="button"
        onClick={() => setActive(true)}
        aria-label="Включить режим игры"
        className={`ball-toggle fixed bottom-6 right-6 z-[60] w-16 h-16 md:w-20 md:h-20 rounded-full ${active ? 'opacity-0 pointer-events-none' : ''}`}
      >
        <img src={ballImg} alt="" className="w-full h-full" draggable={false} />
      </button>

      {/* Оверлей физического режима */}
      {active && (
        <div className="fixed inset-0 z-[70] bg-bg-deep/90 backdrop-blur-sm">
          <div ref={overlayRef} className="absolute inset-0 overflow-hidden touch-none select-none" />
          <p className="absolute top-6 left-1/2 -translate-x-1/2 text-muted text-xs uppercase tracking-[0.3em] pointer-events-none">
            Хватай и бросай
          </p>
          <button
            type="button"
            onClick={stop}
            aria-label="Выйти из режима игры"
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-accent text-bg-deep flex items-center justify-center hover:rotate-90 transition-transform duration-300"
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
