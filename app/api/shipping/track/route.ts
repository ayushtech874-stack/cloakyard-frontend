import { NextResponse } from 'next/server'
import { trackOrder } from '@/lib/shiprocket'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const awb = searchParams.get('awb')
  if (!awb) return NextResponse.json({ error: 'AWB required' }, { status: 400 })
  const data = await trackOrder(awb)
  return NextResponse.json(data)
}
