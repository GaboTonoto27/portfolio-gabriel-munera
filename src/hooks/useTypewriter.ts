import { useEffect, useState } from "react"

interface UseTypewriterOptions {
  words: string[]
  typeSpeed?: number   // Velocidad al escribir (ms)
  deleteSpeed?: number // Velocidad al borrar (ms)
  pauseTime?: number   // Pausa entre palabras (ms)
}

export function useTypewriter({
  words,
  typeSpeed = 100,
  deleteSpeed = 50,
  pauseTime = 2000,
}: UseTypewriterOptions) {
  const [displayText, setDisplayText] = useState("")
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = words[wordIndex % words.length]

    // Determinar la siguiente acción
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          // Escribiendo
          const next = currentWord.slice(0, displayText.length + 1)
          setDisplayText(next)
          if (next === currentWord) {
            // Palabra completa → esperar antes de borrar
            setTimeout(() => setIsDeleting(true), pauseTime)
          }
        } else {
          // Borrando
          const next = currentWord.slice(0, displayText.length - 1)
          setDisplayText(next)
          if (next === "") {
            setIsDeleting(false)
            setWordIndex((prev) => prev + 1)
          }
        }
      },
      isDeleting ? deleteSpeed : typeSpeed,
    )

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, wordIndex, words, typeSpeed, deleteSpeed, pauseTime])

  return displayText
}