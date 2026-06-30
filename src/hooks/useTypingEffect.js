import { useEffect, useState } from 'react'

export function useTypingEffect(strings, typingSpeed = 80, deletingSpeed = 40, pauseMs = 2000) {
  const [displayText, setDisplayText] = useState('')
  const [stringIndex, setStringIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = strings[stringIndex % strings.length]

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayText(current.slice(0, displayText.length + 1))
          if (displayText.length + 1 === current.length) {
            setTimeout(() => setIsDeleting(true), pauseMs)
          }
        } else {
          setDisplayText(current.slice(0, displayText.length - 1))
          if (displayText.length === 0) {
            setIsDeleting(false)
            setStringIndex((i) => (i + 1) % strings.length)
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    )

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, stringIndex, strings, typingSpeed, deletingSpeed, pauseMs])

  return displayText
}
