'use client'

import ThemeToggle from './ThemeToggle'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-transparent transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between relative">
        {/* Logo */}
        <div className="flex items-center gap-3 z-20">
          <Link href="/" className="text-xl font-bold text-foreground hover:text-orange-500 transition-colors">
            LogPretty
          </Link>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center gap-2 z-20">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
