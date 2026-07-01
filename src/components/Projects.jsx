import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import projectsData from '../data/projects.json'

const categoryColors = {
  'AI/LLM':     'cyan',
  'Backend':    'purple',
  'Full-Stack': 'green',
  'Mobile':     'purple',
  'DevTools':   'green',
}

const accentBar = {
  cyan:   'bg-gradient-to-r from-accent-cyan to-accent-purple',
  purple: 'bg-gradient-to-r from-accent-purple to-accent-pink',
  green:  'bg-gradient-to-r from-accent-green to-accent-cyan',
}

const glowBorder = {
  cyan:   'rgba(0,212,255,0.4)',
  purple: 'rgba(139,92,246,0.4)',
  green:  'rgba(52,211,153,0.4)',
}

const spotlightColor = {
  cyan:   'rgba(0,212,255,0.09)',
  purple: 'rgba(139,92,246,0.10)',
  green:  'rgba(52,211,153,0.09)',
}

const glowShadow = {
  cyan:   '0 0 0 1px rgba(0,212,255,0.2), 0 8px 40px rgba(0,212,255,0.1)',
  purple: '0 0 0 1px rgba(139,92,246,0.2), 0 8px 40px rgba(139,92,246,0.1)',
  green:  '0 0 0 1px rgba(52,211,153,0.2), 0 8px 40px rgba(52,211,153,0.1)',
}

