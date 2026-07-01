import { motion } from 'framer-motion'
import { useTypingEffect } from '../hooks/useTypingEffect'
import profile from '../data/profile.json'

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

/* ── Tech stack for the right panel ── */
const TECH = [
  { name: 'Python',        color: '#4b8bbe', l: 44, t: 4,  dur: 3.8, del: 0.0, amp: 10 },
  { name: 'TypeScript',    color: '#3178c6', l: 4,  t: 14, dur: 4.2, del: 0.5, amp: 8  },
  { name: 'Kubernetes',      color: '#d63aff', l: 76, t: 10, dur: 3.5, del: 0.9, amp: 9  },
  { name: 'Docker',        color: '#2496ed', l: 2,  t: 40, dur: 4.0, del: 0.3, amp: 11 },
  { name: 'React',         color: '#61dafb', l: 78, t: 36, dur: 3.6, del: 0.6, amp: 7  },
  { name: 'FastAPI',       color: '#009688', l: 80, t: 62, dur: 4.3, del: 1.0, amp: 9  },
  { name: 'LangGraph',     color: '#7c3aed', l: 3,  t: 62, dur: 3.9, del: 0.5, amp: 8  },
  { name: 'AWS',           color: '#ff9900', l: 12, t: 82, dur: 4.1, del: 0.7, amp: 10 },
  { name: 'Node.js',       color: '#68a063', l: 50, t: 86, dur: 3.7, del: 0.2, amp: 8  },
  { name: 'PostgreSQL',    color: '#336791', l: 74, t: 80, dur: 4.4, del: 0.9, amp: 7  },
  { name: 'MongoDB',       color: '#47a248', l: 30, t: 92, dur: 3.5, del: 1.2, amp: 9  },
  { name: 'GitHub Actions',color: '#2088ff', l: 58, t: 94, dur: 4.0, del: 0.4, amp: 8  },
]

function TechBadge({ name, color, l, t, dur, del, amp }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: `${l}%`, top: `${t}%` }}
      animate={{ y: [0, -amp, 0], rotate: [0, 1.5, 0, -1.5, 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay: del }}
    >
      <motion.div
        whileHover={{ scale: 1.12, y: -4 }}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg cursor-default"
        style={{
          background: `${color}14`,
          border: `1px solid ${color}35`,
          backdropFilter: 'blur(8px)',
        }}
      >
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: color, boxShadow: `0 0 6px ${color}` }}
        />
        <span className="font-mono text-xs whitespace-nowrap" style={{ color }}>
          {name}
        </span>
      </motion.div>
    </motion.div>
  )
}

function TechVisual() {
  return (
    <div className="relative w-full h-[520px]">
      {/* Orbital ring 1 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 220, height: 220,
          left: '50%', top: '48%',
          transform: 'translate(-50%,-50%)',
          border: '1px solid rgba(0,212,255,0.06)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />
      {/* Orbital ring 2 */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 370, height: 370,
          left: '50%', top: '48%',
          transform: 'translate(-50%,-50%)',
          border: '1px solid rgba(139,92,246,0.05)',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />

      {/* Central glow */}
      <div
        className="absolute rounded-full"
        style={{
          width: 100, height: 100,
          left: '50%', top: '48%',
          transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, rgba(139,92,246,0.08) 50%, transparent 70%)',
          filter: 'blur(12px)',
        }}
      />

      {/* Central code card */}
      <motion.div
        className="absolute rounded-xl overflow-hidden"
        style={{
          width: 170, left: '50%', top: '48%',
          transform: 'translate(-50%,-50%)',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(0,212,255,0.12)',
          backdropFilter: 'blur(16px)',
        }}
        animate={{ boxShadow: ['0 0 20px rgba(0,212,255,0.05)', '0 0 40px rgba(0,212,255,0.12)', '0 0 20px rgba(0,212,255,0.05)'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Title bar */}
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5">
          <span className="w-2 h-2 rounded-full bg-red-500/70" />
          <span className="w-2 h-2 rounded-full bg-yellow-500/70" />
          <span className="w-2 h-2 rounded-full bg-green-500/70" />
          <span className="font-mono text-[10px] text-text-muted ml-1">agent.py</span>
        </div>
        {/* Code lines */}
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
              transition={{ delay: 0.8 + delay, duration: 0.4 }}
            >
              {text}
            </motion.p>
          ))}
          {/* Cursor blink */}
          <motion.span
            className="font-mono text-[10px] text-accent-cyan"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            █
          </motion.span>
        </div>
      </motion.div>

      {/* Floating tech badges */}
      {TECH.map((t) => (
        <TechBadge key={t.name} {...t} />
      ))}

      {/* Subtle dots grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,212,255,0.3) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }}
      />
    </div>
  )
}

/* ── Framer Motion variants ── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
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
            <TechVisual />
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
