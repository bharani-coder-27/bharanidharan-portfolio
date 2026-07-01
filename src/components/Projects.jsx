import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import projectsData from '../data/projects.json'

/* ──────────────────────────────────────────────
   Distinctive per-category jewel-tone themes
────────────────────────────────────────────── */
const THEMES = {
  'AI/LLM':     { from: '#a855f7', to: '#ec4899', c1: '168,85,247',  c2: '236,72,153' },
  'Backend':    { from: '#f59e0b', to: '#fb7185', c1: '245,158,11',  c2: '251,113,133' },
  'Full-Stack': { from: '#2dd4bf', to: '#22d3ee', c1: '45,212,191',  c2: '34,211,238' },
  'Mobile':     { from: '#38bdf8', to: '#818cf8', c1: '56,189,248',  c2: '129,140,248' },
  'DevTools':   { from: '#fb7185', to: '#f472b6', c1: '251,113,133', c2: '244,114,182' },
}
const themeOf = (cat) => THEMES[cat] ?? THEMES['AI/LLM']

/* ── shared bits ── */
function CategoryPill({ theme, children }) {
  return (
    <span
      className="font-mono text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{
        background: `linear-gradient(90deg, rgba(${theme.c1},0.15), rgba(${theme.c2},0.15))`,
        border: `1px solid rgba(${theme.c1},0.4)`,
        color: theme.from,
      }}
    >
      {children}
    </span>
  )
}

function TechTag({ children }) {
  return (
    <span
      className="font-mono text-[10px] px-2 py-0.5 rounded"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.09)',
        color: '#cbd5e1',
      }}
    >
      {children}
    </span>
  )
}

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
)

/* ──────────────────────────────────────────────
   Grid card — glassy, 3D tilt on pointer
────────────────────────────────────────────── */
function GridCard({ project, index, inView, onOpen }) {
  const theme = themeOf(project.category)
  const ref = useRef(null)
  const [t, setT] = useState({ rx: 0, ry: 0, mx: 50, my: 50, on: false })

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    setT({ rx: (0.5 - py) * 9, ry: (px - 0.5) * 11, mx: px * 100, my: py * 100, on: true })
  }
  const onLeave = () => setT((s) => ({ ...s, rx: 0, ry: 0, on: false }))

  return (
    <div style={{ perspective: 900 }} className="h-full">
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={onOpen}
        initial={{ opacity: 0, y: 22 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-full rounded-2xl overflow-hidden cursor-pointer flex flex-col"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg) translateZ(0)`,
          transition: 'transform 0.2s ease, box-shadow 0.3s ease, border-color 0.25s ease',
          background: 'linear-gradient(160deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02))',
          border: `1px solid rgba(${t.on ? theme.c1 : '255,255,255'}, ${t.on ? 0.42 : 0.08})`,
          boxShadow: t.on
            ? `0 24px 55px rgba(${theme.c1},0.20), 0 0 0 1px rgba(${theme.c1},0.15)`
            : '0 8px 30px rgba(0,0,0,0.3)',
        }}
      >
        {/* pointer spotlight */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: t.on ? 1 : 0,
            transition: 'opacity 0.2s ease',
            background: `radial-gradient(420px circle at ${t.mx}% ${t.my}%, rgba(${theme.c1},0.16), transparent 60%)`,
          }}
        />
        {/* gradient top edge */}
        <div className="h-1 w-full shrink-0" style={{ background: `linear-gradient(90deg, ${theme.from}, ${theme.to})` }} />

        <div className="relative p-5 flex flex-col flex-1" style={{ transform: 'translateZ(30px)' }}>
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <CategoryPill theme={theme}>{project.category}</CategoryPill>
              {project.featured && (
                <span className="font-mono text-[10px]" style={{ color: theme.to }}>★</span>
              )}
            </div>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 p-1.5 rounded-md text-text-muted hover:text-white hover:bg-white/10 transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <h3 className="text-[15px] font-semibold leading-snug mb-2 text-white/95">{project.title}</h3>
          <p className="text-xs text-text-secondary leading-relaxed line-clamp-4 mb-3">{project.description}</p>

          <div className="flex-1" />

          <div className="pt-3 border-t border-white/5">
            <div className="flex flex-wrap gap-1 mb-2.5">
              {project.techStack.slice(0, 4).map((x) => <TechTag key={x}>{x}</TechTag>)}
              {project.techStack.length > 4 && (
                <span className="font-mono text-[10px] text-text-muted self-center">+{project.techStack.length - 4}</span>
              )}
            </div>
            <span className="font-mono text-[10px] inline-flex items-center gap-1" style={{ color: t.on ? theme.from : 'rgba(148,163,184,0.5)', transition: 'color .2s' }}>
              open project <span>↗</span>
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ──────────────────────────────────────────────
   Expanded card body (fixed size, scrolls inside)
