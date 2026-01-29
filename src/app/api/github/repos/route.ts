import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { Octokit } from '@octokit/rest'

export async function GET(req: NextRequest) {
  const session = await getSession()

  if (!session) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  }

  try {
    const octokit = new Octokit({ auth: session.githubToken })
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 100,
    })

    return NextResponse.json({ repos })
  } catch (error) {
    console.error('GitHub API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    )
  }
}
