import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const DUMMY_PRODUCTS = [
  { id: '1', slug: 'void-oversized-tee', name: 'Void Oversized Tee', fitType: 'oversized', gender: 'unisex', fabric: '100% Cotton 240GSM', careInstructions: 'Machine wash cold, do not bleach, tumble dry low', description: 'The signature Cloakyard oversized tee. Dropped shoulders, extended hem, raw edge collar. Built for the streets.', isNew: true, images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800' }, { url: 'https://images.unsplash.com/photo-1503341733017-1901578f9f1e?w=800' }], variants: [{ id: 'v1', price: 89900, colour: 'Black', size: 'M', stock: 10 }, { id: 'v2', price: 89900, colour: 'Black', size: 'L', stock: 10 }, { id: 'v3', price: 89900, colour: 'White', size: 'M', stock: 10 }], reviews: [] },
  { id: '2', slug: 'phantom-boxy-tee', name: 'Phantom Boxy Tee', fitType: 'boxy', gender: 'men', isNew: true, images: [{ url: 'https://images.unsplash.com/photo-1503341733017-1901578f9f1e?w=800' }], variants: [{ id: 'v2', price: 89900, colour: 'White', size: 'M', stock: 10 }], reviews: [] },
]

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        variants: true,
        images: { orderBy: { position: 'asc' } },
        reviews: { include: { user: { select: { name: true } } }, where: { isVisible: true }, orderBy: { createdAt: 'desc' } },
      },
    })
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(product)
  } catch (error) {
    console.log("DB connection failed, returning DUMMY_PRODUCTS single")
    const { slug } = await params
    const p = DUMMY_PRODUCTS.find(x => x.slug === slug) || DUMMY_PRODUCTS[0]
    return NextResponse.json(p)
  }
}
