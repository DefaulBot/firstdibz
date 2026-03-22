import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ ok: true, service: 'jani-website-next', ts: new Date().toISOString() })
}
