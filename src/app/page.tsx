'use client'

import { useState } from 'react'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import Hero from '@/components/shared/Hero'
import TransformPanel from '@/components/quick/TransformPanel'
import RepoList from '@/components/github/RepoList'
import LoginButton from '@/components/auth/LoginButton'
import DocsModal from '@/components/shared/DocsModal'
import { useSession } from '@/hooks/useSession'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'quick' | 'github' | 'docs'>('quick')
  const { session } = useSession()
  const [docsOpen, setDocsOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="relative overflow-hidden">
        <Hero />
        
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-800 p-1 bg-muted">
                <button
                  onClick={() => setActiveTab('quick')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'quick'
                      ? 'bg-background shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Quick Transform
                </button>
                <button
                  onClick={() => setActiveTab('github')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'github'
                      ? 'bg-background shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  GitHub Repos
                </button>
                <button
                  onClick={() => {
                    setActiveTab('docs')
                    setDocsOpen(true)
                  }}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    activeTab === 'docs'
                      ? 'bg-background shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  📖 Docs
                </button>
              </div>
            </div>

            <div className="mt-8">
              {activeTab === 'quick' && <TransformPanel />}
              
              {activeTab === 'github' && (
                <div>
                  {session ? (
                    <RepoList />
                  ) : (
                    <div className="text-center py-20">
                      <h3 className="text-2xl font-bold mb-4">
                        Sign in to access your GitHub repos
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Scan entire repositories and create PRs automatically
                      </p>
                      <LoginButton />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Documentation Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Transform your legacy logging code into modern, structured JSON logs with AI-powered assistance
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Paste Your Code</h3>
                <p className="text-muted-foreground">
                  Simply paste your existing logging code or upload files. No account required.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-bold mb-2">AI Transformation</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your code and transforms it to structured JSON logging with best practices.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Download & Deploy</h3>
                <p className="text-muted-foreground">
                  Copy or download your transformed code and deploy it immediately to production.
                </p>
              </div>
            </div>

            <div className="mt-16">
              <h3 className="text-2xl font-bold mb-6 text-center">Supported Languages</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Python', 'JavaScript', 'TypeScript', 'Java', 'Go', 'Ruby', 'PHP', 'C#'].map((lang) => (
                  <div key={lang} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-center font-medium">
                    {lang}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <DocsModal isOpen={docsOpen} onClose={() => {
        setDocsOpen(false)
        setActiveTab('quick')
      }} />
    </div>
  )
}
