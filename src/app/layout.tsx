import { ThemeProvider } from '@/context/ThemeContext'
import './globals.css'

export const metadata = {
  title: 'LogPretty - Transform Your Logs to Structured JSON',
  description: 'Free, instant log transformation. No signup required. Transform messy logs to structured JSON with AI.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
