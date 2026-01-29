import { NextRequest, NextResponse } from 'next/server'
import { createSession, setSessionCookie } from '@/lib/auth/session'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', req.url))
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      throw new Error(tokenData.error_description || 'Failed to get access token')
    }

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const userData = await userResponse.json()

    const sessionToken = await createSession({
      userId: userData.id.toString(),
      username: userData.login,
      githubToken: tokenData.access_token,
    })

    await setSessionCookie(sessionToken)

    return NextResponse.redirect(new URL('/', req.url))
  } catch (error) {
    console.error('GitHub OAuth error:', error)
    return NextResponse.redirect(new URL('/?error=auth_failed', req.url))
  }
}
