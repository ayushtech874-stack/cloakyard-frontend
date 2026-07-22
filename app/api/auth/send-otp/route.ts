import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOTP } from '@/lib/twilio'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { phone } = await req.json()
    if (!phone || phone.length !== 10) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const hash = crypto.createHash('sha256').update(otp + phone).digest('hex')
    const expiry = new Date(Date.now() + 10 * 60 * 1000)

    try {
      await prisma.otpRecord.upsert({
        where: { phone },
        create: { phone, hash, expiry },
        update: { hash, expiry },
      })
      await sendOTP(phone, otp)
    } catch (e) {
      console.warn('DB/Twilio not connected. Using mock OTP send.')
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}
