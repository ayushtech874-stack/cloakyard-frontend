import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { notifications: true } })
  return NextResponse.json(user)
}

export async function PATCH(req: Request) {
  const { userId, ...data } = await req.json()
  const user = await prisma.user.update({ where: { id: userId }, data })
  return NextResponse.json(user)
}
