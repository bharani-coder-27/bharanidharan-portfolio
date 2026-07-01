import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import profile from '../data/profile.json'

const stats = [
  { label: 'Projects Built', value: '10+' },
  { label: 'LLM Integrations', value: '5+' },
  { label: 'LeetCode Solved', value: '330+' },
  { label: 'Cups of Coffee', value: '∞' },
]

export default function About() {
  const [ref, inView] = useInView()
  const [showBio, setShowBio] = useState(false)

  return (
    <section id="about" className="py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Section header */}
          <div className="mb-12 text-center">
            <p className="section-heading">01. About</p>
            <h2 className="section-title">Who I Am</h2>
            <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-accent-cyan to-accent-purple rounded-full" />
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Bio */}
            <div className="space-y-5">
              <div className="glass-card glow-border-cyan p-6 rounded-xl">
                <p className="font-mono text-xs text-accent-green mb-4">// profile.summary</p>
                <p className={`text-text-secondary leading-relaxed text-sm sm:text-base sm:line-clamp-none ${showBio ? '' : 'line-clamp-5'}`}>
                  {profile.summary}
                </p>
                <button
                  onClick={() => setShowBio((s) => !s)}
                  className="sm:hidden mt-3 font-mono text-xs text-accent-cyan hover:underline"
                >
                  {showBio ? '▲ show less' : '▼ show more'}
                </button>
              </div>

              <div className="glass-card p-6 rounded-xl border border-white/5">
                <p className="font-mono text-xs text-accent-cyan mb-4">$ whoami --details</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-accent-green font-mono">📍</span>
                    <span className="text-text-secondary">{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-accent-green font-mono">🎓</span>
                    <span className="text-text-secondary">{profile.subtitle}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-accent-green font-mono">✉️</span>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-accent-cyan hover:underline font-mono text-xs"
                    >
                      {profile.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-accent-green font-mono">🟢</span>
                    <span className="text-text-secondary">{profile.availability}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.1 * i }}
                    className="glass-card glow-border-purple p-5 rounded-xl text-center"
                  >
                    <div className="text-3xl font-bold text-gradient-cyan mb-1">{stat.value}</div>
                    <div className="font-mono text-xs text-text-muted">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Focus areas */}
              <div className="glass-card p-6 rounded-xl border border-white/5">
                <p className="font-mono text-xs text-accent-purple mb-4">// current_focus[]</p>
                <div className="space-y-2">
                  {[
                    'Multi-agent LLM orchestration with LangGraph',
                    'Cloud-native microservices on Kubernetes',
                    'Production RAG systems & vector databases',
                    'MCP servers for LLM tool augmentation',
                  ].map((focus) => (
                    <div key={focus} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-accent-cyan mt-0.5 shrink-0">▸</span>
                      {focus}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
