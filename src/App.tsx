import { useState, useEffect, useRef, useCallback } from "react"
import { useTheme } from "./context/ThemeContext"
import { useTypewriter } from "./hooks/useTypewriter"
import Particles from "./components/Particles"

// ─── Custom cursor (adaptativo al tema, mejorado) ────────────────────────────
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -100, y: -100 })
  const ring = useRef({ x: -100, y: -100 })
  const raf = useRef<number>(0)
  const { theme } = useTheme()

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", move)

    const tick = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12
      ring.current.y += (pos.current.y - ring.current.y) * 0.12
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 18}px, ${ring.current.y - 18}px)`
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener("mousemove", move)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  const isDark = theme === "dark"
  const dotColor = isDark ? "#00d4aa" : "#00a88a"
  const ringColor = isDark ? "rgba(0, 212, 170, 0.6)" : "rgba(0, 168, 138, 0.9)"
  const ringWidth = isDark ? "1px" : "2px"

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999]"
        style={{
          willChange: "transform",
          backgroundColor: dotColor,
          mixBlendMode: isDark ? "screen" : "normal",
        }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full pointer-events-none z-[9998]"
        style={{
          willChange: "transform",
          transition: "none",
          border: `${ringWidth} solid ${ringColor}`,
        }}
      />
    </>
  )
}

// ─── Scroll reveal hook ───────────────────────────────────────────────────────
function useReveal(delay = 0) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.transitionDelay = `${delay}ms`
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible")
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])
  return ref
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useReveal(delay)
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal ${className}`}
    >
      {children}
    </div>
  )
}

function Section({
  id,
  className = "",
  children,
}: {
  id?: string
  className?: string
  children: React.ReactNode
}) {
  const ref = useReveal()
  return (
    <section
      id={id}
      ref={ref as React.RefObject<HTMLElement>}
      className={`reveal ${className}`}
    >
      {children}
    </section>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links = [
    { href: "#inicio", label: "Inicio" },
    { href: "#sobre-mi", label: "Sobre mí" },
    { href: "#habilidades", label: "Habilidades" },
    { href: "#ia", label: "IA" },
    { href: "#proyectos", label: "Proyectos" },
    { href: "#certificaciones", label: "Certs" },
    { href: "#perfil", label: "Perfil" },
    { href: "#contacto", label: "Contacto" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? "bg-[var(--bg)]/96 backdrop-blur-lg border-b border-[var(--card-border)] shadow-[0_4px_24px_rgba(0,0,0,0.25)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <a
          href="#inicio"
          className="font-mono text-sm font-bold tracking-widest flex items-center gap-2 group"
        >
          <span className="w-7 h-7 rounded border border-[var(--primary)]/40 bg-[var(--primary)]/12 flex items-center justify-center text-[var(--primary)] transition-all duration-200 group-hover:bg-[var(--primary)] group-hover:text-[var(--bg)] group-hover:scale-110">
            G
          </span>
          <span className="text-[var(--fg)]">GM</span>
          <span className="text-[var(--primary)]">.</span>
        </a>

        <div className="hidden md:flex items-center gap-0.5">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative font-mono text-xs tracking-widest text-[var(--muted)] hover:text-[var(--primary)] px-3 py-2 rounded transition-colors duration-200 uppercase group"
            >
              {l.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-0 bg-[var(--primary)] transition-all duration-300 group-hover:w-4/5 rounded-full" />
            </a>
          ))}
        </div>

        <button
          onClick={toggleTheme}
          className="ml-2 w-9 h-9 rounded-lg border border-[var(--card-border)] hover:border-[var(--primary)]/50 bg-[var(--card)] hover:bg-[var(--primary)]/8 flex items-center justify-center text-[var(--muted)] hover:text-[var(--primary)] transition-all duration-200"
          aria-label="Cambiar tema"
          title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {theme === "dark" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-[var(--muted)] transition-all duration-200 ${
              open ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-[var(--muted)] transition-all duration-200 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-[var(--muted)] transition-all duration-200 ${
              open ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="bg-[var(--bg)]/99 border-b border-[var(--card-border)] px-6 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-mono text-xs tracking-widest text-[var(--muted)] hover:text-[var(--primary)] py-3 border-b border-[var(--card-border)]/50 last:border-0 uppercase transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const typedText = useTypewriter({
    words: [
      "tecnología.",
      "interfaces web.",
      "experiencias UX.",
      "con IA aplicada.",
    ],
    typeSpeed: 90,
    deleteSpeed: 50,
    pauseTime: 1800,
  })

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!heroRef.current || !glowRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    glowRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, #00d4aa0a, transparent 60%)`
  }, [])

  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    el.addEventListener("mousemove", onMouseMove)
    return () => el.removeEventListener("mousemove", onMouseMove)
  }, [onMouseMove])

  return (
    <section
      id="inicio"
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden grid-bg"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg)] via-[var(--bg)]/90 to-[var(--card)]" />
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none transition-all duration-100"
      />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--primary)]/7 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[var(--accent)]/7 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="animate-fade-up animate-fade-up-delay-1 inline-flex items-center gap-2 bg-[var(--primary)]/8 border border-[var(--primary)]/30 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
              <span className="font-mono text-xs text-[var(--primary)] tracking-widest uppercase">
                Técnico en Programación · ADSO · Frontend
              </span>
            </div>

            <h1 className="animate-fade-up animate-fade-up-delay-2 font-mono font-black leading-tight mb-6">
              <span className="block text-4xl md:text-5xl lg:text-6xl text-[var(--fg)]">
                Construyendo
              </span>
              <span className="block text-4xl md:text-5xl lg:text-6xl text-[var(--fg)]">
                soluciones.
              </span>
              <span className="block text-3xl md:text-4xl lg:text-5xl text-[var(--primary)] mt-2">
                Aprendiendo
              </span>
              <span className="block text-3xl md:text-4xl lg:text-5xl text-[var(--primary)] min-h-[1.2em]">
                {typedText}
                <span className="cursor-blink" />
              </span>
            </h1>

            <p className="animate-fade-up animate-fade-up-delay-3 text-[var(--muted)] text-base md:text-lg leading-relaxed mb-10 max-w-md">
              Hola, soy{" "}
              <span className="text-[var(--fg)] font-semibold">
                Gabriel Munera
              </span>
              . Técnico en Programación de Software — SENA, aprendiz{" "}
              <span className="text-[var(--primary)]">ADSO</span>, enfocado en
              construir interfaces web modernas y continuar creciendo como
              desarrollador frontend.
            </p>

            <div className="animate-fade-up animate-fade-up-delay-4 flex flex-wrap gap-4">
              <a href="#perfil" className="btn-primary">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                </svg>
                Ver perfil profesional
              </a>
              <a href="#proyectos" className="btn-outline">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
                Ver proyectos
              </a>
            </div>
          </div>

          <div className="animate-fade-up animate-fade-up-delay-5 hidden md:flex items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/10 blur-xl" />
              <div className="absolute -inset-2 rounded-full border border-[var(--primary)]/20" />
              <div className="absolute -inset-7 rounded-full border border-[var(--primary)]/12" />
              <div className="relative w-72 h-72 rounded-full overflow-hidden border-2 border-[var(--primary)]/40 glow-cyan">
                <img
                  src="/gabriel-photo.png"
                  alt="Gabriel Munera — Foto profesional"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[var(--card)] border border-[var(--primary)]/40 rounded-full px-4 py-1.5 flex items-center gap-2 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                <span className="font-mono text-xs text-[var(--primary)] tracking-wide">
                  Disponible
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="font-mono text-xs text-[var(--muted)] tracking-widest uppercase">
            scroll
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-[var(--muted)] to-transparent" />
        </div>
      </div>
    </section>
  )
}

