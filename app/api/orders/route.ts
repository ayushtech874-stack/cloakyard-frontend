import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const orders = await prisma.order.findMany({
    where: { userId },
    include: { items: { include: { product: { include: { images: { take: 1 } } } } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(orders)
}
