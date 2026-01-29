'use client'

import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Documentation</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
              <p className="text-muted-foreground mb-4">
                LogForge helps you transform legacy logging code into modern, structured JSON logging with AI assistance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Quick Mode</h2>
              <p className="text-muted-foreground mb-4">
                No login required. Simply paste your code, select the language, and click Transform.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Paste code directly into the editor</li>
                <li>Select your programming language</li>
                <li>Click "Transform Code"</li>
                <li>Copy or download the results</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Power Mode</h2>
              <p className="text-muted-foreground mb-4">
                Sign in with GitHub to transform entire repositories and create pull requests automatically.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Browse your GitHub repositories</li>
                <li>Scan repos for logging patterns</li>
                <li>Preview transformations</li>
                <li>Create PRs with one click</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Supported Languages</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Python', 'JavaScript', 'TypeScript', 'Java', 'Go', 'Ruby', 'PHP', 'C#'].map((lang) => (
                  <div key={lang} className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 text-center">
                    {lang}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Use structured key-value logging</li>
                <li>Include proper log levels (debug, info, warn, error)</li>
                <li>Add correlation/trace IDs for distributed systems</li>
                <li>Follow language-specific naming conventions</li>
                <li>Include context in log messages</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">API</h2>
              <p className="text-muted-foreground mb-4">
                LogForge provides a simple REST API for transforming code programmatically.
              </p>
              <div className="p-4 rounded-lg bg-muted">
                <pre className="text-sm overflow-x-auto">
{`POST /api/transform
Content-Type: application/json

{
  "input": "your code here",
  "language": "python"
}`}
                </pre>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
