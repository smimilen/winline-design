import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logo from '../assets/logo.svg'
import footerArt from '../assets/footer-art.svg'

gsap.registerPlugin(ScrollTrigger)

/* Фирменный баннер WINLINE из макета — полноширинный SVG
   с лёгким параллакс-дрейфом при скролле */
function WinlineBanner() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const artRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !wrapRef.current || !artRef.current) return

    const tween = gsap.fromTo(
      artRef.current,
      { yPercent: 10, scale: 1.06 },
      {
        yPercent: -6,
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      },
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <div ref={wrapRef} className="relative overflow-hidden" aria-hidden="true">
      <img
        ref={artRef}
        src={footerArt}
        alt=""
        className="block w-full h-auto will-change-transform"
        loading="lazy"
      />
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
