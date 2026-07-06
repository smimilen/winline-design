import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import logo from '../assets/logo.svg'

gsap.registerPlugin(ScrollTrigger)

const VIDEO_SRC = `${import.meta.env.BASE_URL}video/hero-video.mp4`
const VIDEO_WEBM = `${import.meta.env.BASE_URL}video/hero-video.webm`

export default function HeroVideo() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    let trigger: ScrollTrigger | undefined
    const target = { t: 0 }

    const setup = () => {
      const duration = video.duration
      if (!duration || trigger) return

      trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          target.t = self.progress * (duration - 0.05)
        },
      })

      // Сглаживаем перемотку: тянем currentTime к целевому значению каждый кадр
      gsap.ticker.add(smooth)
    }

    const smooth = () => {
      const v = videoRef.current
      if (!v) return
      const diff = target.t - v.currentTime
      if (Math.abs(diff) > 0.001) {
        v.currentTime += diff * 0.22
      }
    }

    if (video.readyState >= 1) setup()
    video.addEventListener('loadedmetadata', setup)

    return () => {
      video.removeEventListener('loadedmetadata', setup)
      gsap.ticker.remove(smooth)
      trigger?.kill()
    }
  }, [])

  return (
    <section id="top" ref={sectionRef} className="relative h-[320vh]">
      {/* Sticky-вьюпорт: видео закреплено, пока идёт скраббинг */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Декоративное свечение позади видео */}
        <div
          aria-hidden="true"
          className="absolute w-[80vmin] h-[80vmin] rounded-full opacity-20 blur-[120px]"
          style={{
            background:
              'radial-gradient(circle, #ff6a13 0%, rgba(255,106,19,0.25) 45%, transparent 70%)',
          }}
        />
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="relative w-[min(86vw,980px)] aspect-video object-cover rounded-card"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
          <source src={VIDEO_WEBM} type="video/webm" />
        </video>
        <p className="relative mt-8 text-muted text-xs md:text-sm uppercase tracking-[0.35em] font-onest">
          Листай вниз
        </p>
      </div>

      {/* Подвал hero-блока: лейбл, описание, контакты */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="max-w-[1440px] mx-auto px-5 md:px-12 pb-16 grid grid-cols-1 md:grid-cols-3 gap-10 items-end">
          <div>
            <img src={logo} alt="" aria-hidden="true" className="h-6 mb-5" />
            <p className="text-muted text-sm leading-relaxed max-w-[260px]">
              Создаём продукты нового формата в&nbsp;мире беттинга
            </p>
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
      </div>
    </section>
  )
}
