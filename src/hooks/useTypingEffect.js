import { useEffect, useState, useRef } from 'react'

export function useTypingEffect(strings, typingSpeed = 80, deletingSpeed = 40, pauseMs = 2000) {
  const [displayText, setDisplayText] = useState('')
  const [stringIndex, setStringIndex] = useState(0)
  const [phase, setPhase] = useState('typing') // 'typing' | 'pausing' | 'deleting'
  const pauseTimer = useRef(null)

  useEffect(() => {
    const current = strings[stringIndex % strings.length]

    if (phase === 'pausing') return

    const delay = phase === 'deleting' ? deletingSpeed : typingSpeed

    const timer = setTimeout(() => {
      if (phase === 'typing') {
        const next = current.slice(0, displayText.length + 1)
        setDisplayText(next)
        if (next.length === current.length) {
          setPhase('pausing')
          pauseTimer.current = setTimeout(() => setPhase('deleting'), pauseMs)
        }
      } else {
        const next = current.slice(0, displayText.length - 1)
        setDisplayText(next)
        if (next.length === 0) {
          setStringIndex((i) => (i + 1) % strings.length)
          setPhase('typing')
        }
      }
    }, delay)

    return () => clearTimeout(timer)
  }, [displayText, phase, stringIndex, strings, typingSpeed, deletingSpeed, pauseMs])

  useEffect(() => () => clearTimeout(pauseTimer.current), [])

  return displayText
}
