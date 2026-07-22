import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { phone } = await req.json()
    
    if (!phone || phone.length !== 10) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }

    // TODO: Integrate real SMS provider (Twilio, Fast2SMS, MSG91, etc.)
    // For now, in development, we simulate a successful send.
    // The OTP is hardcoded to 123456 in verify-otp.ts for testing.
    console.log(`[SIMULATED SMS] OTP for ${phone} is 123456`)

    return NextResponse.json({ success: true, message: 'OTP sent successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
