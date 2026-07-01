import { useEffect, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { TECH } from '../data/techStack'
import { IconChip } from './TechIcon'

const CHIP = 52
const HALF = CHIP / 2
const RAD = 25 // collision radius

const GATHER_BASE = 2.7   // s — when the ring starts forming
const GATHER_STEP = 0.12  // s — stagger between chips (one by one)
const SETTLE = 0.95       // s — glide time for the last chip

function computeLayout() {
  const W = window.innerWidth
  const H = window.innerHeight
  const floorY = H * 0.74
  // circle forms on the RIGHT, where the hero orbit sits — for continuity
  const cx = Math.min(W * 0.72, W / 2 + 300)
  const cy = H * 0.47
  const R = Math.max(150, Math.min(Math.min(W, H) * 0.24, 190))
  const N = TECH.length

  return {
    W, H, floorY, cx, cy, R,
    completeAt: GATHER_BASE + (N - 1) * GATHER_STEP + SETTLE,
    badges: TECH.map((item, i) => {
      const a = (i / N) * Math.PI * 2 - Math.PI / 2 // top, clockwise
      return {
        item,
        spawnX: W * 0.12 + Math.random() * W * 0.76,
        spawnY: -RAD - 40 - Math.random() * 220,
        vx0: (Math.random() - 0.5) * 120,
        rot0: (Math.random() - 0.5) * 160,
        vrot0: (Math.random() - 0.5) * 260,
        tx: cx + Math.cos(a) * R, // circle target (center coords)
        ty: cy + Math.sin(a) * R,
        spawnAt: i * 0.12,
        gatherStart: GATHER_BASE + i * GATHER_STEP,
      }
    }),
  }
}

export default function IntroAnimation({ onComplete }) {
  const layout = useMemo(computeLayout, [])
  const elRefs = useRef([])

  useEffect(() => {
    const { badges, W, floorY, completeAt } = layout
    const N = badges.length

    const G = 2300         // gravity px/s²
    const FLOOR_E = 0.5    // floor restitution
    const WALL_E = 0.5     // wall restitution
    const COLL_E = 0.72    // inter-object restitution
    const REST_V = 28      // below this, rest on floor

    const bodies = badges.map((b) => ({
      x: b.spawnX, y: b.spawnY, vx: b.vx0, vy: 0,
      rot: b.rot0, vrot: b.vrot0, squish: 0,
      spawnAt: b.spawnAt, spawned: false,
      tx: b.tx, ty: b.ty, gatherStart: b.gatherStart,
      gathering: false, spun: false,
    }))

    const t0 = performance.now()
    let last = t0
    let raf = 0
    let finished = false

    const write = (i) => {
      const el = elRefs.current[i]
      if (!el) return
      const bd = bodies[i]
      el.style.opacity = bd.spawned ? '1' : '0'
      el.style.transform =
        `translate(${bd.x - HALF}px, ${bd.y - HALF}px) rotate(${bd.rot}deg) scale(${1 + bd.squish * 0.6}, ${1 - bd.squish})`
    }

    const step = (now) => {
      const t = (now - t0) / 1000
      let dt = (now - last) / 1000
      last = now
      if (dt > 0.04) dt = 0.04
      const fr = dt * 60 // frame-rate normalizer for lerps
      const sub = 2
      const h = dt / sub

      for (let i = 0; i < N; i++) {
        if (t >= bodies[i].spawnAt) bodies[i].spawned = true
        if (t >= bodies[i].gatherStart) bodies[i].gathering = true
      }

      for (let s = 0; s < sub; s++) {
        // integrate free bodies
        for (let i = 0; i < N; i++) {
          const bd = bodies[i]
          if (!bd.spawned || bd.gathering) continue
          bd.vy += G * h
          bd.x += bd.vx * h
          bd.y += bd.vy * h
          bd.rot += bd.vrot * h
          bd.squish *= 0.9
          if (bd.x < RAD) { bd.x = RAD; bd.vx = Math.abs(bd.vx) * WALL_E }
          else if (bd.x > W - RAD) { bd.x = W - RAD; bd.vx = -Math.abs(bd.vx) * WALL_E }
          if (bd.y > floorY - RAD) {
            bd.y = floorY - RAD
            if (bd.vy > REST_V) bd.squish = Math.min(0.4, bd.vy / 2600)
            bd.vy = -bd.vy * FLOOR_E
            bd.vx *= 0.9
            bd.vrot *= 0.6
            if (Math.abs(bd.vy) < REST_V) bd.vy = 0
          }
        }
        // resolve pairwise collisions (no overlap; impulse scales with speed)
        for (let i = 0; i < N; i++) {
          const a = bodies[i]
          if (!a.spawned || a.gathering) continue
          for (let j = i + 1; j < N; j++) {
            const b = bodies[j]
            if (!b.spawned || b.gathering) continue
            let dx = b.x - a.x, dy = b.y - a.y
            let dist = Math.hypot(dx, dy)
            const min = 2 * RAD
            if (dist === 0) { dx = 0.1; dy = 0.1; dist = 0.14 }
            if (dist < min) {
              const nx = dx / dist, ny = dy / dist
              const sep = (min - dist) / 2
              a.x -= nx * sep; a.y -= ny * sep
              b.x += nx * sep; b.y += ny * sep
              const rvx = b.vx - a.vx, rvy = b.vy - a.vy
              const vn = rvx * nx + rvy * ny
              if (vn < 0) {
                const imp = (-(1 + COLL_E) * vn) / 2
                a.vx -= imp * nx; a.vy -= imp * ny
                b.vx += imp * nx; b.vy += imp * ny
                const spin = (rvx * ny - rvy * nx) * 0.5
                a.vrot -= spin; b.vrot += spin
                const sq = Math.min(0.35, Math.abs(vn) / 2600)
                if (sq > a.squish) a.squish = sq
                if (sq > b.squish) b.squish = sq
              }
            }
          }
        }
      }

      // gather: glide into the ring, one by one, with a full spin
      for (let i = 0; i < N; i++) {
        const bd = bodies[i]
        if (!bd.gathering) continue
        if (!bd.spun) { bd.spun = true; bd.rot += bd.rot >= 0 ? 360 : -360 }
        bd.x += (bd.tx - bd.x) * Math.min(1, 0.15 * fr)
        bd.y += (bd.ty - bd.y) * Math.min(1, 0.15 * fr)
        bd.rot += (0 - bd.rot) * Math.min(1, 0.12 * fr)
        bd.squish *= 0.8
        bd.spawned = true
      }

      for (let i = 0; i < N; i++) write(i)

      if (!finished && t >= completeAt) { finished = true; onComplete() }
      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [layout, onComplete])

  const D = layout.completeAt + 0.4

  return (
    <motion.div
      className="fixed inset-0 bg-[#08080f]"
      style={{ zIndex: 9999 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      {/* vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 60% at 72% 47%, rgba(0,212,255,0.06), transparent 68%), radial-gradient(ellipse 50% 50% at 40% 80%, rgba(139,92,246,0.05), transparent 70%)',
        }}
      />

      {/* ground glow during the fall, fades as the ring forms */}
      <motion.div
        style={{
          position: 'absolute', left: 0, right: 0, top: layout.floorY, height: 2,
          background:
            'linear-gradient(90deg, transparent 6%, rgba(0,212,255,0.20) 30%, rgba(139,92,246,0.20) 70%, transparent 94%)',
          filter: 'blur(1px)', transformOrigin: 'center',
        }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: [0, 1, 1, 0], scaleX: [0, 1, 1, 0.3] }}
        transition={{ duration: D, times: [0, 0.06, 0.5, 0.62], ease: 'easeOut' }}
      />

      {/* core glow ignites on the right as the circle forms */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 170, height: 170, left: layout.cx, top: layout.cy, x: '-50%', y: '-50%',
          background:
            'radial-gradient(circle, rgba(0,212,255,0.22) 0%, rgba(139,92,246,0.12) 45%, transparent 70%)',
          filter: 'blur(16px)',
        }}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: [0, 0, 1], scale: [0.4, 0.4, 1] }}
        transition={{ duration: D, times: [0, 0.5, 0.82], ease: 'easeOut' }}
      />

      {/* physics-driven chips (positioned via refs each frame) */}
      {layout.badges.map((b, i) => (
        <div
          key={b.item.name}
          ref={(el) => { elRefs.current[i] = el }}
          style={{ position: 'fixed', left: 0, top: 0, zIndex: 10, opacity: 0, willChange: 'transform' }}
        >
          <IconChip item={b.item} size={CHIP} iconSize={28} />
        </div>
      ))}

      {/* skip */}
      <motion.button
        onClick={onComplete}
        className="absolute bottom-6 right-6 font-mono text-[10px] tracking-widest uppercase text-white/30 hover:text-white/70 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        skip →
      </motion.button>
    </motion.div>
  )
}
