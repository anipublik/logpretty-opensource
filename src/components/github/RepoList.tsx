'use client'

import { useState, useEffect } from 'react'
import { Loader2, GitBranch, Star, GitFork } from 'lucide-react'
import ScanResults from './ScanResults'
import ScanProgressModal from './ScanProgressModal'

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

interface ScanResult {
  path: string
  language: string
  matchCount: number
  preview: string
  sha: string
  content: string
}

interface FileProgress {
  path: string
  status: 'pending' | 'scanning' | 'analyzing' | 'complete' | 'error'
  language?: string
  matchCount?: number
  content?: string
  sha?: string
}

interface Suggestion {
  path: string
  success: boolean
  original: string
  transformed: string | null
  library: string
  install: string
  tips: string[]
}

export default function RepoList() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedRepo, setSelectedRepo] = useState<string>('')
  
  // Progress modal state
  const [progressModalOpen, setProgressModalOpen] = useState(false)
  const [progressStep, setProgressStep] = useState<'fetching' | 'confirming' | 'scanning' | 'complete'>('fetching')
  const [fileProgress, setFileProgress] = useState<FileProgress[]>([])
  
  // Results state
  const [scanResults, setScanResults] = useState<ScanResult[] | null>(null)
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null)

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

  const startScan = async (repo: Repo) => {
    setSelectedRepo(repo.full_name)
    setProgressModalOpen(true)
    setProgressStep('fetching')
    setFileProgress([])
    
    try {
      const [owner, repoName] = repo.full_name.split('/')
      
      // Step 1: Fetch files from repository
      const scanResponse = await fetch('/api/github/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, repo: repoName }),
      })

      if (!scanResponse.ok) {
        throw new Error('Failed to fetch repository files')
      }

      const scanData = await scanResponse.json()
      const files: ScanResult[] = scanData.results || []
      
      if (files.length === 0) {
        alert('No logging statements found in this repository.')
        setProgressModalOpen(false)
        return
      }

      // Initialize file progress
      const initialProgress: FileProgress[] = files.map(f => ({
        path: f.path,
        status: 'pending',
        language: f.language,
        content: f.content,
        sha: f.sha,
      }))
      setFileProgress(initialProgress)
      
      // Step 2: Show confirmation
      setProgressStep('confirming')
    } catch (err) {
      console.error('Scan error:', err)
      alert('Failed to scan repository. Please try again.')
      setProgressModalOpen(false)
    }
  }

  const confirmAndScan = async () => {
    setProgressStep('scanning')
    
    try {
      const allSuggestions: Suggestion[] = []
      const completedResults: ScanResult[] = []
      
      // Process each file one by one with live updates
      for (let i = 0; i < fileProgress.length; i++) {
        const file = fileProgress[i]
        
        // Update to scanning
        setFileProgress(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'scanning' } : f
        ))
        
        await new Promise(resolve => setTimeout(resolve, 300)) // Visual delay
        
        // Update to analyzing
        setFileProgress(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'analyzing' } : f
        ))
        
        try {
          // Call AI to transform this file
          const transformResponse = await fetch('/api/github/suggest-transforms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              files: [{
                path: file.path,
                content: file.content,
                language: file.language,
              }]
            }),
          })
          
          if (transformResponse.ok) {
            const transformData = await transformResponse.json()
            const suggestion = transformData.suggestions[0]
            allSuggestions.push(suggestion)
            
            // Count matches in original content
            const matchCount = (file.content?.match(/console\.|print\(|logger\./g) || []).length
            
            completedResults.push({
              path: file.path,
              language: file.language || 'unknown',
              matchCount,
              preview: file.content?.split('\n').find(line => /console\.|print\(|logger\./.test(line))?.trim().substring(0, 100) || '',
              sha: file.sha || '',
              content: file.content || '',
            })
            
            // Update to complete
            setFileProgress(prev => prev.map((f, idx) => 
              idx === i ? { ...f, status: 'complete', matchCount } : f
            ))
          } else {
            throw new Error('Transform failed')
          }
        } catch (err) {
          console.error(`Error processing ${file.path}:`, err)
          setFileProgress(prev => prev.map((f, idx) => 
            idx === i ? { ...f, status: 'error' } : f
          ))
        }
      }
      
      // All done - show results
      setScanResults(completedResults)
      setSuggestions(allSuggestions)
      setProgressStep('complete')
      
      // Auto-close progress modal and show results after 1 second
      setTimeout(() => {
        setProgressModalOpen(false)
      }, 1500)
      
    } catch (err) {
      console.error('Scanning error:', err)
      alert('Failed to complete scan. Please try again.')
      setProgressModalOpen(false)
    }
  }

  const cancelScan = () => {
    setProgressModalOpen(false)
    setFileProgress([])
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
              <button 
                onClick={() => startScan(repo)}
                className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
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

      <ScanProgressModal
        isOpen={progressModalOpen}
        onClose={cancelScan}
        repoName={selectedRepo}
        files={fileProgress}
        currentStep={progressStep}
        onConfirm={confirmAndScan}
        onCancel={cancelScan}
      />

      {scanResults && suggestions && (
        <ScanResults
          repoName={selectedRepo}
          results={scanResults}
          suggestions={suggestions}
          onClose={() => {
            setScanResults(null)
            setSuggestions(null)
            setSelectedRepo('')
          }}
        />
      )}
    </div>
  )
}
