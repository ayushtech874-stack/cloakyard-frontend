import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOrderConfirmations } from '@/lib/notifications'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = await req.json()

    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET!)
      .update(body)
      .digest('hex')

    if (expected !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    await prisma.order.update({
      where: { id: dbOrderId },
      data: { status: 'CONFIRMED', paymentId: razorpay_payment_id },
    })

    await sendOrderConfirmations(dbOrderId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
