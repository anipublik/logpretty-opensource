'use client'

import { Github } from 'lucide-react'

export default function LoginButton() {
  const handleLogin = () => {
    window.location.href = '/api/auth/github'
  }

  return (
    <button
      onClick={handleLogin}
      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold hover:shadow-lg transition-all"
    >
      <Github className="h-5 w-5" />
      Sign in with GitHub
    </button>
  )
}
