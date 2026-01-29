import { NextRequest, NextResponse } from 'next/server'
import { transformLog } from '@/lib/ai/anthropic'

export async function POST(req: NextRequest) {
  try {
    const { input, language } = await req.json()
    
    if (!input || input.length > 10000) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    
    const result = await transformLog(input, language || 'python')
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Transform error:', error)
    return NextResponse.json(
      { error: 'Failed to transform code' },
      { status: 500 }
    )
  }
}
