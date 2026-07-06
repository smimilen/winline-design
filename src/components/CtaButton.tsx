export default function CtaButton() {
  return (
    <a href="mailto:winlinedesign@gmail.com" className="cta-pill group" aria-label="Написать нам на почту">
      <span className="pill-label bg-accent text-bg-deep font-din font-bold italic uppercase text-[13px] tracking-wide px-4 py-2 rounded-full">
        Ало связь
      </span>
      <span className="pill-arrow bg-accent text-bg-deep w-[33px] h-[33px] rounded-full flex items-center justify-center">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
          <path d="M2 11L11 2M11 2H4M11 2V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  )
}