// ─── Sobre mí ─────────────────────────────────────────────────────────────────
function SobreMi() {
  return (
    <Section id="sobre-mi" className="py-24 md:py-32 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="flex items-center gap-3 mb-16">
          <span className="font-mono text-xs text-[var(--primary)] tracking-[0.2em] uppercase">
            01
          </span>
          <div className="w-8 h-px bg-[var(--primary)]/40" />
          <span className="font-mono text-xs text-[var(--muted)] tracking-[0.15em] uppercase">
            Sobre mí
          </span>
        </Reveal>

        <div className="grid md:grid-cols-5 gap-12 items-start">
          <Reveal className="md:col-span-2">
            <div className="border-gradient rounded-xl bg-[var(--card)] p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-[var(--primary)]/40">
                    <img
                      src="/gabriel-photo.png"
                      alt="Gabriel Munera"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[var(--primary)] border-2 border-[var(--card)]" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--fg)] text-base">
                    Gabriel Munera
                  </p>
                  <p className="font-mono text-xs text-[var(--muted)] mt-0.5">
                    gabrielmunerarocha@gmail.com
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  {
                    icon: <GradIcon />,
                    text: "SENA — Técnico en Prog. de Software",
                  },
                  { icon: <MonitorIcon />, text: "Aprendiz ADSO — Frontend" },
                  { icon: <PinIcon />, text: "Colombia" },
                  {
                    icon: <RocketIcon />,
                    text: "Disponible para oportunidades",
                  },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="w-7 h-7 rounded-md bg-[var(--surface)] flex items-center justify-center text-[var(--primary)] flex-shrink-0">
                      {item.icon}
                    </span>
                    <span className="text-[var(--muted)]">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-[var(--card-border)] flex flex-wrap gap-2">
                <div className="tech-tag">Técnico SENA</div>
                <div className="tech-tag">ADSO</div>
              </div>
            </div>
          </Reveal>

          <div className="md:col-span-3 space-y-6">
            <Reveal delay={80}>
              <h2 className="font-mono font-bold text-3xl md:text-4xl text-[var(--fg)] leading-snug">
                Aprendiendo a construir
                <br />
                <span className="text-[var(--primary)]">el web del futuro.</span>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="text-[var(--muted)] leading-relaxed">
                Soy aprendiz del programa{" "}
                <strong className="text-[var(--fg)]">
                  Análisis y Desarrollo de Software (ADSO)
                </strong>{" "}
                en el SENA. Mi enfoque principal es el{" "}
                <strong className="text-[var(--fg)]">desarrollo frontend</strong>:
                construir interfaces web que sean funcionales, accesibles y
                visualmente claras.
              </p>
            </Reveal>
            <Reveal delay={180}>
              <p className="text-[var(--muted)] leading-relaxed">
                Además del desarrollo web, me especializo en{" "}
                <strong className="text-[var(--fg)]">
                  herramientas de Inteligencia Artificial
                </strong>{" "}
                — desde prompt engineering hasta automatización de flujos — y
                mantengo un compromiso activo con la{" "}
                <strong className="text-[var(--fg)]">
                  formación continua internacional
                </strong>{" "}
                a través de certificaciones verificables.
              </p>
            </Reveal>
            <Reveal delay={210}>
              <div className="flex flex-wrap gap-4">
                <a
                  href="#certificaciones"
                  className="inline-flex items-center gap-2 text-[var(--primary)] font-mono text-xs uppercase tracking-widest hover:gap-3 transition-all duration-200 group"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Ver todas mis certificaciones
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="group-hover:translate-x-1 transition-transform"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
                <a
                  href="#ia"
                  className="inline-flex items-center gap-2 text-[var(--accent)] font-mono text-xs uppercase tracking-widest hover:gap-3 transition-all duration-200 group"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
                  </svg>
                  Ver herramientas de IA
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="group-hover:translate-x-1 transition-transform"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </Reveal>
            <Reveal delay={240}>
              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { val: "ADSO", label: "Programa SENA" },
                  { val: "Frontend", label: "Especialidad" },
                  { val: "2024", label: "Inicio formación" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-[var(--surface)] border border-[var(--card-border)] rounded-lg p-4 text-center hover:border-[var(--primary)]/30 transition-colors"
                  >
                    <p className="font-mono font-bold text-[var(--primary)] text-lg">
                      {s.val}
                    </p>
                    <p className="font-mono text-xs text-[var(--muted)] mt-1 tracking-wide">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  )
}

// ─── SVG Icon primitives ─────────────────────────────────────────────────────
const GradIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
)
const MonitorIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
)
const PinIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)
const RocketIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
)

