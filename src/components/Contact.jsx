import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'
import profile from '../data/profile.json'

const socialLinks = [
  {
    key: 'github',
    label: 'GitHub',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
    color: 'hover:text-white hover:border-white/30',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    color: 'hover:text-blue-400 hover:border-blue-400/30',
  },
  {
    key: 'email',
    label: 'Email',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: 'hover:text-accent-cyan hover:border-accent-cyan/30',
  },
]

export default function Contact() {
  const [ref, inView] = useInView()

  return (
    <section id="contact" className="py-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="section-heading">07. Contact</p>
          <h2 className="section-title">Get In Touch</h2>
          <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-accent-cyan to-accent-purple rounded-full mb-8" />

          <div className="glass-card glow-border-cyan rounded-2xl p-8 mb-8">
            <p className="font-mono text-xs text-accent-green mb-2">// open_to_opportunities</p>
            <p className="text-text-secondary leading-relaxed mb-6">
              Whether it&apos;s an internship, freelance project, open-source collab, or just a
              conversation about backend systems and AI — my inbox is always open.
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="btn-primary inline-flex items-center gap-2 text-sm"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {profile.email}
            </a>
          </div>

          {/* Social links */}
          <div className="flex items-center justify-center gap-4">
            {socialLinks
              .filter(({ key }) => profile.social[key])
              .map(({ key, label, icon, color }) => (
                <a
                  key={key}
                  href={profile.social[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/8 text-text-muted transition-all duration-200 ${color}`}
                >
                  {icon}
                  <span className="font-mono text-xs">{label}</span>
                </a>
              ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
        <p className="font-mono text-xs text-text-muted">
          Built by{' '}
          <span className="text-accent-cyan">{profile.name}</span> with React + Vite + Tailwind
        </p>
        <p className="font-mono text-xs text-text-muted">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
      </div>
    </section>
  )
}
