import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logo from '../assets/logo.svg'

gsap.registerPlugin(ScrollTrigger)

function RibbonWords({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="ribbon-word text-bg-deep text-[18vw] md:text-[13vw] px-[0.25em]">
          WINLINE
        </span>
      ))}
    </>
  )
}

/* Две пересекающиеся оранжевые ленты с бегущим словом WINLINE —
   двигаются в противоположные стороны, скорость привязана к скроллу */
function WinlineBanner() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackA = useRef<HTMLDivElement>(null)
  const trackB = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !trackA.current || !trackB.current || !wrapRef.current) return

    const tweens = [
      gsap.to(trackA.current, { xPercent: -25, ease: 'none', duration: 26, repeat: -1 }),
      gsap.to(trackB.current, { xPercent: 25, ease: 'none', duration: 30, repeat: -1 }),
    ]

    const st = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 900, 2.5)
        tweens.forEach((t) => gsap.to(t, { timeScale: boost, duration: 0.4, overwrite: true }))
      },
    })

    return () => {
      st.kill()
      tweens.forEach((t) => t.kill())
    }
  }, [])

  return (
    <div ref={wrapRef} className="relative h-[52vw] md:h-[36vw] overflow-hidden" aria-hidden="true">
      <div className="absolute left-[-12%] right-[-12%] top-[30%] -rotate-[9deg] bg-accent py-[0.5vw] overflow-hidden">
        <div ref={trackA} className="ribbon-track">
          <RibbonWords />
        </div>
      </div>
      <div className="absolute left-[-12%] right-[-12%] top-[52%] rotate-[7deg] bg-accent py-[0.5vw] overflow-hidden opacity-90">
        <div ref={trackB} className="ribbon-track">
          <RibbonWords />
        </div>
      </div>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="bg-bg-deep overflow-hidden">
      {/* Лейбл-разделитель перед баннером */}
      <div className="flex justify-center pt-24 pb-10">
        <img src={logo} alt="" aria-hidden="true" className="h-7" />
      </div>

      <WinlineBanner />

      <div className="max-w-[1440px] mx-auto px-5 md:px-12 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          <div>
            <img src={logo} alt="Winline Design" className="h-6 mb-5" />
            <p className="text-muted text-sm leading-relaxed max-w-[260px]">
              Создаём продукты нового формата в&nbsp;мире беттинга
            </p>
            <a
              href="https://t.me/winlinedesign"
              target="_blank"
              rel="noreferrer"
              aria-label="Telegram"
              className="mt-6 inline-flex w-9 h-9 rounded-lg bg-surface items-center justify-center text-muted hover:text-accent transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M21.9 4.6 18.8 19c-.2 1-0.8 1.2-1.6.8l-4.6-3.4-2.2 2.1c-.2.2-.5.5-.9.5l.3-4.6L18.3 7c.4-.3-.1-.5-.6-.2L7.4 13.3l-4.4-1.4c-1-.3-1-1 .2-1.4L20.5 3.2c.8-.3 1.6.2 1.4 1.4Z" />
              </svg>
            </a>
          </div>
          <div className="hidden md:block" />
          <div className="md:justify-self-end">
            <p className="text-muted/70 text-[11px] uppercase tracking-[0.25em] mb-2">Контакты</p>
            <a
              href="mailto:winlinedesign@gmail.com"
              className="text-fg text-sm hover:text-accent transition-colors"
            >
              winlinedesign@gmail.com
            </a>
          </div>
        </div>

        <div className="border-t border-surface mt-14 pt-6">
          <p className="text-muted/60 text-xs">© 2026 Winline Design — все права защищены</p>
        </div>
      </div>
    </footer>
  )
}
