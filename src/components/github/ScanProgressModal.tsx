'use client'

import { X, Loader2, CheckCircle2, AlertCircle, FileCode } from 'lucide-react'

interface FileProgress {
  path: string
  status: 'pending' | 'scanning' | 'analyzing' | 'complete' | 'error'
  language?: string
  matchCount?: number
}

interface ScanProgressModalProps {
  isOpen: boolean
  onClose: () => void
  repoName: string
  files: FileProgress[]
  currentStep: 'fetching' | 'confirming' | 'scanning' | 'complete'
  onConfirm?: () => void
  onCancel?: () => void
}

export default function ScanProgressModal({
  isOpen,
  onClose,
  repoName,
  files,
  currentStep,
  onConfirm,
  onCancel,
}: ScanProgressModalProps) {
  if (!isOpen) return null

  const completedFiles = files.filter(f => f.status === 'complete').length
  const totalFiles = files.length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] mx-4 bg-background rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-background/95 backdrop-blur-sm">
          <div>
            <h2 className="text-2xl font-bold">
              {currentStep === 'fetching' && '🔍 Fetching Repository Files'}
              {currentStep === 'confirming' && '📋 Review Files to Scan'}
              {currentStep === 'scanning' && '🍕 Scanning in Progress'}
              {currentStep === 'complete' && '✅ Scan Complete'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {repoName}
              {currentStep === 'scanning' && ` • ${completedFiles}/${totalFiles} files processed`}
            </p>
          </div>
          {currentStep !== 'scanning' && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-6">
          {currentStep === 'fetching' && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
              <p className="text-lg text-muted-foreground">Fetching files from repository...</p>
            </div>
          )}

          {currentStep === 'confirming' && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  Found <strong>{totalFiles} files</strong> with potential logging statements.
                  Click "Start Scan" to analyze these files with AI.
                </p>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-800"
                  >
                    <FileCode className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm flex-1">{file.path}</span>
                    {file.language && (
                      <span className="px-2 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-800">
                        {file.language}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 'scanning' && (
            <div className="space-y-3">
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg mb-4">
                <p className="text-sm text-orange-900 dark:text-orange-100">
                  🍕 Watch your files being transformed in real-time! Each file is being analyzed by AI...
                </p>
              </div>
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    file.status === 'complete'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                      : file.status === 'error'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/10'
                      : file.status === 'scanning' || file.status === 'analyzing'
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10'
                      : 'border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {file.status === 'pending' && (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                    )}
                    {(file.status === 'scanning' || file.status === 'analyzing') && (
                      <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
                    )}
                    {file.status === 'complete' && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {file.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm truncate">{file.path}</div>
                    <div className="text-xs text-muted-foreground">
                      {file.status === 'pending' && 'Waiting...'}
                      {file.status === 'scanning' && 'Scanning for logging patterns...'}
                      {file.status === 'analyzing' && 'AI is analyzing and transforming...'}
                      {file.status === 'complete' && `Found ${file.matchCount || 0} logging statements`}
                      {file.status === 'error' && 'Failed to process'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentStep === 'complete' && (
            <div className="text-center py-10">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Scan Complete!</h3>
              <p className="text-muted-foreground">
                Analyzed {totalFiles} files. Review the suggestions to create your PR.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {currentStep === 'confirming' && (
          <div className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-background/95 backdrop-blur-sm">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
            >
              Start Scan ({totalFiles} files)
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
