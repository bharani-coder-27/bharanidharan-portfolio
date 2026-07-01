import { motion } from 'framer-motion'
import { useTypingEffect } from '../hooks/useTypingEffect'
import profile from '../data/profile.json'
import { TECH } from '../data/techStack'
import { IconChip } from './TechIcon'

/* ── Social icons ── */
const socialIcons = {
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
}

const socialGlow = {
  github:   'rgba(255,255,255,0.12)',
  linkedin: 'rgba(10,102,194,0.25)',
  email:    'rgba(0,212,255,0.18)',
}

/* ── Tech constellation: real logos orbiting a live terminal ── */
const ORBIT_DUR = 48 // seconds per full revolution
const ORBIT_R = 188  // outer ring radius

function OrbitChip({ item, angle, radius, index }) {
  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius
  return (
    <div
      className="absolute"
      style={{ left: '50%', top: '50%', transform: `translate(-50%,-50%) translate(${x}px, ${y}px)` }}
    >
      {/* counter-rotate so the chip stays upright while the ring spins */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: ORBIT_DUR, repeat: Infinity, ease: 'linear' }}
      >
        {/* gentle independent float + hover pop */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3 + (index % 4) * 0.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.18 }}
          whileHover={{ scale: 1.22, zIndex: 30 }}
          className="group relative cursor-default"
        >
          <IconChip item={item} size={54} iconSize={29} />
          {/* label appears on hover */}
          <span
            className="absolute left-1/2 -bottom-6 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            style={{ color: item.color, background: `${item.color}12`, border: `1px solid ${item.color}30` }}
          >
            {item.name}
          </span>
        </motion.div>
      </motion.div>
    </div>
  )
}

