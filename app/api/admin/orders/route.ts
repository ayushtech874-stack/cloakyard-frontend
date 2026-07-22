import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOrderShippedNotifications } from '@/lib/notifications'

const verifyAdmin = (req: Request) => {
  const authHeader = req.headers.get('authorization')
  return authHeader === `Bearer ${process.env.ADMIN_PASSWORD}`
}

export async function GET(req: Request) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        items: {
          include: {
            product: { select: { name: true } }
          }
        }
      }
    })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { orderId, status, trackingId } = await req.json()
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status,
        ...(trackingId !== undefined ? { trackingId } : {})
      }
    })

    if (status === 'SHIPPED') {
      await sendOrderShippedNotifications(orderId, trackingId)
    }

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
