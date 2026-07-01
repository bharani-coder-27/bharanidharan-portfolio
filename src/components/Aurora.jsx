import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/* Slow drifting colored light — sits behind everything for depth.
   On mobile it renders as a couple of static, lighter blobs to avoid the
   heavy continuous repaints that large animated blurs cause on phones. */
const BLOBS = [
  { color: '#00d4ff', size: 620, top: '-8%',  left: '-6%',  op: 0.14, dur: 26, x: 80,  y: 60 },
  { color: '#8b5cf6', size: 560, top: '18%',  left: '62%',  op: 0.13, dur: 32, x: -90, y: 70 },
  { color: '#ff2d78', size: 480, top: '58%',  left: '-4%',  op: 0.10, dur: 30, x: 70,  y: -60 },
  { color: '#12b8a6', size: 540, top: '68%',  left: '58%',  op: 0.11, dur: 28, x: -70, y: -80 },
]

export default function Aurora() {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  if (mobile) {
    // static, cheaper: fewer blobs, no animation, lighter blur
    return (
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {BLOBS.slice(0, 2).map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-2xl"
            style={{
              width: b.size * 0.7,
              height: b.size * 0.7,
              top: b.top,
              left: b.left,
              opacity: b.op * 0.8,
              background: `radial-gradient(circle, ${b.color} 0%, transparent 68%)`,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            opacity: b.op,
            background: `radial-gradient(circle, ${b.color} 0%, transparent 68%)`,
          }}
          animate={{ x: [0, b.x, 0], y: [0, b.y, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }}
        />
      ))}
    </div>
  )
}
