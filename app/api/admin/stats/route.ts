import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  try {
    const ordersToday = await prisma.order.findMany({
      where: {
        createdAt: { gte: today },
        status: { not: 'CANCELLED' }
      }
    })

    const revenueToday = ordersToday.reduce((sum, order) => sum + order.total, 0)
    
    const pendingCustom = await prisma.customOrder.count({
      where: { status: 'SUBMITTED' }
    })

    const openTickets = await prisma.supportTicket.count({
      where: { status: 'OPEN' }
    })

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    })

    return NextResponse.json({
      revenueToday,
      ordersTodayCount: ordersToday.length,
      pendingCustom,
      openTickets,
      recentOrders
    })
  } catch (error) {
    console.error('Admin Stats Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
