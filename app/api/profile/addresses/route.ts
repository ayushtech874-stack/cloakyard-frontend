import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const addresses = await prisma.address.findMany({ where: { userId }, orderBy: { isDefault: 'desc' } })
  return NextResponse.json(addresses)
}

export async function POST(req: Request) {
  const body = await req.json()
  if (body.isDefault) {
    await prisma.address.updateMany({ where: { userId: body.userId }, data: { isDefault: false } })
  }
  const address = await prisma.address.create({ data: body })
  return NextResponse.json(address)
}

export async function PATCH(req: Request) {
  const { id, userId, ...data } = await req.json()
  if (data.isDefault) {
    await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } })
  }
  const address = await prisma.address.update({ where: { id }, data })
  return NextResponse.json(address)
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  await prisma.address.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
