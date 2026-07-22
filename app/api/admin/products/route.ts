import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const verifyAdmin = (req: Request) => {
  const authHeader = req.headers.get('authorization')
  return authHeader === `Bearer ${process.env.ADMIN_PASSWORD}`
}

export async function GET(req: Request) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        variants: true,
        images: { orderBy: { position: 'asc' } },
      }
    })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { name, slug, description, fabric, careInstructions, fitType, gender, isActive, isNew, isFeatured, variants, images } = await req.json()
    
    // Create product
    const product = await prisma.product.create({
      data: {
        name, slug, description, fabric, careInstructions, fitType, gender, isActive, isNew, isFeatured,
        variants: {
          create: variants.map((v: any) => ({
            size: v.size,
            colour: v.colour,
            price: parseInt(v.price),
            stock: parseInt(v.stock),
            sku: v.sku
          }))
        },
        images: {
          create: images.map((img: string, i: number) => ({
            url: img,
            position: i
          }))
        }
      },
      include: { variants: true, images: true }
    })
    
    return NextResponse.json(product)
  } catch (error: any) {
    console.error('Product creation error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 })
  }
}
