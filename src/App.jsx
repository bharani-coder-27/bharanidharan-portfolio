import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Achievements from './components/Achievements'
import Education from './components/Education'
import Contact from './components/Contact'
import IntroAnimation from './components/IntroAnimation'

// Only play intro on desktop (TechVisual is hidden on mobile)
const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024

export default function App() {
  const [introComplete, setIntroComplete] = useState(!isDesktop)
  const [showIntro, setShowIntro] = useState(isDesktop)

  const handleIntroDone = () => {
    // Set both simultaneously so overlay fade and hero reveal crossfade
    setIntroComplete(true)
    setShowIntro(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e2e8f0]">
      {/* Background noise/grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <Navbar />

      <main className="relative z-10">
        <Hero introComplete={introComplete} />

        {/* Divider */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        <About />

        <div className="max-w-6xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        <Experience />

        <div className="max-w-6xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        <Projects />

        <div className="max-w-6xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        <Skills />

        <div className="max-w-6xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        <Achievements />

        <div className="max-w-6xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        <Education />

        <div className="max-w-6xl mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        <Contact />
      </main>

      {/* Intro overlay rendered last so it sits on top via z-index */}
      <AnimatePresence>
        {showIntro && (
          <IntroAnimation key="intro" onComplete={handleIntroDone} />
        )}
      </AnimatePresence>
    </div>
  )
}
