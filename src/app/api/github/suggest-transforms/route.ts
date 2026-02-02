import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { transformLog } from '@/lib/ai/anthropic'

interface SuggestRequest {
  files: Array<{
    path: string
    content: string
    language: string
  }>
}

export async function POST(req: NextRequest) {
  const session = await getSession()

  if (!session) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  try {
    const { files } = await req.json() as SuggestRequest

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Files are required' },
        { status: 400 }
      )
    }

    // Transform all files and get suggestions
    const suggestions = await Promise.all(
      files.map(async (file) => {
        try {
          const transformed = await transformLog(file.content, file.language)
          
          return {
            path: file.path,
            success: true,
            original: file.content,
            transformed: transformed.code,
            library: transformed.library,
            install: transformed.install,
            tips: transformed.tips,
          }
        } catch (error) {
          console.error(`Error transforming ${file.path}:`, error)
          return {
            path: file.path,
            success: false,
            original: file.content,
            transformed: null,
            library: 'unknown',
            install: '',
            tips: ['Failed to generate transformation suggestion.'],
          }
        }
      })
    )

    return NextResponse.json({
      success: true,
      suggestions,
    })
  } catch (error) {
    console.error('Suggestion error:', error)
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    )
  }
}
