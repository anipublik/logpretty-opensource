import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID
  const callbackUrl = process.env.GITHUB_CALLBACK_URL

  if (!clientId || !callbackUrl) {
    return NextResponse.json(
      { error: 'GitHub OAuth not configured' },
      { status: 500 }
    )
  }

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${callbackUrl}&scope=repo,user:email`

  return NextResponse.redirect(githubAuthUrl)
}
