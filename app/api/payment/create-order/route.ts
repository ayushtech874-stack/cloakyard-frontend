import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Razorpay from 'razorpay'
import { sendOrderConfirmations } from '@/lib/notifications'

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_SECRET!,
})

export async function POST(req: Request) {
  try {
    const { userId, cartItems, addressId, shippingCost, paymentMethod } = await req.json()

    const address = await prisma.address.findUnique({ where: { id: addressId } })
    if (!address) return NextResponse.json({ error: 'Address not found' }, { status: 400 })

    const subtotal = cartItems.reduce((sum: number, i: { price: number; quantity: number }) => sum + i.price * i.quantity, 0)
    const total = subtotal + (shippingCost ?? 0)

    const rpOrder = await razorpay.orders.create({
      amount: total,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    })

    const order = await prisma.order.create({
      data: {
        userId,
        razorpayOrderId: rpOrder.id,
        status: 'PLACED',
        subtotal,
        shippingCost: shippingCost ?? 0,
        total,
        paymentMethod,
        addressSnapshot: {
          name: address.name, phone: address.phone, flat: address.flat,
          area: address.area, city: address.city, state: address.state, pincode: address.pincode,
        },
        items: {
          create: cartItems.map((i: { productId: string; variantId: string; size: string; colour: string; quantity: number; price: number }) => ({
            productId: i.productId,
            variantId: i.variantId,
            size: i.size,
            colour: i.colour,
            quantity: i.quantity,
            price: i.price,
          })),
        },
      },
    })

    if (paymentMethod === 'cod') {
      await sendOrderConfirmations(order.id)
    }

    return NextResponse.json({ rpOrderId: rpOrder.id, dbOrderId: order.id, total })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
