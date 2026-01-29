'use client'

export default function Hero() {
  return (
    <section className="pt-32 pb-16 px-4">
      <div className="container mx-auto max-w-4xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm font-medium">
          <span className="text-2xl">🔥</span>
          <span>Free • Instant • No Signup Required</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          Transform Your Logs to Structured JSON
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Instantly modernize your logging code with AI. Paste your code, get structured JSON logs with best practices built-in.
        </p>

        <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>No account needed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>8+ languages supported</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            <span>GitHub integration</span>
          </div>
        </div>
      </div>
    </section>
  )
}
