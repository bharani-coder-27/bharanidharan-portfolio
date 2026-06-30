import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import projectsData from '../data/projects.json'

const CARD_W = 360
const CARD_GAP = 20

const categoryColors = {
  'AI/LLM': 'cyan',
  Backend: 'purple',
  'Full-Stack': 'green',
  Mobile: 'purple',
  DevTools: 'green',
}

const accentBar = {
  cyan: 'bg-gradient-to-r from-accent-cyan to-accent-purple',
  purple: 'bg-gradient-to-r from-accent-purple to-accent-pink',
  green: 'bg-gradient-to-r from-accent-green to-accent-cyan',
}

const spotlightColor = {
  cyan: 'rgba(0,212,255,0.07)',
  purple: 'rgba(139,92,246,0.08)',
  green: 'rgba(52,211,153,0.07)',
}

const borderColor = {
  cyan: 'rgba(0,212,255,0.25)',
  purple: 'rgba(139,92,246,0.25)',
  green: 'rgba(52,211,153,0.25)',
}

function ProjectCard({ project, isActive }) {
  const [expanded, setExpanded] = useState(false)
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, visible: false })
  const cardRef = useRef(null)
  const color = categoryColors[project.category] ?? 'cyan'

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setSpotlight((s) => ({ ...s, visible: false }))
  }, [])

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={isActive ? { y: -6 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="relative rounded-xl overflow-hidden flex flex-col h-full cursor-default"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${isActive && spotlight.visible ? borderColor[color] : 'rgba(255,255,255,0.06)'}`,
        transition: 'border-color 0.3s ease',
        boxShadow: isActive && spotlight.visible
          ? `0 0 40px ${spotlightColor[color]}, 0 20px 60px rgba(0,0,0,0.4)`
          : '0 4px 24px rgba(0,0,0,0.2)',
      }}
    >
      {/* Cursor spotlight glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-200 z-0"
        style={{
          opacity: spotlight.visible ? 1 : 0,
          background: `radial-gradient(320px circle at ${spotlight.x}px ${spotlight.y}px, ${spotlightColor[color]}, transparent 65%)`,
        }}
      />

      {/* Top accent bar */}
      <div className={`h-0.5 shrink-0 relative z-10 ${accentBar[color]}`} />

      <div className="p-6 flex flex-col flex-1 relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`tag ${color === 'purple' ? 'tag-purple' : color === 'green' ? 'tag-green' : ''}`}
              >
                {project.category}
              </span>
              {project.featured && (
                <span className="font-mono text-xs text-accent-green">★ Featured</span>
              )}
            </div>
            <h3
              className={`text-base font-semibold leading-snug transition-colors duration-300 ${
                spotlight.visible ? `text-white` : 'text-text-primary'
              }`}
            >
              {project.title}
            </h3>
          </div>

          <div className="flex items-center gap-1.5 ml-3 shrink-0">
            {project.github && (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-md text-text-muted hover:text-white hover:bg-white/10 transition-colors duration-150"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </motion.a>
            )}
            {project.demo && (
              <motion.a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Live demo"
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-md text-text-muted hover:text-accent-cyan hover:bg-accent-cyan/10 transition-colors duration-150"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </motion.a>
            )}
          </div>
        </div>

        <p className="text-sm text-text-secondary mb-4 leading-relaxed">{project.description}</p>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mb-4 overflow-hidden"
            >
              <div className="border-t border-white/5 pt-4">
                <p className="text-xs text-text-muted mb-3 leading-relaxed">{project.longDescription}</p>
                <ul className="space-y-1.5">
                  {project.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                      <span className="text-accent-cyan shrink-0 mt-0.5">▹</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-auto pt-4 border-t border-white/5">
          <div className="flex flex-wrap gap-1 mb-3">
            {project.techStack.slice(0, 5).map((tech) => (
              <span key={tech} className="tag text-xs">{tech}</span>
            ))}
            {project.techStack.length > 5 && (
              <span className="font-mono text-xs text-text-muted self-center">
                +{project.techStack.length - 5}
              </span>
            )}
          </div>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="font-mono text-xs text-text-muted hover:text-accent-cyan transition-colors"
          >
            {expanded ? '↑ Show less' : '↓ Show more'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

const allCategories = ['All', ...new Set(projectsData.map((p) => p.category))]

export default function Projects() {
  const [sectionRef, inView] = useInView()
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef(null)
  const [containerW, setContainerW] = useState(800)
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  const filtered =
    activeCategory === 'All' ? projectsData : projectsData.filter((p) => p.category === activeCategory)

  useEffect(() => { setActiveIndex(0) }, [activeCategory])

  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      setContainerW(entries[0].contentRect.width)
    })
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const effectiveCardW = Math.min(CARD_W, Math.max(280, containerW - 48))
  const trackX = (containerW - effectiveCardW) / 2 - activeIndex * (effectiveCardW + CARD_GAP)

  const prev = useCallback(() => setActiveIndex((i) => Math.max(0, i - 1)), [])
  const next = useCallback(() => setActiveIndex((i) => Math.min(filtered.length - 1, i + 1)), [filtered.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [prev, next])

  // Touch / swipe support
  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return
    const dx = touchStartX.current - e.changedTouches[0].clientX
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY)
    if (dy > Math.abs(dx)) return // vertical scroll, ignore
    if (dx > 40) next()
    else if (dx < -40) prev()
    touchStartX.current = null
    touchStartY.current = null
  }, [next, prev])

  return (
    <section id="projects" className="py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          {/* Section header */}
          <div className="mb-12 text-center">
            <p className="section-heading">03. Projects</p>
            <h2 className="section-title">Things I&apos;ve Built</h2>
            <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-accent-cyan to-accent-purple rounded-full mb-8" />

            <div className="flex flex-wrap items-center justify-center gap-2">
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
            </div>
          </div>

          {/* 3D Carousel */}
          <div
            ref={containerRef}
            className="relative select-none"
            style={{ perspective: '1400px', perspectiveOrigin: '50% 40%' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Edge fade masks */}
            <div className="absolute inset-y-0 left-0 w-16 sm:w-24 z-10 pointer-events-none bg-gradient-to-r from-[#0a0a0f] to-transparent" />
            <div className="absolute inset-y-0 right-0 w-16 sm:w-24 z-10 pointer-events-none bg-gradient-to-l from-[#0a0a0f] to-transparent" />

            <div className="overflow-hidden py-14">
              <motion.div
                className="flex"
                animate={{ x: trackX }}
                transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                style={{ gap: CARD_GAP, transformStyle: 'preserve-3d' }}
              >
                {filtered.map((project, i) => {
                  const offset = i - activeIndex
                  const absOff = Math.abs(offset)
                  return (
                    <motion.div
                      key={project.id}
                      animate={{
                        rotateY: offset * -16,
                        scale: 1 - absOff * 0.09,
                        opacity: absOff > 2 ? 0 : 1 - absOff * 0.28,
                        z: -absOff * 90,
                      }}
                      transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                      style={{
                        width: effectiveCardW,
                        flexShrink: 0,
                        cursor: offset !== 0 ? 'pointer' : 'default',
                        transformOrigin: offset < 0 ? 'right center' : 'left center',
                      }}
                      onClick={() => offset !== 0 && setActiveIndex(i)}
                    >
                      <ProjectCard project={project} isActive={offset === 0} />
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>

            {/* Navigation controls */}
            <div className="flex items-center justify-center gap-5 mt-2">
              <motion.button
                onClick={prev}
                disabled={activeIndex === 0}
                aria-label="Previous project"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-full border border-white/10 text-text-muted hover:border-accent-cyan/50 hover:text-accent-cyan hover:bg-accent-cyan/5 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>

              {/* Dot indicators */}
              <div className="flex items-center gap-2">
                {filtered.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Go to project ${i + 1}`}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.8 }}
                    animate={{
                      width: i === activeIndex ? 24 : 6,
                      backgroundColor: i === activeIndex ? '#00d4ff' : 'rgba(255,255,255,0.2)',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="h-1.5 rounded-full"
                    style={{ minWidth: 6 }}
                  />
                ))}
              </div>

              <motion.button
                onClick={next}
                disabled={activeIndex === filtered.length - 1}
                aria-label="Next project"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-full border border-white/10 text-text-muted hover:border-accent-cyan/50 hover:text-accent-cyan hover:bg-accent-cyan/5 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>

            <p className="text-center font-mono text-xs text-text-muted mt-4 opacity-40">
              {activeIndex + 1} / {filtered.length}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
