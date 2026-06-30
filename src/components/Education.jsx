import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import education from '../data/education.json'

export default function Education() {
  const [ref, inView] = useInView()

  return (
    <section id="education" className="py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-10 text-center">
            <p className="section-heading">06. Education</p>
            <h2 className="section-title">Academic Background</h2>
            <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-accent-cyan to-accent-purple rounded-full" />
          </div>

          <div className="glass-card glow-border-purple p-8 rounded-2xl">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: degree info */}
              <div>
                <div className="flex items-start gap-3 mb-5">
                  <span className="text-3xl">🎓</span>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary leading-snug">
                      {education.degree}
                    </h3>
                    <p className="font-mono text-sm text-accent-purple mt-1">
                      {education.institution}
                    </p>
                    <p className="font-mono text-xs text-text-muted">{education.university}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-mono text-accent-cyan text-xs w-20">Duration</span>
                    <span className="text-text-secondary">
                      {education.startYear} — {education.endYear}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-mono text-accent-cyan text-xs w-20">CGPA</span>
                    <span className="text-text-secondary font-semibold">{education.cgpa}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-mono text-accent-cyan text-xs w-20">Status</span>
                    <span className="tag tag-green text-xs">{education.status}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-mono text-accent-cyan text-xs w-20">Location</span>
                    <span className="text-text-secondary">{education.location}</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mt-5">
                  <p className="font-mono text-xs text-accent-purple mb-2">// highlights</p>
                  <ul className="space-y-2">
                    {education.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                        <span className="text-accent-cyan shrink-0 mt-0.5">▹</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right: coursework */}
              <div>
                <p className="font-mono text-xs text-accent-cyan mb-4">// relevant_courses[]</p>
                <div className="flex flex-wrap gap-2">
                  {education.relevantCourses.map((course) => (
                    <span
                      key={course}
                      className="font-mono text-xs px-3 py-1.5 rounded-lg border border-white/8 text-text-muted hover:border-accent-purple/30 hover:text-accent-purple transition-all duration-200"
                    >
                      {course}
                    </span>
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
