import { useEffect, useState } from 'react'
import logo from '../assets/logo.svg'
import CtaButton from './CtaButton'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-bg/80 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-5 md:px-12 py-5">
        <a href="#top" aria-label="Winline Design — на главную">
          <img src={logo} alt="Winline Design" className="h-6 md:h-7 w-auto" />
        </a>
        <CtaButton />
      </div>
    </header>
  )
}
