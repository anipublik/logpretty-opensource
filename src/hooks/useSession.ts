'use client'

import { useState, useEffect } from 'react'

interface Session {
  userId: string
  username: string
  githubToken: string
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSession()
  }, [])

  const fetchSession = async () => {
    try {
      const response = await fetch('/api/auth/session')
      if (response.ok) {
        const data = await response.json()
        setSession(data.session)
      }
    } catch (error) {
      console.error('Failed to fetch session:', error)
    } finally {
      setLoading(false)
    }
  }

  return { session, loading }
}
