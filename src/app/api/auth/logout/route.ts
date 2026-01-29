import { NextRequest, NextResponse } from 'next/server'
import { clearSession } from '@/lib/auth/session'

export async function POST(req: NextRequest) {
  await clearSession()
  return NextResponse.json({ success: true })
}