// ─── Habilidades ──────────────────────────────────────────────────────────────
const technicalSkills = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z" />
      </svg>
    ),
    name: "HTML5",
    desc: "Estructura semántica, formularios y accesibilidad web.",
    accent: "#e34f26",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z" />
      </svg>
    ),
    name: "CSS3",
    desc: "Flexbox, Grid, animaciones y diseño responsive.",
    accent: "#1572b6",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" />
      </svg>
    ),
    name: "JavaScript",
    desc: "DOM, funciones asíncronas, ES6+ y lógica del cliente.",
    accent: "#d97706",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
      </svg>
    ),
    name: "Tailwind CSS",
    desc: "Diseño utilitario y sistemas de tokens coherentes.",
    accent: "#0e7490",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M1.292 5.856L11.54 0v24l-4.095-2.378V7.603l-6.168 3.564.015-5.31zm21.416 5.31l-6.168-3.564V21.62L12.46 24V0l10.248 5.856v5.31z" />
      </svg>
    ),
    name: "Git & GitHub",
    desc: "Control de versiones y flujos de trabajo colaborativos.",
    accent: "#d97706",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M12 2c-4.879 0-9 3.54-9 8.086 0 1.97.78 3.84 2.081 5.266L3.5 18.5l3.5-.5c1.5.94 3.15 1.5 5 1.5 4.879 0 9-3.54 9-8.086C21 6.868 16.879 3.328 12 3.328zM12 6a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm0 12c-3 0-5.5-1.5-5.5-3.5v-.5c0-1.5 2.5-2.5 5.5-2.5s5.5 1 5.5 2.5v.5c0 2-2.5 3.5-5.5 3.5z" />
      </svg>
    ),
    name: "Diseño Responsive",
    desc: "Interfaces adaptables a cualquier dispositivo.",
    accent: "#0891b2",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm6.16 9.686l.108 1.8H12l-.353 3.601-2.17.6-2.1-.6-.14-1.8H5.48l.252 3.2L12 18.001l6.268-1.714.853-9.715H7.66l.108 3.4H15.1l-.26 2.5-2.84.8-2.84-.8-.14-2.5z" />
      </svg>
    ),
    name: "SQL",
    desc: "Bases de datos relacionales, consultas y diseño de esquemas.",
    accent: "#6d28d9",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.13-.1.2-.19.27-.3.29-.38.27-.47.21-.56.13-.65.03H6.15l-.44.03-.45.1-.42.2-.38.3-.35.38-.29.45-.22.5-.14.55-.07.6-.01.62v3.22l.01.38.08.36.15.32.22.28.3.2.38.13.46.06.54.01h3.6l.51-.02.48-.1.44-.18.4-.27.36-.34.3-.41.24-.47.18-.52.12-.57.06-.61.01-.62V8.76h4.62l-.16 9.5H8.48l-.36.01-.32.04-.29.08-.25.13-.22.18-.2.24-.16.3-.12.35-.08.4-.04.46V22l.07.38.15.3.23.22.28.14.34.06h.38l.44-.01.48-.06.51-.11.52-.17.53-.23.53-.3.51-.37.49-.42.46-.48.42-.53.37-.57.3-.6.24-.63.16-.64.08-.65.02-.66v-2.04l-.01-.31-.06-.31-.13-.28-.2-.25-.27-.22-.34-.18-.41-.13-.47-.08-.53-.03H6.5l-.41.02-.36.06-.32.1-.29.14-.26.2-.22.26-.18.31-.13.36-.08.4-.04.44V8.49l.01-.58.07-.56.13-.53.2-.5.27-.47.33-.43.38-.39.42-.35.46-.3.49-.26.52-.21.55-.15.58-.1.6-.05h7.47l.6.04.58.08.56.13.53.19.5.25.48.32.44.38.4.43.36.48.3.52.24.57.18.61.12.64.06.67.01.69V8.64l-.02.61-.06.6-.11.59-.16.56-.21.53-.26.5-.3.46-.34.43-.39.38-.43.33-.47.28-.5.22-.54.16-.57.1-.61.05-.64.01H8.57l-.54.02-.5.07-.47.11-.44.16-.4.2-.36.24-.32.29-.27.33-.22.37-.17.4-.11.44-.06.46-.01.49v4.93l.01.5.06.48.11.46.16.44.22.41.27.38.32.35.36.31.4.27.43.22.47.17.51.12.55.07.58.02h8.43l.56-.03.52-.08.48-.13.44-.18.4-.24.36-.29.31-.35.26-.4.2-.46.15-.51.09-.55.03-.59v-2.07l-.03-.47-.08-.43-.14-.4-.2-.37-.26-.33-.31-.29-.36-.26-.41-.22-.45-.17-.5-.12-.54-.07-.57-.02H12z" />
      </svg>
    ),
    name: "Python",
    desc: "Scripting, automatización y fundamentos de ciencia de datos.",
    accent: "#1e40af",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M11.998 24c-.321 0-.641-.084-.922-.247l-2.936-1.737c-.438-.245-.224-.332-.08-.383.585-.203.703-.25 1.328-.605.065-.037.151-.023.218.017l2.256 1.339c.082.045.198.045.272 0l8.795-5.076c.082-.047.134-.141.134-.238V6.921c0-.099-.053-.192-.137-.242l-8.791-5.072c-.081-.047-.189-.047-.271 0L3.075 6.68c-.085.05-.139.145-.139.242v10.15c0 .097.054.189.137.236l2.408 1.392c1.307.654 2.108-.116 2.108-.891V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.111.255.253v10.021c0 1.745-.95 2.745-2.604 2.745-.508 0-.909 0-2.026-.551L2.28 18.675c-.57-.329-.922-.943-.922-1.604V6.921c0-.661.352-1.274.922-1.603l8.795-5.082c.557-.315 1.296-.315 1.848 0l8.794 5.082c.570.329.924.942.924 1.603v10.15c0 .661-.354 1.275-.924 1.604l-8.794 5.076c-.282.164-.602.247-.925.247z" />
      </svg>
    ),
    name: "Node.js",
    desc: "Entorno de ejecución JS en el servidor, npm y bundling.",
    accent: "#15803d",
  },
]

const softSkills = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    name: "Trabajo en equipo",
    desc: "Colaboración efectiva en proyectos grupales y ambientes ágiles.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    name: "Comunicación efectiva",
    desc: "Expresión clara de ideas técnicas y escucha activa.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
    name: "Resolución de problemas",
    desc: "Análisis de errores y búsqueda de soluciones iterativas.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    name: "Aprendizaje continuo",
    desc: "Actualización constante y mentalidad de crecimiento.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
      </svg>
    ),
    name: "Pensamiento crítico",
    desc: "Evaluación objetiva de decisiones técnicas y de diseño.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
      </svg>
    ),
    name: "Adaptabilidad",
    desc: "Manejo ágil de cambios en tecnologías, entornos y requisitos.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    name: "Gestión del tiempo",
    desc: "Planificación de tareas y entrega dentro de plazos definidos.",
  },
]

