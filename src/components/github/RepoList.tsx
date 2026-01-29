'use client'

import { useState, useEffect } from 'react'
import { Loader2, GitBranch, Star, GitFork } from 'lucide-react'

interface Repo {
  id: number
  name: string
  full_name: string
  description: string
  stargazers_count: number
  forks_count: number
  language: string
  updated_at: string
}

export default function RepoList() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRepos()
  }, [])

  const fetchRepos = async () => {
    try {
      const response = await fetch('/api/github/repos')
      
      if (!response.ok) {
        throw new Error('Failed to fetch repositories')
      }

      const data = await response.json()
      setRepos(data.repos || [])
    } catch (err) {
      setError('Failed to load repositories')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Your Repositories</h2>
        <p className="text-muted-foreground">
          Select a repository to scan for logging patterns
        </p>
      </div>

      <div className="grid gap-4">
        {repos.map((repo) => (
          <div
            key={repo.id}
            className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <GitBranch className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold text-lg">{repo.name}</h3>
                </div>
                {repo.description && (
                  <p className="text-muted-foreground text-sm mb-3">
                    {repo.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {repo.language && (
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="h-4 w-4" />
                    {repo.forks_count}
                  </span>
                </div>
              </div>
              <button className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors">
                Scan Repo
              </button>
            </div>
          </div>
        ))}
      </div>

      {repos.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No repositories found</p>
        </div>
      )}
    </div>
  )
}
