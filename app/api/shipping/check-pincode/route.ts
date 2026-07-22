import { NextResponse } from 'next/server'
import { checkPincode } from '@/lib/shiprocket'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const pincode = searchParams.get('pincode')
  if (!pincode) return NextResponse.json({ error: 'Pincode required' }, { status: 400 })
  const result = await checkPincode(pincode)
  return NextResponse.json(result)
}