/* small drifting sparkle to fill negative space */
function Particle({ x, y, size, color, dur, delay }) {
  return (
    <motion.span
      className="absolute rounded-full"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, background: color, boxShadow: `0 0 8px ${color}` }}
      animate={{ opacity: [0, 0.9, 0], scale: [0.6, 1, 0.6], y: [0, -14, 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}

const PARTICLES = [
  { x: 12, y: 18, size: 3, color: '#00d4ff', dur: 4.5, delay: 0.0 },
  { x: 86, y: 24, size: 2, color: '#8b5cf6', dur: 5.2, delay: 0.8 },
  { x: 22, y: 78, size: 2, color: '#12b8a6', dur: 4.8, delay: 1.4 },
  { x: 78, y: 82, size: 3, color: '#ff2d78', dur: 5.6, delay: 0.4 },
  { x: 50, y: 8,  size: 2, color: '#00d4ff', dur: 4.2, delay: 1.1 },
  { x: 8,  y: 50, size: 2, color: '#8b5cf6', dur: 5.0, delay: 0.6 },
  { x: 92, y: 56, size: 3, color: '#12b8a6', dur: 4.6, delay: 1.8 },
  { x: 40, y: 92, size: 2, color: '#00d4ff', dur: 5.4, delay: 0.2 },
]

function TechOrbit() {
  const N = TECH.length
  const R = ORBIT_R

  // outer node coordinates for the constellation lines
  const D = R * 2 + 60
  const c = D / 2
  const pts = TECH.map((_, i) => {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2
    return [c + Math.cos(a) * R, c + Math.sin(a) * R]
  })
  const polyPoints = pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')

  return (
    <div className="relative w-full h-[560px]">
      {/* soft ambient wash to fill the panel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,212,255,0.05), transparent 65%)',
        }}
      />

      {/* twinkling particles */}
      {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

      {/* concentric ring guides */}
      {[R * 2 + 12, R * 1.4, R * 0.66].map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: d, height: d, left: '50%', top: '50%',
            transform: 'translate(-50%,-50%)',
            border: `1px solid ${i === 0 ? 'rgba(0,212,255,0.10)' : i === 1 ? 'rgba(139,92,246,0.08)' : 'rgba(0,212,255,0.06)'}`,
          }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 52 + i * 14, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      {/* central glow */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 150, height: 150, left: '50%', top: '50%',
          transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle, rgba(0,212,255,0.20) 0%, rgba(139,92,246,0.10) 45%, transparent 70%)',
          filter: 'blur(16px)',
        }}
        animate={{ scale: [1, 1.14, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* rotating ring: constellation lines + real tech logos */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: ORBIT_DUR, repeat: Infinity, ease: 'linear' }}
      >
        {/* constellation web */}
        <svg
          width={D}
          height={D}
          className="absolute left-1/2 top-1/2 pointer-events-none"
          style={{ transform: 'translate(-50%,-50%)', overflow: 'visible' }}
        >
          <polygon points={polyPoints} fill="none" stroke="rgba(0,212,255,0.12)" strokeWidth="1" />
          {pts.map((p, i) => (
            <line key={i} x1={c} y1={c} x2={p[0]} y2={p[1]} stroke="rgba(139,92,246,0.06)" strokeWidth="1" />
          ))}
        </svg>

        {TECH.map((item, i) => (
          <OrbitChip
            key={item.name}
            item={item}
            index={i}
            radius={R}
            angle={(i / N) * Math.PI * 2 - Math.PI / 2}
          />
        ))}
      </motion.div>

      {/* counter-rotating inner ring of small dots */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: -360 }}
        transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
      >
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2
          const r = R * 0.4
          return (
            <span
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{
                left: '50%', top: '50%',
                transform: `translate(-50%,-50%) translate(${Math.cos(a) * r}px, ${Math.sin(a) * r}px)`,
                background: i % 2 ? 'rgba(139,92,246,0.6)' : 'rgba(0,212,255,0.6)',
                boxShadow: i % 2 ? '0 0 8px rgba(139,92,246,0.8)' : '0 0 8px rgba(0,212,255,0.8)',
              }}
            />
          )
        })}
      </motion.div>

      {/* central live terminal */}
      <motion.div
        className="absolute rounded-xl overflow-hidden z-10"
        style={{
          width: 184, left: '50%', top: '50%',
          transform: 'translate(-50%,-50%)',
          background: 'rgba(10,10,20,0.78)',
          border: '1px solid rgba(0,212,255,0.16)',
          backdropFilter: 'blur(16px)',
        }}
        animate={{ boxShadow: ['0 0 24px rgba(0,212,255,0.06)', '0 0 46px rgba(0,212,255,0.14)', '0 0 24px rgba(0,212,255,0.06)'] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5">
          <span className="w-2 h-2 rounded-full bg-red-500/70" />
          <span className="w-2 h-2 rounded-full bg-yellow-500/70" />
          <span className="w-2 h-2 rounded-full bg-green-500/70" />
          <span className="font-mono text-[10px] text-text-muted ml-1">agent.py</span>
        </div>
        <div className="px-3 py-3 space-y-1.5">
          {[
            { text: '$ python agent.py', color: 'text-accent-green' },
            { text: '> RAG ready ✓', color: 'text-accent-cyan', delay: 0.8 },
            { text: '> LLM online ✓', color: 'text-accent-cyan', delay: 1.6 },
            { text: '> Deploying...', color: 'text-accent-purple', delay: 2.4 },
          ].map(({ text, color, delay = 0 }, i) => (
            <motion.p
              key={i}
              className={`font-mono text-[10px] ${color}`}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + delay, duration: 0.4 }}
            >
              {text}
            </motion.p>
          ))}
          <motion.span
            className="font-mono text-[10px] text-accent-cyan"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            █
          </motion.span>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Framer Motion variants ── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

