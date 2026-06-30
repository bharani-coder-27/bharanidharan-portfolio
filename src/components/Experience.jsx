import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import experience from '../data/experience.json'

export default function Experience() {
  const [ref, inView] = useInView()

  return (
    <section id="experience" className="py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-12 text-center">
            <p className="section-heading">02. Experience</p>
            <h2 className="section-title">Where I&apos;ve Worked</h2>
            <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-accent-cyan to-accent-purple rounded-full" />
          </div>

          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-accent-cyan/40 via-accent-purple/40 to-transparent" />

            <div className="space-y-8">
              {experience.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="relative pl-12 md:pl-20"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-2.5 md:left-6 top-5 w-3 h-3 rounded-full border-2 border-accent-cyan bg-bg-primary shadow-glow-cyan" />

                  <div className="glass-card glow-border-cyan p-6 rounded-xl group hover:border-accent-cyan/50 transition-all duration-300">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-base font-semibold text-text-primary group-hover:text-accent-cyan transition-colors">
                          {job.role}
                        </h3>
                        <p className="font-mono text-sm text-accent-purple mt-0.5">{job.company}</p>
                      </div>
                      <div className="flex flex-col sm:items-end gap-1 shrink-0">
                        <span className="font-mono text-xs text-text-muted">
                          {job.startDate} — {job.current ? 'Present' : job.endDate}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="tag">{job.type}</span>
                          <span className="font-mono text-xs text-text-muted">{job.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-text-muted mb-4 italic">{job.description}</p>

                    {/* Bullets */}
                    <ul className="space-y-2 mb-5">
                      {job.bullets.map((bullet, bi) => (
                        <li key={bi} className="flex items-start gap-2 text-sm text-text-secondary">
                          <span className="text-accent-cyan mt-1 shrink-0 text-xs">▹</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1.5">
                      {job.techStack.map((tech) => (
                        <span key={tech} className="tag font-mono text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
