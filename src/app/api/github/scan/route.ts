import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { scanRepository } from '@/lib/github/scanner'

export async function POST(req: NextRequest) {
  const session = await getSession()

  if (!session) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  try {
    const { owner, repo } = await req.json()

    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Owner and repo are required' },
        { status: 400 }
      )
    }

    const results = await scanRepository(owner, repo, session.githubToken)

    return NextResponse.json({
      success: true,
      results,
      totalFiles: results.length,
      totalMatches: results.reduce((sum, r) => sum + r.matchCount, 0),
    })
  } catch (error) {
    console.error('Scan error:', error)
    return NextResponse.json(
      { error: 'Failed to scan repository' },
      { status: 500 }
    )
  }
}
