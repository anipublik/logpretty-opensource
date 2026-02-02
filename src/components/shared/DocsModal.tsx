'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'
import { siteConfig } from '@/config/site'

interface DocsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DocsModal({ isOpen, onClose }: DocsModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-background rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-background/95 backdrop-blur-sm">
          <h2 className="text-2xl font-bold">Documentation</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] px-6 py-6">
          <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-xl font-bold mb-4">Quick Mode</h3>
            <p className="text-muted-foreground mb-4">
              Transform your logging code instantly without any login required.
            </p>
            <ol className="space-y-2 mb-6">
              <li>Paste your logging code or upload a file</li>
              <li>Select your programming language</li>
              <li>Click "Transform Code"</li>
              <li>Copy or download the transformed JSON logging code</li>
            </ol>

            <h3 className="text-xl font-bold mb-4 mt-8">Power Mode</h3>
            <p className="text-muted-foreground mb-4">
              Connect your GitHub account to transform entire repositories.
            </p>
            <ol className="space-y-2 mb-6">
              <li>Sign in with GitHub</li>
              <li>Browse your repositories</li>
              <li>Select a repo to scan for logging patterns</li>
              <li>Review and create PRs with transformed code</li>
            </ol>

            <h3 className="text-xl font-bold mb-4 mt-8">Supported Languages</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {['Python', 'JavaScript', 'TypeScript', 'Java', 'Go', 'Ruby', 'PHP', 'C#'].map((lang) => (
                <div key={lang} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-center text-sm font-medium">
                  {lang}
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold mb-4 mt-8">Best Practices</h3>
            <ul className="space-y-2 mb-6 list-disc list-inside">
              <li>Use structured logging with consistent field names</li>
              <li>Include context like user IDs, request IDs, and timestamps</li>
              <li>Avoid logging sensitive information (passwords, tokens, PII)</li>
              <li>Use appropriate log levels (DEBUG, INFO, WARN, ERROR)</li>
              <li>Add correlation IDs for distributed tracing</li>
            </ul>

            <h3 className="text-xl font-bold mb-4 mt-8">Need Help?</h3>
            <p className="text-muted-foreground">
              If you encounter any issues or have questions, please email{' '}
              <a href={`mailto:${siteConfig.author.email}`} className="text-orange-500 hover:text-orange-600 underline">
                {siteConfig.author.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
