import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    include: { product: { include: { images: { orderBy: { position: 'asc' }, take: 1 }, variants: true } } },
  })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  const { userId, productId } = await req.json()
  const existing = await prisma.wishlistItem.findUnique({ where: { userId_productId: { userId, productId } } })
  if (existing) {
    await prisma.wishlistItem.delete({ where: { userId_productId: { userId, productId } } })
    return NextResponse.json({ action: 'removed' })
  }
  const item = await prisma.wishlistItem.create({ data: { userId, productId } })
  return NextResponse.json({ action: 'added', item })
}