────────────────────────────────────────────── */
function ExpandedBody({ project, theme, isActive }) {
  return (
    <>
      <div className="h-1 w-full shrink-0" style={{ background: `linear-gradient(90deg, ${theme.from}, ${theme.to})` }} />
      <div
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: isActive ? 'thin' : 'none', scrollbarColor: `rgba(${theme.c1},0.5) transparent`, touchAction: 'pan-y' }}
      >
        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <CategoryPill theme={theme}>{project.category}</CategoryPill>
            {project.featured && <span className="font-mono text-[10px]" style={{ color: theme.to }}>★ Featured</span>}
            {project.status && (
              <span className="font-mono text-[10px] text-text-muted border border-white/10 px-2 py-0.5 rounded-full">{project.status}</span>
            )}
          </div>

          <h2 className="text-lg sm:text-2xl font-bold text-white mb-4 leading-tight">{project.title}</h2>

          {isActive && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 font-mono text-xs px-3.5 py-2 rounded-lg border border-white/12 text-text-secondary hover:text-white hover:bg-white/5 transition-all">
                  <GithubIcon className="w-3.5 h-3.5" /> GitHub
                </a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 font-mono text-xs px-3.5 py-2 rounded-lg transition-all"
                  style={{ border: `1px solid rgba(${theme.c1},0.4)`, color: theme.from }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Live Demo
                </a>
              )}
            </div>
          )}

          <div className="h-px bg-white/5 mb-4" />

          <p className="text-sm text-text-secondary leading-relaxed mb-5">
            {isActive ? project.longDescription : project.description}
          </p>

          {isActive && project.bullets?.length > 0 && (
            <div className="mb-5">
              <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-3">Key Highlights</p>
              <ul className="space-y-2.5">
                {project.bullets.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed">
                    <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full" style={{ background: theme.from, boxShadow: `0 0 8px ${theme.from}` }} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-2.5">Tech Stack</p>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((x) => <TechTag key={x}>{x}</TechTag>)}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/* ──────────────────────────────────────────────
   3D coverflow stage — fixed-size cards, swipe nav
────────────────────────────────────────────── */
function ExpandedStage({ projects, index, isMobile, onClose, onNavigate }) {
  const rootRef = useRef(null)
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const touch = useRef(null)
  const mouse = useRef(null)
  const dragged = useRef(false)
  const armed = useRef(false)
  const lock = useRef(false)
  const lockTimer = useRef(null)

  const hasPrev = index > 0
  const hasNext = index < projects.length - 1

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setW(el.offsetWidth))
    ro.observe(el)
    setW(el.offsetWidth)
    return () => ro.disconnect()
  }, [])

  // arm the "scroll-down to collapse" gesture only after settling in
  useEffect(() => {
    armed.current = false
    const id = setTimeout(() => { armed.current = true }, 650)
    return () => clearTimeout(id)
  }, [])

  const navigate = useCallback((next) => {
    if (next < 0 || next > projects.length - 1) return
    onNavigate(next)
  }, [projects.length, onNavigate])

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft' && hasPrev) navigate(index - 1)
      else if (e.key === 'ArrowRight' && hasNext) navigate(index + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, hasPrev, hasNext, navigate, onClose])

  // wheel: horizontal → navigate, downward → collapse
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const onWheel = (e) => {
      if (lock.current) return
      if (armed.current && e.deltaY > 24 && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        onClose()
        return
      }
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 14) {
        lock.current = true
        lockTimer.current = setTimeout(() => { lock.current = false }, 620)
        if (e.deltaX > 0) navigate(index + 1)
        else navigate(index - 1)
      }
    }
    el.addEventListener('wheel', onWheel, { passive: true })
    return () => { el.removeEventListener('wheel', onWheel); clearTimeout(lockTimer.current) }
  }, [index, navigate, onClose])

  const CARD_W = isMobile ? Math.min(w * 0.84, 400) : Math.min(720, Math.max(420, w * 0.6))
  const CARD_H = isMobile
    ? Math.min((typeof window !== 'undefined' ? window.innerHeight : 800) * 0.6, 500)
    : Math.min((typeof window !== 'undefined' ? window.innerHeight : 800) * 0.64, 560)
  const STEP = isMobile ? CARD_W * 0.9 : CARD_W * 0.56

  const gesture = (dx, dy) => {
    const adx = Math.abs(dx), ady = Math.abs(dy)
    if (adx > 44 && adx > ady) {
      if (dx > 0 && hasNext) navigate(index + 1)
      else if (dx < 0 && hasPrev) navigate(index - 1)
    } else if (dy < -60 && ady > adx) {
      onClose()
    }
  }

  return (
    <div
      ref={rootRef}
      className="relative select-none"
      style={{ perspective: 1700 }}
      onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY } }}
      onTouchEnd={(e) => {
        if (!touch.current) return
        gesture(touch.current.x - e.changedTouches[0].clientX, touch.current.y - e.changedTouches[0].clientY)
        touch.current = null
      }}
      onMouseDown={(e) => { mouse.current = { x: e.clientX, y: e.clientY }; dragged.current = false }}
      onMouseMove={(e) => { if (mouse.current && Math.abs(mouse.current.x - e.clientX) > 5) dragged.current = true }}
      onMouseUp={(e) => {
        if (!mouse.current) return
        gesture(mouse.current.x - e.clientX, mouse.current.y - e.clientY)
        mouse.current = null
      }}
    >
      {/* top bar */}
      <div className="flex items-center justify-between mb-4 px-1">
        <p className="font-mono text-xs">
          <span className="text-white font-semibold">{String(index + 1).padStart(2, '0')}</span>
          <span className="text-text-muted"> / {String(projects.length).padStart(2, '0')}</span>
        </p>
        <div className="flex items-center gap-3">
          <p className="hidden sm:block font-mono text-[10px] text-text-muted opacity-40">← swipe · scroll ↓ to close</p>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 text-text-muted hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* coverflow */}
      <div className="relative flex items-center justify-center overflow-hidden" style={{ height: CARD_H }}>
        <div style={{ position: 'relative', width: CARD_W, height: '100%' }}>
          {projects.map((project, i) => {
            const offset = i - index
            if (Math.abs(offset) > 2) return null
            const isActive = offset === 0
            const isNear = Math.abs(offset) === 1
            const theme = themeOf(project.category)

            return (
              <motion.div
                key={project.id}
                className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col"
                style={{
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'center center',
                  zIndex: isActive ? 10 : Math.max(1, 8 - Math.abs(offset)),
                  cursor: isNear ? 'pointer' : 'default',
                  background: 'rgba(9,9,16,0.96)',
                  border: `1px solid rgba(${theme.c1}, ${isActive ? 0.5 : 0.25})`,
                  boxShadow: isActive
                    ? `0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(${theme.c1},0.14), 0 0 0 1px rgba(${theme.c1},0.25)`
                    : '0 10px 30px rgba(0,0,0,0.5)',
                }}
                animate={{
                  x: offset * STEP,
                  rotateY: offset * -34,
                  scale: isActive ? 1 : isNear ? 0.82 : 0.66,
                  opacity: isActive ? 1 : isNear ? 0.6 : 0,
                  filter: isActive ? 'blur(0px)' : 'blur(2px)',
                }}
                transition={{ type: 'spring', stiffness: 240, damping: 30 }}
                onClick={() => isNear && !dragged.current && navigate(i)}
              >
                {/* dim overlay on neighbors */}
                {!isActive && <div className="absolute inset-0 z-20 bg-black/40 pointer-events-none" />}
                <ExpandedBody project={project} theme={theme} isActive={isActive} />
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* dots */}
      <div className="flex items-center justify-center gap-1.5 mt-5">
        {projects.map((p, i) => {
          const th = themeOf(p.category)
          const on = i === index
          return (
            <motion.button
              key={i}
              onClick={() => navigate(i)}
              className="h-1.5 rounded-full"
              style={{ background: on ? th.from : 'rgba(255,255,255,0.2)' }}
              animate={{ width: on ? 22 : 6 }}
              transition={{ duration: 0.25 }}
            />
          )
        })}
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────
   Main section
────────────────────────────────────────────── */
const allCategories = ['All', ...new Set(projectsData.map((p) => p.category))]

export default function Projects() {
  const stageRef = useRef(null)
  const [inView, setInView] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [mode, setMode] = useState('grid') // 'grid' | 'expanded'
  const [index, setIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const scrollRef = useRef(null)
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  const filtered =
    activeCategory === 'All' ? projectsData : projectsData.filter((p) => p.category === activeCategory)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // observe only to drive entrance animations
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const openCard = (i) => { setIndex(i); setMode('expanded') }
  const collapse = () => setMode('grid')

  const CARD_W = 320
  const scrollBy = (dir) => scrollRef.current?.scrollBy({ left: dir * (CARD_W + 16), behavior: 'smooth' })

  return (
    <section id="projects" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* header */}
        <div className="mb-9 text-center">
          <motion.p className="section-heading" initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ duration: 0.5 }}>
            03. Projects
          </motion.p>
          <motion.h2 className="section-title" initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
            Things I&apos;ve Built
          </motion.h2>
          <motion.div
            className="h-0.5 mx-auto rounded-full mb-7"
            style={{ background: 'linear-gradient(90deg, #a855f7, #22d3ee, #fb7185)' }}
            initial={{ width: 0 }}
            animate={inView ? { width: 72 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

        {/* filter tabs */}
        <AnimatePresence mode="wait">
          {mode === 'grid' && (
            <motion.div
              key="tabs"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="flex flex-wrap items-center justify-center gap-2 mb-8"
            >
              {allCategories.map((cat) => {
                const on = activeCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setIndex(0) }}
                    className="font-mono text-xs px-4 py-1.5 rounded-full border transition-all duration-200"
                    style={
                      on
                        ? { borderColor: 'rgba(168,85,247,0.5)', background: 'rgba(168,85,247,0.12)', color: '#c084fc' }
                        : { borderColor: 'rgba(255,255,255,0.1)', color: '#64748b' }
                    }
                  >
                    {cat}
                  </button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* stage — stable height so auto-expand doesn't jump the page */}
        <div
          ref={stageRef}
          style={{ minHeight: mode === 'expanded' ? (isMobile ? 560 : 640) : undefined }}
          className="flex flex-col justify-center"
        >
          <AnimatePresence mode="wait">
            {mode === 'grid' ? (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
                <div className="relative">
                  <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none bg-gradient-to-l from-[#0a0a0f] to-transparent" />
                  <div
                    ref={scrollRef}
                    onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; touchStartY.current = e.touches[0].clientY }}
                    onTouchEnd={(e) => {
                      if (touchStartX.current === null) return
                      const dx = touchStartX.current - e.changedTouches[0].clientX
                      const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY)
                      if (Math.abs(dx) > 40 && dy < Math.abs(dx)) scrollBy(dx > 0 ? 1 : -1)
                      touchStartX.current = null
                    }}
                    className="flex gap-4 overflow-x-auto py-3"
                    style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none', paddingLeft: '4px', paddingRight: '32px' }}
                  >
                    {filtered.map((project, i) => (
                      <motion.div
                        key={project.id}
                        whileHover={{ scale: 1.02 }}
                        className="shrink-0"
                        style={{ width: `min(${CARD_W}px, calc(100vw - 56px))`, height: 320, scrollSnapAlign: 'start' }}
                      >
                        <GridCard project={project} index={i} inView={inView} onOpen={() => openCard(i)} />
                      </motion.div>
                    ))}
                  </div>

                  <div className="hidden sm:flex items-center justify-center gap-3 mt-6">
                    <motion.button onClick={() => scrollBy(-1)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      className="p-2.5 rounded-full border border-white/10 text-text-muted hover:border-accent-purple/40 hover:text-accent-purple hover:bg-accent-purple/5 transition-all">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </motion.button>
                    <span className="font-mono text-xs text-text-muted opacity-40">{filtered.length} projects · tap to expand</span>
                    <motion.button onClick={() => scrollBy(1)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      className="p-2.5 rounded-full border border-white/10 text-text-muted hover:border-accent-purple/40 hover:text-accent-purple hover:bg-accent-purple/5 transition-all">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  </div>
                  <p className="sm:hidden text-center font-mono text-[10px] text-text-muted opacity-40 mt-3">swipe to explore · tap to expand</p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="expanded" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.28 }}>
                <ExpandedStage
                  projects={filtered}
                  index={Math.min(index, filtered.length - 1)}
                  isMobile={isMobile}
                  onClose={collapse}
                  onNavigate={setIndex}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