/* ── Hero ── */
export default function Hero({ introComplete = true }) {
  const typedText = useTypingEffect(profile.taglines, 70, 35, 2200)

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #00d4ff 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }}
        />
        <div className="absolute inset-0 bg-grid-pattern opacity-100" />
      </div>

      {/* ── Main grid ── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-24 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[80vh]">

          {/* ── LEFT: text content ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={introComplete ? 'visible' : 'hidden'}
          >
            {/* Status badge */}
            <motion.div variants={itemVariants} className="mb-8">
              <span className="inline-flex items-center gap-2 font-mono text-xs px-4 py-2 rounded-full border border-accent-green/30 bg-accent-green/5 text-accent-green">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                {profile.availability}
              </span>
            </motion.div>

            {/* Name */}
            <motion.div variants={itemVariants}>
              <p className="font-mono text-accent-cyan text-sm tracking-widest uppercase mb-3">
                Hi, I&apos;m
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4 leading-none">
                <span className="text-gradient-cyan">{profile.name}</span>
              </h1>
            </motion.div>

            {/* Title */}
            <motion.div variants={itemVariants}>
              <h2 className="text-xl sm:text-2xl font-light text-text-secondary mb-1">
                {profile.title}
              </h2>
              <p className="font-mono text-sm text-text-muted mb-8">{profile.subtitle}</p>
            </motion.div>

            {/* Typing effect */}
            <motion.div variants={itemVariants} className="mb-10 h-8 flex items-center">
              <span className="font-mono text-base sm:text-lg text-accent-cyan">
                <span className="text-accent-green mr-2">$</span>
                {typedText}
                <span className="animate-blink text-accent-cyan ml-0.5">|</span>
              </span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 mb-12">
              <a
                href={profile.resumeUrl}
                download="Bharanidharan_Resume.pdf"
                className="btn-primary inline-flex items-center gap-2"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Resume
              </a>
              <a href="#projects" className="btn-ghost inline-flex items-center gap-2">
                View Projects
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              <a href="#contact" className="btn-ghost inline-flex items-center gap-2">
                Get In Touch
              </a>
            </motion.div>

            {/* Social links */}
            <motion.div variants={itemVariants} className="flex items-center gap-3">
              {Object.entries(profile.social)
                .filter(([, url]) => url)
                .map(([platform, url]) => (
                  <motion.a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platform}
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.92 }}
                    className="relative p-3 rounded-xl text-text-secondary transition-colors duration-200 group"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <span
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ background: socialGlow[platform] ?? 'rgba(255,255,255,0.1)' }}
                    />
                    <span
                      className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-lg"
                      style={{ background: socialGlow[platform] ?? 'transparent' }}
                    />
                    <span className="relative z-10 block text-text-muted group-hover:text-white transition-colors duration-200">
                      {socialIcons[platform] ?? platform}
                    </span>
                  </motion.a>
                ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: tech visual (desktop only) ── */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 20 }}
            animate={introComplete ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <TechOrbit />
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator — always at section bottom, truly centered ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={introComplete ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: introComplete ? 2 : 0, duration: 0.6 }}
        className="absolute bottom-8 z-10 flex flex-col items-center gap-2"
        style={{ left: '50%', transform: 'translateX(-50%)' }}
      >
        <motion.span
          animate={{ opacity: [0.3, 0.65, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="font-mono text-[10px] tracking-widest uppercase text-text-muted"
        >
          scroll
        </motion.span>

        {/* Mouse silhouette */}
        <div
          className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
          style={{ border: '1.5px solid rgba(255,255,255,0.2)' }}
        >
          <motion.div
            animate={{ y: [0, 13, 0], opacity: [1, 0.15, 1] }}
            transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-1.5 rounded-full bg-accent-cyan"
          />
        </div>

        {/* Staggered chevrons */}
        {[0, 1].map((i) => (
          <motion.svg
            key={i}
            viewBox="0 0 10 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-2.5 h-1.5 text-accent-cyan"
            animate={{ opacity: [0.15, 0.7, 0.15] }}
            transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.22 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M1 1l4 4 4-4" />
          </motion.svg>
        ))}
      </motion.div>
    </section>
  )
}
