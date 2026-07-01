import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'

const TECH = [
  { name: 'Python',         color: '#4b8bbe', l: 44, t: 4  },
  { name: 'TypeScript',     color: '#3178c6', l: 4,  t: 14 },
  { name: 'Kubernetes',     color: '#d63aff', l: 76, t: 10 },
  { name: 'Docker',         color: '#2496ed', l: 2,  t: 40 },
  { name: 'React',          color: '#61dafb', l: 78, t: 36 },
  { name: 'FastAPI',        color: '#009688', l: 80, t: 62 },
  { name: 'LangGraph',      color: '#7c3aed', l: 3,  t: 62 },
  { name: 'AWS',            color: '#ff9900', l: 12, t: 82 },
  { name: 'Node.js',        color: '#68a063', l: 50, t: 86 },
  { name: 'PostgreSQL',     color: '#336791', l: 74, t: 80 },
  { name: 'MongoDB',        color: '#47a248', l: 30, t: 92 },
  { name: 'GitHub Actions', color: '#2088ff', l: 58, t: 94 },
]

function computeLayout() {
  const W = window.innerWidth
  const H = window.innerHeight
  const maxW = 1152
  const padX = Math.max(16, (W - maxW) / 2)
  const containerW = Math.min(W - 2 * padX, maxW)
  const gap = 32
  const colW = (containerW - gap) / 2
  const techLeft = padX + colW + gap
  const techW = colW
  const techH = 520
  const techTop = Math.max(80, (H - techH) / 2)
  const groundY = H * 0.70

  const spreadW = containerW * 0.80
  const spreadStart = padX + containerW * 0.10

  return {
    groundY,
    badges: TECH.map((t, i) => ({
      ...t,
      finalX: techLeft + (t.l / 100) * techW,
      finalY: techTop + (t.t / 100) * techH,
      startX: spreadStart + (spreadW * i) / (TECH.length - 1),
      delay: i * 0.065,
    })),
  }
}

function FallingBadge({ badge, groundY }) {
  const DUR = 3.6
  const gY = groundY

  return (
    <motion.div
      style={{ position: 'fixed', left: 0, top: 0, zIndex: 10 }}
      initial={{ x: badge.startX, y: -180 }}
      animate={{
        x: [badge.startX, badge.startX, badge.startX, badge.startX, badge.startX, badge.startX, badge.finalX],
        y: [-180, gY, gY - 65, gY, gY - 28, gY, badge.finalY],
        scaleX: [1, 1.28, 1, 1.14, 1, 1, 1],
        scaleY: [1, 0.62, 1, 0.80, 1, 1, 1],
      }}
      transition={{
        duration: DUR,
        times: [0, 0.30, 0.40, 0.50, 0.57, 0.64, 1.0],
        delay: badge.delay,
        ease: ['easeIn', 'easeOut', 'easeIn', 'easeOut', 'easeIn', [0.22, 1, 0.36, 1]],
      }}
    >
      <div
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg pointer-events-none"
        style={{
          background: `${badge.color}18`,
          border: `1px solid ${badge.color}45`,
          backdropFilter: 'blur(8px)',
          boxShadow: `0 0 16px ${badge.color}28`,
        }}
      >
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: badge.color, boxShadow: `0 0 6px ${badge.color}` }}
        />
        <span className="font-mono text-xs whitespace-nowrap" style={{ color: badge.color }}>
          {badge.name}
        </span>
      </div>
    </motion.div>
  )
}

export default function IntroAnimation({ onComplete }) {
  const { groundY, badges } = useMemo(() => computeLayout(), [])

  // Last badge (index 11): delay = 11 × 65ms = 715ms, duration = 3600ms → done at 4315ms
  // Add 300ms buffer before triggering completion
  useEffect(() => {
    const timer = setTimeout(onComplete, 4600)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 bg-[#0a0a0f]"
      style={{ zIndex: 9999 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
    >
      {/* Ambient center glow */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 600, height: 600,
          left: '50%', top: '58%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, rgba(139,92,246,0.02) 50%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Ground glow line — appears when first badge lands, fades when they fly away */}
      <motion.div
        style={{
          position: 'absolute',
          left: 0, right: 0,
          top: groundY,
          height: 2,
          background: 'linear-gradient(90deg, transparent 5%, rgba(0,212,255,0.18) 30%, rgba(139,92,246,0.18) 70%, transparent 95%)',
          filter: 'blur(1px)',
          transformOrigin: 'center',
        }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: [0, 1, 1, 0], scaleX: [0, 1, 1, 0.2] }}
        transition={{ duration: 3.8, times: [0, 0.24, 0.62, 1], ease: 'easeOut', delay: 0.3 }}
      />

      {badges.map((badge) => (
        <FallingBadge key={badge.name} badge={badge} groundY={groundY} />
      ))}
    </motion.div>
  )
}
