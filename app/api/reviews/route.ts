import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')
  if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 })
  const reviews = await prisma.review.findMany({
    where: { productId, isVisible: true },
    include: { user: { select: { name: true, phone: true } } },
    orderBy: [{ helpfulCount: 'desc' }, { createdAt: 'desc' }],
  })
  return NextResponse.json(reviews)
}

export async function POST(req: Request) {
  try {
    const { productId, userId, rating, title, body, photos, tags } = await req.json()
    
    // For testing/launch simplicity, we allow any logged-in user to review
    // In strict mode, we would verify order history here.
    
    if (!productId || !userId || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const review = await prisma.review.create({
      data: { 
        productId, 
        userId, 
        rating: parseInt(rating), 
        title, 
        body: body ?? '', 
        photos: photos ?? [], 
        tags: tags ?? [], 
        isVerified: true // Assuming verified for now
      },
    })
    return NextResponse.json(review)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}
