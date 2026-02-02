'use client'

import { useState, useEffect } from 'react'
import { X, FileCode, Loader2, CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react'

interface ScanResult {
  path: string
  language: string
  matchCount: number
  preview: string
  sha: string
  content: string
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

interface ScanResultsProps {
  repoName: string
  results: ScanResult[]
  suggestions: Suggestion[]
  onClose: () => void
}

export default function ScanResults({ repoName, results, suggestions, onClose }: ScanResultsProps) {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set(results.map(r => r.path)))
  const [transforming, setTransforming] = useState(false)
  const [transformed, setTransformed] = useState(false)
  const [prUrl, setPrUrl] = useState<string | null>(null)
  const [prNumber, setPrNumber] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set())

  const toggleFile = (path: string) => {
    const newSelected = new Set(selectedFiles)
    if (newSelected.has(path)) {
      newSelected.delete(path)
    } else {
      newSelected.add(path)
    }
    setSelectedFiles(newSelected)
  }

  const toggleExpanded = (path: string) => {
    const newExpanded = new Set(expandedFiles)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedFiles(newExpanded)
  }

  const toggleAll = () => {
    if (selectedFiles.size === results.length) {
      setSelectedFiles(new Set())
    } else {
      setSelectedFiles(new Set(results.map(r => r.path)))
    }
  }

  const handleCreatePR = async () => {
    setTransforming(true)
    setError(null)
    
    try {
      const [owner, repo] = repoName.split('/')
      
      const filesToTransform = results
        .filter(r => selectedFiles.has(r.path))
        .map(r => ({
          path: r.path,
          sha: r.sha,
          language: r.language,
        }))

      const response = await fetch('/api/github/create-pr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner,
          repo,
          files: filesToTransform,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create pull request')
      }

      const data = await response.json()
      setPrUrl(data.prUrl)
      setPrNumber(data.prNumber)
      setTransformed(true)
      
      // Redirect to GitHub PR after 2 seconds
      setTimeout(() => {
        if (data.prUrl) {
          window.open(data.prUrl, '_blank')
        }
      }, 2000)
    } catch (err) {
      console.error('Transform error:', err)
      setError('Failed to create pull request. Please try again.')
    } finally {
      setTransforming(false)
    }
  }

  const totalMatches = results.reduce((sum, r) => sum + r.matchCount, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-background rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-background/95 backdrop-blur-sm">
          <div>
            <h2 className="text-2xl font-bold">Scan Results</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {repoName} • {results.length} files • {totalMatches} logging statements
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-6">
          {results.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No logging statements found in this repository.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Select All */}
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <input
                  type="checkbox"
                  checked={selectedFiles.size === results.length}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="font-medium">
                  {selectedFiles.size === results.length ? 'Deselect All' : 'Select All'} ({selectedFiles.size} selected)
                </span>
              </div>

              {/* File List with Suggestions */}
              {results.map((result) => {
                const suggestion = suggestions.find(s => s.path === result.path)
                const isExpanded = expandedFiles.has(result.path)
                
                return (
                  <div
                    key={result.path}
                    className={`rounded-lg border transition-all ${
                      selectedFiles.has(result.path)
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10'
                        : 'border-gray-200 dark:border-gray-800'
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedFiles.has(result.path)}
                          onChange={() => toggleFile(result.path)}
                          className="mt-1 w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <button
                              onClick={() => toggleExpanded(result.path)}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                            >
                              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </button>
                            <FileCode className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-mono text-sm font-medium truncate">{result.path}</span>
                            <span className="px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-800 text-muted-foreground">
                              {result.language}
                            </span>
                            <span className="px-2 py-0.5 rounded text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                              {result.matchCount} {result.matchCount === 1 ? 'match' : 'matches'}
                            </span>
                          </div>
                          {suggestion && suggestion.success && (
                            <div className="text-xs text-green-600 dark:text-green-400 mb-2">
                              ✓ AI transformation ready
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && suggestion && (
                        <div className="mt-4 space-y-4">
                          {/* Tips */}
                          {suggestion.tips.length > 0 && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                              <h4 className="text-sm font-semibold mb-2 text-blue-900 dark:text-blue-100">AI Suggestions:</h4>
                              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                                {suggestion.tips.map((tip, i) => (
                                  <li key={i}>• {tip}</li>
                                ))}
                              </ul>
                              {suggestion.library !== 'unknown' && (
                                <div className="mt-2 text-xs text-blue-700 dark:text-blue-300">
                                  <strong>Recommended:</strong> {suggestion.library}
                                  {suggestion.install && <code className="ml-2 bg-blue-100 dark:bg-blue-800 px-2 py-0.5 rounded">{suggestion.install}</code>}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Side-by-side diff */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-xs font-semibold mb-2 text-red-600 dark:text-red-400">Original Code</h4>
                              <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-x-auto max-h-96 overflow-y-auto border border-red-200 dark:border-red-800">
                                <code>{suggestion.original}</code>
                              </pre>
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold mb-2 text-green-600 dark:text-green-400">Transformed Code</h4>
                              <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-x-auto max-h-96 overflow-y-auto border border-green-200 dark:border-green-800">
                                <code>{suggestion.transformed || 'Failed to transform'}</code>
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="sticky bottom-0 px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-background/95 backdrop-blur-sm">
            {error && (
              <div className="mb-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            {transformed && prUrl && (
              <div className="mb-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm">
                ✅ Pull request created successfully!{' '}
                <a href={prUrl} target="_blank" rel="noopener noreferrer" className="underline font-medium">
                  View PR
                </a>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {selectedFiles.size} file{selectedFiles.size !== 1 ? 's' : ''} selected
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {transformed ? 'Close' : 'Cancel'}
                </button>
                {!transformed && (
                  <button
                    onClick={handleCreatePR}
                    disabled={selectedFiles.size === 0 || transforming}
                    className="px-6 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {transforming ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating PR...
                      </>
                    ) : (
                      'Create PR with Transformations'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
