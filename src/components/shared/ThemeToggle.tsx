'use client'

import { useState, useEffect, useRef } from 'react'
import { Sun, Moon, Monitor, Check } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export default function ThemeToggle() {
  const { theme, setTheme, appliedTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const selectMode = (newMode: 'light' | 'dark' | 'system') => {
    setTheme(newMode)
    setIsOpen(false)

    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setShowToast(true)
      setTimeout(() => setShowToast(false), 2000)
    }
  }

  const getModeLabel = (m: string) => {
    if (m === 'system') return 'Auto'
    return m.charAt(0).toUpperCase() + m.slice(1)
  }

  const getModeIcon = (m: string) => {
    if (m === 'system') return <Monitor className="h-5 w-5" />
    const finalTheme = m === 'system' ? appliedTheme : m
    return finalTheme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />
  }

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Theme settings"
          aria-expanded={isOpen}
          className="flex items-center justify-center p-3 rounded-full text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          {getModeIcon(theme)}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-3 w-48 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 z-50 bg-white dark:bg-gray-900 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-2 space-y-1">
              {(['light', 'dark', 'system'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => selectMode(m)}
                  className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 rounded-lg transition-colors ${
                    theme === m
                      ? 'text-orange-500 font-bold bg-orange-50 dark:bg-orange-900/10'
                      : 'text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-foreground'
                  }`}
                >
                  {getModeIcon(m)}
                  <span className="flex-1">{getModeLabel(m)}</span>
                  {theme === m && <Check className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {showToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 z-[2001] bg-white dark:bg-gray-900 text-foreground animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="flex items-center gap-3 text-sm font-medium">
            {getModeIcon(theme)}
            <span>Theme: {getModeLabel(theme)}</span>
          </div>
        </div>
      )}
    </>
  )
}
