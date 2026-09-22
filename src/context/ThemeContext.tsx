import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Lee el tema guardado o usa 'dark' por defecto
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark'
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved) return saved
    if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light'
    return 'dark'
  })

  // Aplica la clase al <html> cada vez que cambia el tema
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme debe usarse dentro de un ThemeProvider')
  return context
}