function Habilidades() {
  const [tab, setTab] = useState<"tecnicas" | "blandas">("tecnicas")

  return (
    <Section id="habilidades" className="py-24 md:py-32 bg-[var(--bg-alt)] relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs text-[var(--primary)] tracking-[0.2em] uppercase">
            02
          </span>
          <div className="w-8 h-px bg-[var(--primary)]/40" />
          <span className="font-mono text-xs text-[var(--muted)] tracking-[0.15em] uppercase">
            Habilidades
          </span>
        </Reveal>

        <Reveal
          delay={60}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <h2 className="font-mono font-bold text-3xl md:text-4xl text-[var(--fg)] leading-tight">
            Tecnologías y capacidades
            <br />
            <span className="text-[var(--primary)]">que me definen.</span>
          </h2>
        </Reveal>

        <Reveal delay={100} className="flex gap-2 mb-10">
          <button
            onClick={() => setTab("tecnicas")}
            className={`font-mono text-xs tracking-widest uppercase px-5 py-2.5 rounded-lg border transition-all duration-200 ${
              tab === "tecnicas"
                ? "bg-[var(--primary)] text-[var(--bg)] border-[var(--primary)] font-bold"
                : "bg-transparent text-[var(--muted)] border-[var(--card-border)] hover:border-[var(--primary)]/40 hover:text-[var(--fg)]"
            }`}
          >
            Técnicas
          </button>
          <button
            onClick={() => setTab("blandas")}
            className={`font-mono text-xs tracking-widest uppercase px-5 py-2.5 rounded-lg border transition-all duration-200 ${
              tab === "blandas"
                ? "bg-[var(--primary)] text-[var(--bg)] border-[var(--primary)] font-bold"
                : "bg-transparent text-[var(--muted)] border-[var(--card-border)] hover:border-[var(--primary)]/40 hover:text-[var(--fg)]"
            }`}
          >
            Habilidades blandas
          </button>
        </Reveal>

        {tab === "tecnicas" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {technicalSkills.map((sk, i) => (
              <Reveal key={sk.name} delay={i * 40}>
                <div className="skill-card h-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: sk.accent + "18", color: sk.accent }}
                  >
                    {sk.icon}
                  </div>
                  <p className="font-mono font-bold text-[var(--fg)] mb-2 text-sm">
                    {sk.name}
                  </p>
                  <p className="text-[var(--muted)] text-sm leading-relaxed">
                    {sk.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {tab === "blandas" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {softSkills.map((sk, i) => (
              <Reveal key={sk.name} delay={i * 40}>
                <div className="skill-card h-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5">
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-4 bg-[var(--primary)]/12 text-[var(--primary)]">
                    {sk.icon}
                  </div>
                  <p className="font-mono font-bold text-[var(--fg)] mb-2 text-sm">
                    {sk.name}
                  </p>
                  <p className="text-[var(--muted)] text-sm leading-relaxed">
                    {sk.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}

// ─── IA Tools ─────────────────────────────────────────────────────────────────
const aiTools = [
  {
    name: "Claude",
    org: "Anthropic",
    desc: "Prompt engineering avanzado, análisis de código, generación de contenido técnico y asistencia en desarrollo.",
    accent: "#00d4aa",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M8 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" />
        <path d="M12 8V6M12 18v-2M8 12H6M18 12h-2" />
      </svg>
    ),
    skills: ["Prompt Engineering", "Code Review", "Análisis técnico"],
  },
  {
    name: "ChatGPT",
    org: "OpenAI",
    desc: "Generación de contenido, resolución de problemas, automatización de tareas repetitivas y apoyo en documentación.",
    accent: "#3b82f6",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 10h8M8 14h5" />
      </svg>
    ),
    skills: ["Generación de contenido", "Automatización", "Documentación"],
  },
  {
    name: "DeepSeek",
    org: "DeepSeek AI",
    desc: "Análisis de datos, razonamiento lógico profundo y asistencia en resolución de problemas complejos.",
    accent: "#8b5cf6",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.35-4.35" />
        <path d="M8 11h6M11 8v6" />
      </svg>
    ),
    skills: ["Análisis de datos", "Razonamiento lógico", "Resolución de problemas"],
  },
  {
    name: "Perplexity AI",
    org: "Perplexity",
    desc: "Investigación técnica acelerada, búsqueda semántica y síntesis de información de fuentes múltiples.",
    accent: "#06b6d4",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    skills: ["Investigación técnica", "Búsqueda semántica", "Síntesis de info"],
  },
  {
    name: "Gemini",
    org: "Google",
    desc: "Análisis multimodal, integración con ecosistema Google y generación de contenido asistida por IA.",
    accent: "#e2e8f0",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
      </svg>
    ),
    skills: ["Análisis multimodal", "Integración Google", "Generación de contenido"],
  },
  {
    name: "Google AI Studio",
    org: "Google",
    desc: "Prototipado rápido con modelos Gemini, exploración de APIs de IA y ajuste de parámetros de modelos.",
    accent: "#f59e0b",
    icon: (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M14 17.5h7M17.5 14v7" />
      </svg>
    ),
    skills: ["Prototipado con IA", "API de modelos", "Fine-tuning de prompts"],
  },
]

function HerramientasIA() {
  return (
    <Section id="ia" className="py-24 md:py-32 bg-[var(--bg-alt)] relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs text-[var(--primary)] tracking-[0.2em] uppercase">
            03
          </span>
          <div className="w-8 h-px bg-[var(--primary)]/40" />
          <span className="font-mono text-xs text-[var(--muted)] tracking-[0.15em] uppercase">
            Inteligencia Artificial
          </span>
        </Reveal>

        <Reveal delay={50}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
            <h2 className="font-mono font-bold text-3xl md:text-4xl text-[var(--fg)] leading-tight">
              Especialidad en
              <br />
              <span className="text-[var(--primary)]">herramientas de IA.</span>
            </h2>
            <p className="text-[var(--muted)] text-sm max-w-xs md:text-right">
              Uso activo de modelos de lenguaje para potenciar el desarrollo de
              software.
            </p>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <div className="mb-12 inline-flex items-center gap-2 bg-[var(--primary)]/8 border border-[var(--primary)]/30 rounded-full px-4 py-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="font-mono text-xs text-[var(--primary)] tracking-widest uppercase font-bold">
              Especialista en Herramientas de IA
            </span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiTools.map((tool, i) => (
            <Reveal key={tool.name} delay={i * 50}>
              <div className="skill-card h-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border"
                    style={{
                      background: tool.accent + "14",
                      color: tool.accent,
                      borderColor: tool.accent + "35",
                    }}
                  >
                    {tool.icon}
                  </div>
                  <div>
                    <p className="font-mono font-bold text-[var(--fg)] text-sm leading-tight">
                      {tool.name}
                    </p>
                    <p className="font-mono text-xs text-[var(--muted)]">
                      {tool.org}
                    </p>
                  </div>
                </div>

                <p className="text-[var(--muted)] text-sm leading-relaxed flex-1">
                  {tool.desc}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[var(--card-border)]">
                  {tool.skills.map((s) => (
                    <span
                      key={s}
                      className="font-mono text-xs px-2 py-0.5 rounded border"
                      style={{
                        color: tool.accent,
                        background: tool.accent + "10",
                        borderColor: tool.accent + "30",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ─── Proyectos ────────────────────────────────────────────────────────────────
const projects = [
  {
    title: "ADSO_Forms",
    desc: "Formulario web para el programa ADSO del SENA. Integración con API para gestión y envío de datos.",
    tags: ["HTML", "JavaScript", "API"],
    img: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&h=500&fit=crop&auto=format",
    status: "Completado",
    demo: "https://adso-forms.vercel.app",
    repo: "https://github.com/GaboTonoto27/ADSO_Forms",
  },
  {
    title: "Nativa-Portafolio",
    desc: "Sitio web NATIVA — proyecto desarrollado para el SENA. Presentación de marca con diseño limpio y estructura modular.",
    tags: ["HTML", "CSS", "JavaScript"],
    img: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&h=500&fit=crop&auto=format",
    status: "Completado",
    demo: "https://nativa-portafolio.vercel.app",
    repo: "https://github.com/GaboTonoto27/nativa-portafolio",
  },
  {
    title: "SENA-ADSO-Exam",
    desc: "Sistema de evaluación para el programa SENA ADSO. Aplicación web para gestión y realización de exámenes.",
    tags: ["HTML", "JavaScript"],
    img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=500&fit=crop&auto=format",
    status: "Completado",
    demo: "https://sena-adso-exam.vercel.app",
    repo: "https://github.com/GaboTonoto27/sena-adso-exam",
  },
  {
    title: "Biblioteca2",
    desc: "Sistema de gestión de biblioteca con CRUD, interfaz moderna construida con Tailwind y bundling con Vite.",
    tags: ["JavaScript", "Node.js", "Tailwind", "Vite"],
    img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=500&fit=crop&auto=format",
    status: "En desarrollo",
    demo: null,
    repo: "https://github.com/GaboTonoto27/Biblioteca2",
  },
]

function Proyectos() {
  return (
    <Section id="proyectos" className="py-24 md:py-32 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs text-[var(--primary)] tracking-[0.2em] uppercase">
            04
          </span>
          <div className="w-8 h-px bg-[var(--primary)]/40" />
          <span className="font-mono text-xs text-[var(--muted)] tracking-[0.15em] uppercase">
            Proyectos
          </span>
        </Reveal>

        <Reveal
          delay={60}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <h2 className="font-mono font-bold text-3xl md:text-4xl text-[var(--fg)] leading-tight">
            Proyectos reales
            <br />
            <span className="text-[var(--primary)]">en GitHub.</span>
          </h2>
          <p className="text-[var(--muted)] text-sm max-w-xs md:text-right">
            Publicados y verificables durante mi formación en el SENA.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 60}>
              <div className="project-card h-full bg-[var(--card)] border border-[var(--card-border)] rounded-xl overflow-hidden flex flex-col">
                <div className="relative overflow-hidden bg-[var(--surface)] h-48">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover opacity-70 transition-all duration-500 group-hover:opacity-90 group-hover:scale-105"
                  />
                  <span
                    className={`absolute top-3 right-3 font-mono text-xs px-2 py-0.5 rounded-full ${
                      p.status === "Completado"
                        ? "bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/40"
                        : "bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/40"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1 gap-3">
                  <h3 className="font-mono font-bold text-[var(--fg)]">
                    {p.title}
                  </h3>
                  <p className="text-[var(--muted)] text-sm leading-relaxed flex-1">
                    {p.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span key={t} className="tech-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-[var(--card-border)]">
                    {p.demo ? (
                      <a
                        href={p.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-sm btn-sm-primary flex-1 justify-center"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                        </svg>
                        Ver demo
                      </a>
                    ) : (
                      <span className="btn-sm flex-1 justify-center opacity-30 cursor-not-allowed bg-[var(--surface)] text-[var(--muted)] font-mono text-xs uppercase tracking-wide rounded">
                        Sin demo
                      </span>
                    )}
                    <a
                      href={p.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-sm btn-sm-ghost flex-1 justify-center"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                      </svg>
                      Repositorio
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}

// ─── Certificaciones data ─────────────────────────────────────────────────────
const certDocs = [
  {
    title: "Scrum Fundamentals Certified (SFC)",
    org: "SCRUMstudy",
    year: "2026",
    type: "Internacional",
    accent: "#f59e0b",
    filePath: "/certs/scrum-sfc.pdf" as string | null,
    fileType: "pdf" as "pdf" | "image",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    desc: "Certificación internacional en metodologías ágiles Scrum. Gestión de sprints, roles y ceremonias.",
  },
  {
    title: "Introducción a la Ciencia de Datos",
    org: "Cisco Networking Academy",
    year: "2026",
    type: "Internacional",
    accent: "#3b82f6",
    filePath: "/certs/cisco-data-science.pdf" as string | null,
    fileType: "pdf" as "pdf" | "image",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    desc: "Fundamentos de ciencia de datos, análisis estadístico y visualización de información.",
  },
  {
    title: "Técnico en Programación de Software",
    org: "SENA",
    year: "2024–2025",
    type: "Título oficial",
    accent: "#00d4aa",
    filePath: "/certs/titulo-sena.pdf" as string | null,
    fileType: "pdf" as "pdf" | "image",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    desc: "Título técnico oficial. Programación, bases de datos, análisis de sistemas y desarrollo de software.",
  },
  {
    title: "Desarrollo de Bases de Datos con SQL",
    org: "SENA",
    year: "2024",
    type: "40 horas",
    accent: "#8b5cf6",
    filePath: "/certs/sql-sena.pdf" as string | null,
    fileType: "pdf" as "pdf" | "image",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    desc: "Diseño relacional, consultas SQL avanzadas, procedimientos almacenados y optimización.",
  },
  {
    title: "Semana de Python en la Práctica",
    org: "Daxus Latam",
    year: "2026",
    type: "8 horas",
    accent: "#06b6d4",
    filePath: "/certs/python-daxus.pdf" as string | null,
    fileType: "pdf" as "pdf" | "image",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    desc: "Python aplicado: scripting, manejo de datos, automatización y ejercicios prácticos intensivos.",
  },
]

type CertDoc = typeof certDocs[number]

// ─── Certificate Modal (lightbox) ─────────────────────────────────────────────
function CertModal({ cert, onClose }: { cert: CertDoc; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", handler)
      document.body.style.overflow = ""
    }
  }, [onClose])

  const handleDownload = () => {
    if (!cert.filePath) return
    const a = document.createElement("a")
    a.href = cert.filePath
    a.download = cert.title
    a.click()
  }

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={cert.title}
    >
      <div
        className="absolute inset-0 bg-[var(--bg)]/85 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)] border border-[var(--card-border)] bg-[var(--card)] animate-modal-in">
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[var(--card-border)] flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border"
              style={{
                background: cert.accent + "18",
                color: cert.accent,
                borderColor: cert.accent + "40",
              }}
            >
              {cert.icon}
            </div>
            <div className="min-w-0">
              <p className="font-mono font-bold text-[var(--fg)] text-sm truncate">
                {cert.title}
              </p>
              <p className="font-mono text-xs text-[var(--muted)]">
                {cert.org} · {cert.year}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[var(--surface)] hover:bg-[var(--card-border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--fg)] transition-all flex-shrink-0"
            aria-label="Cerrar"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-[var(--surface)] min-h-0">
          {cert.filePath ? (
            <div className="flex flex-col items-center justify-center gap-5 py-16 px-8 text-center min-h-[300px]">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center border-2 opacity-60"
                style={{
                  background: cert.accent + "18",
                  borderColor: cert.accent + "40",
                  color: cert.accent,
                }}
              >
                {cert.icon}
              </div>
              <div>
                <p className="font-mono font-bold text-[var(--fg)] text-base mb-2">
                  {cert.title}
                </p>
                <p className="font-mono text-xs text-[var(--muted)] mb-1">
                  {cert.org}
                </p>
                <p className="text-[var(--muted)] text-sm leading-relaxed max-w-sm mt-4">
                  {cert.desc}
                </p>
              </div>
              <a
                href={cert.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                </svg>
                Abrir documento en pestaña nueva
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-5 py-16 px-8 text-center min-h-[300px]">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center border-2 opacity-60"
                style={{
                  background: cert.accent + "18",
                  borderColor: cert.accent + "40",
                  color: cert.accent,
                }}
              >
                {cert.icon}
              </div>
              <div>
                <p className="font-mono font-bold text-[var(--fg)] text-base mb-2">
                  {cert.title}
                </p>
                <p className="font-mono text-xs text-[var(--muted)] mb-1">
                  {cert.org}
                </p>
                <p className="text-[var(--muted)] text-sm leading-relaxed max-w-sm mt-4">
                  {cert.desc}
                </p>
              </div>
              <div className="border border-dashed border-[var(--card-border)] rounded-xl px-6 py-4 bg-[var(--card)]">
                <p className="font-mono text-xs text-[var(--muted)]/60 uppercase tracking-widest">
                  Archivo pendiente de cargar
                </p>
                <p className="font-mono text-xs text-[var(--muted)]/40 mt-1">
                  Reemplaza <code className="text-[var(--primary)]/60">filePath</code>{" "}
                  en certDocs para mostrar el documento
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-[var(--card-border)] bg-[var(--card)] flex-shrink-0">
          <span
            className="font-mono text-xs px-3 py-1 rounded-full border flex items-center gap-1.5"
            style={{
              color: cert.accent,
              background: cert.accent + "14",
              borderColor: cert.accent + "40",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {cert.type}
          </span>

          <div className="flex gap-3">
            {cert.filePath && (
              <a
                href={cert.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Ver documento
              </a>
            )}
            <button
              onClick={handleDownload}
              disabled={!cert.filePath}
              className={`btn-primary ${
                !cert.filePath ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Descargar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Certificaciones Gallery ──────────────────────────────────────────────────
function Certificaciones() {
  const [active, setActive] = useState(0)
  const [modalCert, setModalCert] = useState<CertDoc | null>(null)

  const openModal = (cert: CertDoc) => setModalCert(cert)
  const closeModal = () => setModalCert(null)

  return (
    <>
      <Section id="certificaciones" className="py-24 md:py-32 bg-[var(--bg-alt)] relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-[var(--primary)] tracking-[0.2em] uppercase">
              05
            </span>
            <div className="w-8 h-px bg-[var(--primary)]/40" />
            <span className="font-mono text-xs text-[var(--muted)] tracking-[0.15em] uppercase">
              Certificaciones
            </span>
          </Reveal>

          <Reveal
            delay={50}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6"
          >
            <h2 className="font-mono font-bold text-3xl md:text-4xl text-[var(--fg)] leading-tight">
              Documentos que
              <br />
              <span className="text-[var(--primary)]">respaldan mi perfil.</span>
            </h2>
          </Reveal>

          <Reveal delay={90} className="mb-12">
            <div className="inline-flex items-center gap-2 bg-[var(--accent)]/8 border border-[var(--accent)]/30 rounded-full px-4 py-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              <span className="font-mono text-xs text-[var(--accent)] tracking-widest uppercase font-bold">
                Documentos verificables y respaldados internacionalmente
              </span>
            </div>
          </Reveal>

          <Reveal delay={110}>
            <div className="border-gradient rounded-2xl bg-[var(--card)] p-8 md:p-10 mb-6 transition-all duration-300">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 border-2 transition-all duration-300"
                  style={{
                    background: certDocs[active].accent + "18",
                    borderColor: certDocs[active].accent + "50",
                    color: certDocs[active].accent,
                  }}
                >
                  {certDocs[active].icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span
                      className="font-mono text-xs px-3 py-1 rounded-full border flex items-center gap-1.5"
                      style={{
                        color: certDocs[active].accent,
                        background: certDocs[active].accent + "14",
                        borderColor: certDocs[active].accent + "40",
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {certDocs[active].type}
                    </span>
                    <span className="font-mono text-xs text-[var(--muted)]">
                      {certDocs[active].year}
                    </span>
                  </div>
                  <h3 className="font-mono font-bold text-[var(--fg)] text-xl mb-1">
                    {certDocs[active].title}
                  </h3>
                  <p className="font-mono text-sm text-[var(--muted)] mb-4">
                    {certDocs[active].org}
                  </p>
                  <p className="text-[var(--muted)] leading-relaxed mb-6">
                    {certDocs[active].desc}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      className="btn-primary"
                      onClick={() => openModal(certDocs[active])}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      Ver certificado
                    </button>
                    <button
                      className="btn-outline"
                      onClick={() => openModal(certDocs[active])}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6" />
                      </svg>
                      Ver documento
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {certDocs.map((c, i) => (
              <Reveal key={c.title} delay={i * 40}>
                <button
                  onClick={() => setActive(i)}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-200 group ${
                    active === i
                      ? "border-[var(--primary)]/50 bg-[var(--primary)]/8"
                      : "border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--primary)]/25 hover:bg-[var(--surface)]"
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                    style={{ background: c.accent + "18", color: c.accent }}
                  >
                    {c.icon}
                  </div>
                  <p
                    className={`font-mono text-xs leading-tight font-medium transition-colors ${
                      active === i
                        ? "text-[var(--fg)]"
                        : "text-[var(--muted)] group-hover:text-[var(--fg)]"
                    }`}
                  >
                    {c.title.length > 28 ? c.title.slice(0, 28) + "…" : c.title}
                  </p>
                  <p className="font-mono text-xs text-[var(--muted)]/60 mt-0.5">
                    {c.org}
                  </p>
                  <span
                    className={`mt-2 font-mono text-xs flex items-center gap-1 transition-all duration-200 ${
                      active === i
                        ? "text-[var(--primary)]"
                        : "text-[var(--muted)]/40 group-hover:text-[var(--muted)]"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      openModal(c)
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Ver
                  </span>
                </button>
              </Reveal>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-6">
            {certDocs.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all duration-200 ${
                  active === i
                    ? "w-6 h-1.5 bg-[var(--primary)]"
                    : "w-1.5 h-1.5 bg-[var(--card-border)] hover:bg-[var(--primary)]/40"
                }`}
              />
            ))}
          </div>
        </div>
      </Section>

      {modalCert && <CertModal cert={modalCert} onClose={closeModal} />}
    </>
  )
}

// ─── Logros y Certificaciones (timeline) ─────────────────────────────────────
const certifications = [
  {
    title: "Técnico en Programación de Software",
    org: "SENA",
    year: "2024–2025",
    note: "Título obtenido",
    accent: "#00d4aa",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    title: "Desarrollo de Bases de Datos con SQL",
    org: "SENA",
    year: "2024",
    note: "40 horas",
    accent: "#3b82f6",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
  },
  {
    title: "Introducción a la Ciencia de Datos",
    org: "Cisco Networking Academy / SENA",
    year: "2026",
    note: "Certificado",
    accent: "#8b5cf6",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    title: "Scrum Fundamentals Certified (SFC)",
    org: "SCRUMstudy",
    year: "2026",
    note: "Certificado",
    accent: "#f59e0b",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    title: "Semana de Python en la Práctica",
    org: "Daxus Latam",
    year: "2026",
    note: "8 horas",
    accent: "#06b6d4",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
]

function Logros() {
  return (
    <Section id="logros" className="py-24 md:py-32 bg-[var(--bg-alt)] relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs text-[var(--primary)] tracking-[0.2em] uppercase">
            06
          </span>
          <div className="w-8 h-px bg-[var(--primary)]/40" />
          <span className="font-mono text-xs text-[var(--muted)] tracking-[0.15em] uppercase">
            Logros y certificaciones
          </span>
        </Reveal>

        <Reveal delay={60}>
          <h2 className="font-mono font-bold text-3xl md:text-4xl text-[var(--fg)] leading-tight mb-16">
            Formación que
            <br />
            <span className="text-[var(--primary)]">respalda mi perfil.</span>
          </h2>
        </Reveal>

        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--primary)]/40 via-[var(--card-border)] to-transparent" />

          <div className="space-y-6">
            {certifications.map((c, i) => (
              <Reveal key={c.title} delay={i * 80}>
                <div className="relative flex gap-6 group">
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: c.accent + "18",
                        borderColor: c.accent + "50",
                        color: c.accent,
                      }}
                    >
                      {c.icon}
                    </div>
                  </div>

                  <div className="flex-1 bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5 hover:border-[var(--primary)]/25 transition-all duration-300 hover:bg-[var(--surface)]">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[var(--fg)] text-sm leading-snug">
                          {c.title}
                        </p>
                        <p className="font-mono text-xs text-[var(--muted)] mt-1">
                          {c.org} · {c.year}
                        </p>
                      </div>
                      <span
                        className="font-mono text-xs px-3 py-1 rounded-full border flex-shrink-0 flex items-center gap-1.5"
                        style={{
                          color: c.accent,
                          background: c.accent + "14",
                          borderColor: c.accent + "40",
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {c.note}
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

// ─── Perfil Profesional (CV visual) ──────────────────────────────────────────
function PerfilProfesional() {
  return (
    <Section id="perfil" className="py-24 md:py-32 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs text-[var(--primary)] tracking-[0.2em] uppercase">
            07
          </span>
          <div className="w-8 h-px bg-[var(--primary)]/40" />
          <span className="font-mono text-xs text-[var(--muted)] tracking-[0.15em] uppercase">
            Perfil profesional
          </span>
        </Reveal>

        <Reveal delay={60}>
          <h2 className="font-mono font-bold text-3xl md:text-4xl text-[var(--fg)] leading-tight mt-4 mb-12">
            Un CV visual del
            <br />
            <span className="text-[var(--primary)]">desarrollador que soy.</span>
          </h2>
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-8">
          <Reveal delay={80} className="lg:col-span-1">
            <div className="border-gradient rounded-2xl bg-[var(--card)] p-7 flex flex-col gap-6 h-full">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[var(--primary)]/40 glow-cyan">
                  <img
                    src="/gabriel-photo.png"
                    alt="Gabriel Munera"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <p className="font-mono font-bold text-[var(--fg)] text-base">
                    Gabriel Munera
                  </p>
                  <p className="font-mono text-xs text-[var(--primary)] mt-1 tracking-wide">
                    Frontend Developer
                  </p>
                  <p className="font-mono text-xs text-[var(--muted)] mt-0.5">
                    Colombia
                  </p>
                </div>
              </div>

              <div className="border-t border-[var(--card-border)] pt-5">
                <p className="font-mono text-xs text-[var(--muted)] uppercase tracking-widest mb-3">
                  Resumen
                </p>
                <p className="text-[var(--muted)] text-sm leading-relaxed">
                  Técnico en Programación de Software certificado por el SENA y
                  aprendiz activo del programa ADSO. Me especializo en el{" "}
                  <span className="text-[var(--fg)]">desarrollo frontend</span> y
                  en el uso productivo de{" "}
                  <span className="text-[var(--fg)]">herramientas de IA</span>{" "}
                  (Claude, ChatGPT, Gemini) para acelerar el desarrollo. Mi
                  objetivo es integrarme a un equipo donde pueda aportar,
                  aprender y crecer profesionalmente.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: <MonitorIcon />, val: "Frontend" },
                  { icon: <GradIcon />, val: "SENA · ADSO" },
                  { icon: <RocketIcon />, val: "Disponible" },
                  { icon: <PinIcon />, val: "Colombia" },
                ].map((item) => (
                  <div
                    key={item.val}
                    className="bg-[var(--surface)] border border-[var(--card-border)] rounded-lg p-2.5 flex items-center gap-2 hover:border-[var(--primary)]/30 transition-colors"
                  >
                    <span className="text-[var(--primary)] flex-shrink-0">
                      {item.icon}
                    </span>
                    <p className="text-[var(--fg)] text-xs font-medium leading-tight">
                      {item.val}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <a
                  href="https://www.linkedin.com/in/gabriel-andres-múnera-rocha-205816391"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full justify-center"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Ver en LinkedIn
                </a>
                <a
                  href="/cv-gabriel-munera.pdf"
                  download="CV-Gabriel-Munera.pdf"
                  className="btn-outline w-full justify-center"
                  title="Descargar CV"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Descargar CV
                </a>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-2 space-y-6">
            <Reveal delay={100}>
              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
                <p className="font-mono text-xs text-[var(--muted)] uppercase tracking-widest mb-4">
                  Stack técnico
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "HTML5",
                    "CSS3",
                    "JavaScript",
                    "React",
                    "Tailwind CSS",
                    "Git",
                    "GitHub",
                    "Node.js",
                    "SQL",
                    "Python",
                    "Claude AI",
                    "ChatGPT",
                    "Gemini",
                    "Scrum",
                  ].map((t) => (
                    <span key={t} className="tech-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={140}>
              <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-6">
                <p className="font-mono text-xs text-[var(--muted)] uppercase tracking-widest mb-4">
                  Formación
                </p>
                <div className="space-y-4">
                  {[
                    {
                      title: "Análisis y Desarrollo de Software (ADSO)",
                      place: "SENA",
                      period: "2024 – presente",
                      note: "En curso",
                    },
                    {
                      title: "Técnico en Programación de Software",
                      place: "SENA",
                      period: "2024 – 2025",
                      note: "Título obtenido",
                    },
                  ].map((f) => (
                    <div
                      key={f.title}
                      className="flex items-start justify-between gap-4"
                    >
                      <div>
                        <p className="text-[var(--fg)] text-sm font-semibold">
                          {f.title}
                        </p>
                        <p className="font-mono text-xs text-[var(--muted)] mt-0.5">
                          {f.place} · {f.period}
                        </p>
                      </div>
                      <span className="font-mono text-xs text-[var(--primary)] bg-[var(--primary)]/12 border border-[var(--primary)]/30 px-2 py-0.5 rounded-full flex-shrink-0">
                        {f.note}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  {
                    label: "Enfoque",
                    val: "Interfaces web limpias y accesibles",
                  },
                  {
                    label: "Disponibilidad",
                    val: "Prácticas / Empleo inmediato",
                  },
                  { label: "Metodología", val: "Scrum · Trabajo ágil" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-4 hover:border-[var(--primary)]/25 transition-colors"
                  >
                    <p className="font-mono text-xs text-[var(--muted)] uppercase tracking-widest mb-2">
                      {item.label}
                    </p>
                    <p className="text-[var(--fg)] text-sm font-medium leading-snug">
                      {item.val}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  )
}

// ─── Contacto ─────────────────────────────────────────────────────────────────
function Contacto() {
  const contacts = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      label: "Email",
      value: "gabrielmunerarocha@gmail.com",
      note: "Respondo en 24h",
      accent: "#00d4aa",
      href: "mailto:gabrielmunerarocha@gmail.com?subject=Contacto%20desde%20tu%20portafolio&body=Hola%20Gabriel%2C%0A%0AVi%20tu%20portafolio%20y%20me%20gustar%C3%ADa%20conversar%20sobre...%0A%0A",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      ),
      label: "GitHub",
      value: "github.com/GaboTonoto27",
      note: "Proyectos y código",
      accent: "#d97706",
      href: "https://github.com/GaboTonoto27",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      label: "LinkedIn",
      value: "linkedin.com/in/gabriel-andres-múnera-rocha",
      note: "Red profesional",
      accent: "#2563eb",
      href: "https://www.linkedin.com/in/gabriel-andres-múnera-rocha-205816391",
    },
  ]

  return (
    <Section id="contacto" className="py-24 md:py-32 bg-[var(--bg-alt)] relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs text-[var(--primary)] tracking-[0.2em] uppercase">
            08
          </span>
          <div className="w-8 h-px bg-[var(--primary)]/40" />
          <span className="font-mono text-xs text-[var(--muted)] tracking-[0.15em] uppercase">
            Contacto
          </span>
        </Reveal>

        <div className="max-w-2xl mt-12">
          <Reveal delay={60}>
            <h2 className="font-mono font-bold text-3xl md:text-4xl text-[var(--fg)] leading-tight mb-4">
              ¿Tienes un proyecto
              <br />
              <span className="text-[var(--primary)]">o una oportunidad?</span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-[var(--muted)] leading-relaxed mb-12">
              Estoy abierto a prácticas profesionales, colaboraciones y
              cualquier oportunidad donde pueda aportar y seguir aprendiendo.
              Escríbeme directamente y te responderé lo antes posible.
            </p>
          </Reveal>

          <div className="space-y-4">
            {contacts.map((c, i) => (
              <Reveal key={c.label} delay={i * 70}>
                <a
                  href={c.href}
                  target={c.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="flex items-center gap-5 bg-[var(--card)] border border-[var(--card-border)] rounded-xl p-5 hover:border-[var(--primary)]/30 hover:bg-[var(--primary)]/5 transition-all group"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110 duration-200"
                    style={{ background: c.accent + "18", color: c.accent }}
                  >
                    {c.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-[var(--muted)] uppercase tracking-widest mb-0.5">
                      {c.label}
                    </p>
                    <p className="font-semibold text-[var(--fg)] text-sm truncate">
                      {c.value}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-mono text-xs text-[var(--muted)] hidden sm:block">
                      {c.note}
                    </span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-[var(--muted)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transform transition-all duration-200"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal delay={300} className="mt-8">
            <div className="bg-[var(--primary)]/5 border border-[var(--primary)]/20 rounded-xl p-5 flex items-start gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <div>
                <p className="font-mono text-xs text-[var(--primary)] uppercase tracking-widest mb-1">
                  Tip rápido
                </p>
                <p className="text-[var(--muted)] text-sm leading-relaxed">
                  Al hacer clic en el botón de Email, se abrirá tu cliente de correo con el asunto y el mensaje ya pre-rellenados. Solo tienes que completar los detalles y enviar.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-[var(--card-border)] py-10 relative z-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-[var(--primary)]/40 bg-[var(--primary)]/12 flex items-center justify-center text-[var(--primary)] font-mono font-bold text-sm">
            G
          </div>
          <div>
            <p className="font-mono font-bold text-[var(--fg)] text-sm">
              Gabriel Munera
            </p>
            <p className="font-mono text-xs text-[var(--muted)]">
              Técnico SENA · ADSO · Frontend
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center">
          {[
            { href: "#inicio", label: "Inicio" },
            { href: "#habilidades", label: "Habilidades" },
            { href: "#ia", label: "IA" },
            { href: "#proyectos", label: "Proyectos" },
            { href: "#certificaciones", label: "Certs" },
            { href: "#contacto", label: "Contacto" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-xs text-[var(--muted)] hover:text-[var(--primary)] transition-colors uppercase tracking-widest"
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://github.com/GaboTonoto27"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/gabriel-andres-múnera-rocha-205816391"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
          >
            LinkedIn
          </a>
        </div>

        <p className="font-mono text-xs text-[var(--muted)]/50">© 2026 GM</p>
      </div>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg)", color: "var(--fg)" }}
    >
      <Particles />
      <CustomCursor />
      <Navbar />
      <Hero />
      <SobreMi />
      <Habilidades />
      <HerramientasIA />
      <Proyectos />
      <Certificaciones />
      <Logros />
      <PerfilProfesional />
      <Contacto />
      <Footer />
    </div>
  )
}