'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  appliedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')
  const [appliedTheme, setAppliedTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('theme') as Theme
    if (saved) {
      setTheme(saved)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    let themeToApply: 'light' | 'dark' = 'light'

    if (theme === 'system') {
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches
      themeToApply = systemPreference ? 'dark' : 'light'
    } else {
      themeToApply = theme
    }

    root.classList.remove('light', 'dark')
    if (themeToApply === 'dark') {
      root.classList.add('dark')
    }

    setAppliedTheme(themeToApply)
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  useEffect(() => {
    if (!mounted || theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light'
      const root = window.document.documentElement
      root.classList.remove('light', 'dark')
      if (newTheme === 'dark') {
        root.classList.add('dark')
      }
      setAppliedTheme(newTheme)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, mounted])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, appliedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    return { theme: 'system' as Theme, setTheme: () => {}, appliedTheme: 'light' as 'light' | 'dark', mode: 'system' as 'light' | 'dark' | 'system' }
  }
  return context
}
