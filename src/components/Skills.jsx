import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import skills from '../data/skills.json'

const colorMap = {
  cyan: {
    tag: '',
    heading: 'text-accent-cyan',
    border: 'border-accent-cyan/20',
    bg: 'bg-accent-cyan/5',
    dot: 'bg-accent-cyan',
  },
  purple: {
    tag: 'tag-purple',
    heading: 'text-accent-purple',
    border: 'border-accent-purple/20',
    bg: 'bg-accent-purple/5',
    dot: 'bg-accent-purple',
  },
  green: {
    tag: 'tag-green',
    heading: 'text-accent-green',
    border: 'border-accent-green/20',
    bg: 'bg-accent-green/5',
    dot: 'bg-accent-green',
  },
}

export default function Skills() {
  const [ref, inView] = useInView()

  return (
    <section id="skills" className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-12 text-center">
            <p className="section-heading">04. Skills</p>
            <h2 className="section-title">Tech Arsenal</h2>
            <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-accent-cyan to-accent-purple rounded-full" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {skills.map((group, i) => {
              const colors = colorMap[group.color] ?? colorMap.cyan
              return (
                <motion.div
                  key={group.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className={`glass-card rounded-xl p-5 border ${colors.border} hover:shadow-glow-cyan transition-all duration-300`}
                >
                  {/* Category header */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">{group.icon}</span>
                    <h3 className={`font-mono text-sm font-semibold ${colors.heading}`}>
                      {group.category}
                    </h3>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((skill) => (
                      <motion.span
                        key={skill}
                        whileHover={{ scale: 1.05 }}
                        className={`tag ${colors.tag} text-xs cursor-default`}
                      >
                        {skill}
                      </motion.span>
                    ))}
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
