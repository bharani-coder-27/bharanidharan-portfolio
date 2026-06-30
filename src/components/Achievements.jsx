import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import achievements from '../data/achievements.json'

const badgeColors = {
  cyan: 'border-accent-cyan/30 bg-accent-cyan/5 text-accent-cyan',
  purple: 'border-accent-purple/30 bg-accent-purple/5 text-accent-purple',
  green: 'border-accent-green/30 bg-accent-green/5 text-accent-green',
}

const typeIcons = {
  Certification: '🏅',
  Hackathon: '🏆',
  Achievement: '⭐',
}

export default function Achievements() {
  const [ref, inView] = useInView()

  return (
    <section id="achievements" className="py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-12 text-center">
            <p className="section-heading">05. Achievements</p>
            <h2 className="section-title">Milestones & Certs</h2>
            <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-accent-cyan to-accent-purple rounded-full" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((ach, i) => {
              const colorClass = badgeColors[ach.badgeColor] ?? badgeColors.cyan
              return (
                <motion.div
                  key={ach.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className={`glass-card border rounded-xl p-5 flex flex-col gap-3 hover:scale-[1.02] transition-all duration-300 ${colorClass}`}
                >
                  {/* Icon + type */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{typeIcons[ach.type] ?? '📌'}</span>
                    <span className="font-mono text-xs opacity-70">{ach.type}</span>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary leading-snug mb-1">
                      {ach.title}
                    </h3>
                    <p className="font-mono text-xs opacity-70">{ach.issuingBody}</p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-text-muted leading-relaxed flex-1">{ach.description}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="font-mono text-xs text-text-muted">{ach.date}</span>
                    {ach.credentialUrl && (
                      <a
                        href={ach.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs hover:underline transition-all"
                      >
                        View ↗
                      </a>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
