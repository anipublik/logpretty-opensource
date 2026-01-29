'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageSquare, Home } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import DocsModal from './DocsModal'
import Link from 'next/link'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [insightsOpen, setInsightsOpen] = useState(false)
  const [capabilitiesOpen, setCapabilitiesOpen] = useState(false)
  const [docsOpen, setDocsOpen] = useState(false)
  const [parentDomain, setParentDomain] = useState('')
  const insightsRef = useRef<HTMLDivElement>(null)
  const capabilitiesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const getParentDomain = () => {
      const hostname = window.location.hostname

      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'https://techani.org'
      }

      const parts = hostname.split('.')
      if (parts.length > 2) {
        const parentHost = parts.slice(-2).join('.')
        return `https://${parentHost}`
      }

      return window.location.origin
    }

    setParentDomain(getParentDomain())
  }, [])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (insightsRef.current && !insightsRef.current.contains(e.target as Node)) {
        setInsightsOpen(false)
      }
      if (capabilitiesRef.current && !capabilitiesRef.current.contains(e.target as Node)) {
        setCapabilitiesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="fixed top-0 w-full z-50 bg-transparent transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between relative">
        {/* Logo */}
        <div className="flex items-center gap-3 z-20">
          <Link href="/" className="text-xl font-bold text-foreground hover:text-orange-500 transition-colors">
            LogForge
          </Link>
        </div>

        {/* Navigation Island - Centered Capsule */}
        <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-14 px-8 items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-neumorphic-raised z-10">
          <a href={parentDomain} className="group relative inline-flex items-center h-10 px-4 rounded-lg text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5">
            <span>Home</span>
          </a>
          <Link href={`${parentDomain}/tools`} className="group relative inline-flex items-center h-10 px-4 rounded-lg text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5">
            <span>Tools</span>
          </Link>
          <Link href={`${parentDomain}/case-studies`} className="group relative inline-flex items-center h-10 px-4 rounded-lg text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5">
            <span>Case Studies</span>
          </Link>
          
          {/* Capabilities Dropdown */}
          <div ref={capabilitiesRef} className="relative">
            <button
              type="button"
              onClick={() => setCapabilitiesOpen((v) => !v)}
              className="group relative inline-flex items-center h-10 px-4 rounded-lg text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
              aria-expanded={capabilitiesOpen}
              aria-haspopup="true"
            >
              <span>Capabilities</span>
              <svg className={`ml-1.5 h-3 w-3 transition-transform duration-200 ${capabilitiesOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {capabilitiesOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-56 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
                <div className="p-2">
                  <Link href={`${parentDomain}/capabilities`} onClick={() => setCapabilitiesOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-[13px] rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 text-sm">◎</span>
                    <span className="font-medium">Overview</span>
                  </Link>
                  <Link href={`${parentDomain}/capabilities/platform`} onClick={() => setCapabilitiesOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-[13px] rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 text-sm">⚡</span>
                    <span className="font-medium">Platform Engineering</span>
                  </Link>
                  <Link href={`${parentDomain}/capabilities/reliability`} onClick={() => setCapabilitiesOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-[13px] rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 text-sm">⚙</span>
                    <span className="font-medium">Reliability Engineering</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Insights Dropdown */}
          <div ref={insightsRef} className="relative">
            <button
              type="button"
              onClick={() => setInsightsOpen((v) => !v)}
              className="group relative inline-flex items-center h-10 px-4 rounded-lg text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
              aria-expanded={insightsOpen}
              aria-haspopup="true"
            >
              <span>Insights</span>
              <svg className={`ml-1.5 h-3 w-3 transition-transform duration-200 ${insightsOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {insightsOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-48 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900">
                <div className="p-2">
                  <Link href={`${parentDomain}/insights`} onClick={() => setInsightsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-[13px] rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 text-sm">📝</span>
                    <span className="font-medium">Core Insights</span>
                  </Link>
                  <Link href={`${parentDomain}/insights/lab`} onClick={() => setInsightsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-[13px] rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white">
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 text-sm">🔬</span>
                    <span className="font-medium">Insights Lab</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link href={`${parentDomain}/references`} className="group relative inline-flex items-center h-10 px-4 rounded-lg text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5">
            <span>References</span>
          </Link>
          <Link href={`${parentDomain}/contact`} className="group relative inline-flex items-center h-10 px-4 rounded-lg text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5">
            <span>Contact</span>
          </Link>
        </nav>

        {/* Right Side - Message + Theme Toggle */}
        <div className="hidden md:flex items-center gap-2 z-20">
          <button
            onClick={() => setDocsOpen(true)}
            className="flex items-center justify-center p-3 rounded-full text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            aria-label="Help"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setDocsOpen(true)}
            className="flex items-center justify-center p-2.5 rounded-full text-muted-foreground hover:text-foreground transition-all"
            aria-label="Help"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-gray-200 dark:border-gray-800 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setOpen(!open)}
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 top-0 h-0.5 w-5 bg-gray-900 dark:bg-white transition-all duration-200 ${open ? 'translate-y-1.5 rotate-45' : ''}`}></span>
              <span className={`absolute left-0 top-1.5 h-0.5 w-5 bg-gray-900 dark:bg-white transition-all duration-200 ${open ? 'opacity-0 scale-x-0' : 'opacity-100'}`}></span>
              <span className={`absolute left-0 top-3 h-0.5 w-5 bg-gray-900 dark:bg-white transition-all duration-200 ${open ? '-translate-y-1.5 -rotate-45' : ''}`}></span>
            </span>
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-4 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-lg overflow-hidden">
            <nav className="px-3 py-3 text-[13px] font-medium flex flex-col gap-0.5 text-gray-900 dark:text-white">
              <a href={parentDomain} className="h-12 flex items-center gap-3 px-3 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setOpen(false)}>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-800 text-sm">🏠</span>
                <span>Home</span>
              </a>
              <Link href={`${parentDomain}/tools`} className="h-12 flex items-center gap-3 px-3 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setOpen(false)}>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-800 text-sm">🛠</span>
                <span>Tools</span>
              </Link>
              <Link href={`${parentDomain}/case-studies`} className="h-12 flex items-center gap-3 px-3 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setOpen(false)}>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-800 text-sm">📊</span>
                <span>Case Studies</span>
              </Link>
              <Link href={`${parentDomain}/references`} className="h-12 flex items-center gap-3 px-3 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setOpen(false)}>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-800 text-sm">💬</span>
                <span>References</span>
              </Link>
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                <Link href={`${parentDomain}/contact`} className="h-12 flex items-center gap-3 px-3 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setOpen(false)}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-800 text-sm">✉️</span>
                  <span>Contact</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
      <DocsModal isOpen={docsOpen} onClose={() => setDocsOpen(false)} />
    </header>
  )
}