/* ──────────────────────────────────────────────
   Expanded in-section 3D coverflow
   Not fullscreen — lives inside the Projects section
────────────────────────────────────────────── */
function ExpandedView({ projects, selectedIndex, onClose, onNavigate }) {
  const containerRef = useRef(null)
  const [containerW, setContainerW] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  )
  const touchRef    = useRef(null)
  const mouseRef    = useRef(null)
  const dragged     = useRef(false)
  const wheelTimer  = useRef(null)
  const wheelLocked = useRef(false)
  const rootRef     = useRef(null)

  const hasPrev = selectedIndex > 0
  const hasNext = selectedIndex < projects.length - 1

  /* measure carousel width */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setContainerW(el.offsetWidth))
    ro.observe(el)
    setContainerW(el.offsetWidth)
    return () => ro.disconnect()
  }, [])

  /* keyboard nav */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft'  && hasPrev) onNavigate(selectedIndex - 1)
      if (e.key === 'ArrowRight' && hasNext)  onNavigate(selectedIndex + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onNavigate, selectedIndex, hasPrev, hasNext])

  /* wheel: horizontal → navigate cards, vertical down → collapse */
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const onWheel = (e) => {
      if (wheelLocked.current) return
      /* scroll down → collapse back to grid */
      if (e.deltaY > 25 && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        wheelLocked.current = true
        wheelTimer.current = setTimeout(() => { wheelLocked.current = false }, 700)
        onClose()
        return
      }
      /* horizontal trackpad swipe → navigate */
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 14) {
        wheelLocked.current = true
        wheelTimer.current = setTimeout(() => { wheelLocked.current = false }, 650)
        if (e.deltaX > 0 && hasNext) onNavigate(selectedIndex + 1)
        else if (e.deltaX < 0 && hasPrev) onNavigate(selectedIndex - 1)
      }
    }
    el.addEventListener('wheel', onWheel, { passive: true })
    return () => {
      el.removeEventListener('wheel', onWheel)
      clearTimeout(wheelTimer.current)
    }
  }, [selectedIndex, hasPrev, hasNext, onNavigate, onClose])

  const CARD_W = Math.min(400, containerW - 72)
  const STEP_X = Math.round(CARD_W * 0.44)

  /* touch + mouse: horizontal → navigate, downward swipe → collapse */
  const tryGesture = (dx, dy) => {
    const adx = Math.abs(dx), ady = Math.abs(dy)
    if (adx > 44 && adx > ady) {
      if (dx > 0 && hasPrev) onNavigate(selectedIndex - 1)
      else if (dx < 0 && hasNext) onNavigate(selectedIndex + 1)
    } else if (dy < -55 && ady > adx) {
      /* finger moved down → collapse */
      onClose()
    }
  }

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 180, damping: 26 }}
      className="relative rounded-2xl overflow-hidden select-none"
      style={{ height: 'min(500px, 64vh)' }}
      onTouchStart={(e) => {
        touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }}
      onTouchEnd={(e) => {
        if (!touchRef.current) return
        tryGesture(
          touchRef.current.x - e.changedTouches[0].clientX,
          touchRef.current.y - e.changedTouches[0].clientY,
        )
        touchRef.current = null
      }}
      onMouseDown={(e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; dragged.current = false }}
      onMouseMove={(e) => {
        if (mouseRef.current && Math.abs(mouseRef.current.x - e.clientX) > 5) dragged.current = true
      }}
      onMouseUp={(e) => {
        if (!mouseRef.current) return
        tryGesture(mouseRef.current.x - e.clientX, mouseRef.current.y - e.clientY)
        mouseRef.current = null
      }}
    >
      {/* dark glass backdrop */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'rgba(6,6,14,0.9)',
          backdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      />

      {/* top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-4 pb-1">
        <div className="flex items-center gap-3">
          <p className="font-mono text-xs">
            <span className="text-white font-semibold">{selectedIndex + 1}</span>
            <span className="text-text-muted"> / {projects.length}</span>
          </p>
          <p className="hidden sm:block font-mono text-[10px] text-text-muted opacity-40">
            ← swipe or drag →
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-mono text-[10px] text-text-muted opacity-35">↓ scroll to exit</p>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            className="w-7 h-7 flex items-center justify-center rounded-full border border-white/10 text-text-muted hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* 3D carousel — perspective on parent, rotateY on children */}
      <div
        ref={containerRef}
        className="absolute inset-x-0 flex items-center justify-center overflow-hidden"
        style={{ top: 52, bottom: 48, perspective: '1100px' }}
      >
        <div style={{ position: 'relative', width: CARD_W, height: '100%' }}>
          {projects.map((project, i) => {
            const offset   = i - selectedIndex
            const isActive = offset === 0
            const isNear   = Math.abs(offset) === 1
            const color    = categoryColors[project.category] ?? 'cyan'

            if (Math.abs(offset) > 2) return null

            return (
              <motion.div
                key={project.id}
                className="absolute inset-0 rounded-xl overflow-hidden flex flex-col"
                style={{
                  background: 'rgba(10,10,18,0.99)',
                  border: `1px solid ${glowBorder[color]}`,
                  zIndex: isActive ? 10 : Math.max(1, 10 - Math.abs(offset) * 3),
                  transformOrigin: 'center center',
                  cursor: isNear ? 'pointer' : 'default',
                  boxShadow: isActive
                    ? `0 16px 60px rgba(0,0,0,0.6), 0 0 0 1px ${glowBorder[color]}, 0 0 40px ${glowBorder[color].replace('0.4', '0.08')}`
                    : '0 4px 20px rgba(0,0,0,0.4)',
                }}
                animate={{
                  x:       offset * STEP_X,
                  rotateY: offset * -30,
                  scale:   isActive ? 1 : isNear ? 0.84 : 0.68,
                  opacity: isActive ? 1 : isNear ? 0.68 : 0,
                  filter:  isActive ? 'blur(0px)' : 'blur(1.5px)',
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                onClick={() => isNear && !dragged.current && onNavigate(i)}
              >
                <div className={`h-0.5 shrink-0 ${accentBar[color]}`} />

                <div
                  className="flex-1 overflow-y-auto"
                  style={{
                    scrollbarWidth: isActive ? 'thin' : 'none',
                    scrollbarColor: `${glowBorder[color]} transparent`,
                    touchAction: 'pan-y',
                  }}
                >
                  <div className="p-4 sm:p-5">
                    {/* badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-2.5">
                      <span className={`tag text-[10px] ${color === 'purple' ? 'tag-purple' : color === 'green' ? 'tag-green' : ''}`}>
                        {project.category}
                      </span>
                      {project.featured && <span className="font-mono text-[10px] text-accent-green">★ Featured</span>}
                      {project.status && (
                        <span className="font-mono text-[10px] text-text-muted border border-white/10 px-2 py-0.5 rounded-full">
                          {project.status}
                        </span>
                      )}
                    </div>

                    <h2 className="text-sm sm:text-base font-bold text-white mb-3 leading-snug">
                      {project.title}
                    </h2>

                    {/* links — active card only */}
                    {isActive && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 font-mono text-[11px] px-3 py-1.5 rounded-lg border border-white/10 text-text-secondary hover:text-white hover:bg-white/5 transition-all">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                            </svg>
                            GitHub
                          </a>
                        )}
                        {project.demo && (
                          <a href={project.demo} target="_blank" rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 font-mono text-[11px] px-3 py-1.5 rounded-lg border border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan/10 transition-all">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Live
                          </a>
                        )}
                      </div>
                    )}

                    {isActive && <div className="h-px bg-white/5 mb-3" />}

                    <p className={`text-xs text-text-secondary leading-relaxed ${isActive ? 'mb-4' : 'mb-2 line-clamp-3'}`}>
                      {isActive ? project.longDescription : project.description}
                    </p>

                    {isActive && project.bullets?.length > 0 && (
                      <div className="mb-4">
                        <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-2">Key Highlights</p>
                        <ul className="space-y-2">
                          {project.bullets.map((b, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-text-secondary">
                              <span className="shrink-0 mt-[6px] w-1 h-1 rounded-full" style={{ background: glowBorder[color] }} />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      {isActive && <p className="font-mono text-[10px] text-text-muted uppercase tracking-widest mb-2">Tech Stack</p>}
                      <div className="flex flex-wrap gap-1">
                        {(isActive ? project.techStack : project.techStack.slice(0, 3)).map((t) => (
                          <span key={t} className="tag text-[10px]">{t}</span>
                        ))}
                        {!isActive && project.techStack.length > 3 && (
                          <span className="font-mono text-[10px] text-text-muted">+{project.techStack.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* dot indicators */}
      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
        {projects.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => onNavigate(i)}
            className={`h-1.5 rounded-full transition-colors ${i === selectedIndex ? 'bg-accent-cyan' : 'bg-white/20 hover:bg-white/40'}`}
            animate={{ width: i === selectedIndex ? 18 : 5 }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  )
}

/* ────────────────────────────────
   Grid card (normal lineup)
──────────────────────────────── */
function ProjectCard({ project, onClick }) {
  const [spot, setSpot] = useState({ x: 0, y: 0, on: false })
  const ref   = useRef(null)
  const color = categoryColors[project.category] ?? 'cyan'

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        if (!ref.current) return
        const r = ref.current.getBoundingClientRect()
        setSpot({ x: e.clientX - r.left, y: e.clientY - r.top, on: true })
      }}
      onMouseLeave={() => setSpot((s) => ({ ...s, on: false }))}
      onClick={onClick}
      className="relative rounded-xl overflow-hidden flex flex-col h-full cursor-pointer"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${spot.on ? glowBorder[color] : 'rgba(255,255,255,0.07)'}`,
        boxShadow: spot.on ? glowShadow[color] : '0 4px 20px rgba(0,0,0,0.2)',
        transition: 'border-color 0.25s ease, box-shadow 0.3s ease',
      }}
    >
      {/* cursor spotlight */}
      <div
        className="pointer-events-none absolute inset-0 z-0 rounded-xl"
        style={{
          opacity: spot.on ? 1 : 0,
          transition: 'opacity 0.18s ease',
          background: `radial-gradient(240px circle at ${spot.x}px ${spot.y}px, ${spotlightColor[color]}, transparent 65%)`,
        }}
      />

      <div className={`h-0.5 shrink-0 relative z-10 ${accentBar[color]}`} />

      <div className="p-5 flex flex-col flex-1 relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0 flex-1 pr-2">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`tag text-[10px] ${color === 'purple' ? 'tag-purple' : color === 'green' ? 'tag-green' : ''}`}>
                {project.category}
              </span>
              {project.featured && <span className="font-mono text-[10px] text-accent-green">★</span>}
            </div>
            <h3
              className="text-sm font-semibold leading-snug transition-colors duration-200"
              style={{ color: spot.on ? '#fff' : '#e2e8f0' }}
            >
              {project.title}
            </h3>
          </div>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 p-1.5 rounded-md text-text-muted hover:text-white hover:bg-white/10 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          )}
        </div>

        <p className="text-xs text-text-secondary leading-relaxed line-clamp-4 mb-3">
          {project.description}
        </p>

        <div className="flex-1" />

        <div className="pt-3 border-t border-white/5">
          <div className="flex flex-wrap gap-1 mb-2">
            {project.techStack.slice(0, 4).map((t) => (
              <span key={t} className="tag text-[10px]">{t}</span>
            ))}
            {project.techStack.length > 4 && (
              <span className="font-mono text-[10px] text-text-muted self-center">+{project.techStack.length - 4}</span>
            )}
          </div>
          <span
            className="font-mono text-[10px] transition-colors duration-200"
            style={{ color: spot.on ? glowBorder[color] : 'rgba(148,163,184,0.45)' }}
          >
            tap to expand ↗
          </span>
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────
   Main section
──────────────────────────────── */
const allCategories = ['All', ...new Set(projectsData.map((p) => p.category))]

export default function Projects() {
  const [sectionRef, inView]            = useInView()
  const [activeCategory, setActiveCategory] = useState('All')
  const [expandedIndex, setExpandedIndex]   = useState(null)
  const scrollRef   = useRef(null)
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  const filtered =
    activeCategory === 'All'
      ? projectsData
      : projectsData.filter((p) => p.category === activeCategory)

  const CARD_W = 320

  const scrollBy = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * (CARD_W + 16), behavior: 'smooth' })
  }

  const collapse = () => setExpandedIndex(null)

  return (
    <section id="projects" className="py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* section header */}
          <div className="mb-10 text-center">
            <p className="section-heading">03. Projects</p>
            <h2 className="section-title">Things I&apos;ve Built</h2>
            <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-accent-cyan to-accent-purple rounded-full mb-8" />
          </div>

          {/* filter tabs — always visible */}
          <AnimatePresence mode="wait">
            {expandedIndex === null && (
              <motion.div
                key="tabs"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="flex flex-wrap items-center justify-center gap-2 mb-8"
              >
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`font-mono text-xs px-4 py-1.5 rounded-full border transition-all duration-200 ${
                      activeCategory === cat
                        ? 'border-accent-cyan/50 bg-accent-cyan/10 text-accent-cyan'
                        : 'border-white/10 text-text-muted hover:border-white/20 hover:text-text-secondary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* view switcher */}
          <AnimatePresence mode="wait">
            {expandedIndex === null ? (
              /* ── grid / scroll row ── */
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28 }}
              >
                <div className="relative">
                  {/* right edge fade only — left edge removed so first card is fully visible */}
                  <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none bg-gradient-to-l from-[#0a0a0f] to-transparent" />

                  <div
                    ref={scrollRef}
                    onTouchStart={(e) => {
                      touchStartX.current = e.touches[0].clientX
                      touchStartY.current = e.touches[0].clientY
                    }}
                    onTouchEnd={(e) => {
                      if (touchStartX.current === null) return
                      const dx = touchStartX.current - e.changedTouches[0].clientX
                      const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY)
                      if (Math.abs(dx) > 40 && dy < Math.abs(dx)) scrollBy(dx > 0 ? 1 : -1)
                      touchStartX.current = null
                    }}
                    className="flex gap-4 overflow-x-auto pb-2"
                    style={{
                      scrollSnapType: 'x mandatory',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      /* left padding equals section padding so first card is flush */
                      paddingLeft: '4px',
                      paddingRight: '32px',
                    }}
                  >
                    {filtered.map((project, i) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: i * 0.07, duration: 0.5 }}
                        className="shrink-0"
                        style={{
                          width: `min(${CARD_W}px, calc(100vw - 56px))`,
                          height: 300,
                          scrollSnapAlign: 'start',
                        }}
                      >
                        <ProjectCard project={project} onClick={() => setExpandedIndex(i)} />
                      </motion.div>
                    ))}
                  </div>

                  <div className="hidden sm:flex items-center justify-center gap-3 mt-6">
                    <motion.button
                      onClick={() => scrollBy(-1)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2.5 rounded-full border border-white/10 text-text-muted hover:border-accent-cyan/40 hover:text-accent-cyan hover:bg-accent-cyan/5 transition-all"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </motion.button>
                    <span className="font-mono text-xs text-text-muted opacity-40">
                      {filtered.length} projects · tap card to expand
                    </span>
                    <motion.button
                      onClick={() => scrollBy(1)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2.5 rounded-full border border-white/10 text-text-muted hover:border-accent-cyan/40 hover:text-accent-cyan hover:bg-accent-cyan/5 transition-all"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  </div>

                  <p className="sm:hidden text-center font-mono text-[10px] text-text-muted opacity-40 mt-3">
                    swipe to explore · tap to expand
                  </p>
                </div>
              </motion.div>
            ) : (
              /* ── expanded in-section carousel ── */
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ExpandedView
                  projects={filtered}
                  selectedIndex={expandedIndex}
                  onClose={collapse}
                  onNavigate={setExpandedIndex}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
