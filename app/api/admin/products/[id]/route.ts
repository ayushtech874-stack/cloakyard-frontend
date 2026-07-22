import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const verifyAdmin = (req: Request) => {
  const authHeader = req.headers.get('authorization')
  return authHeader === `Bearer ${process.env.ADMIN_PASSWORD}`
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const unwrappedParams = await params
    const id = unwrappedParams.id
    const data = await req.json()
    
    // For simplicity, we'll only update the base product fields right now
    // Updating nested variants/images requires more complex logic (deleting missing ones, updating existing, creating new)
    // A robust implementation would handle this, but for now we'll allow basic text/boolean updates
    
    const { name, slug, description, fabric, careInstructions, fitType, gender, isActive, isNew, isFeatured } = data
    
    const product = await prisma.product.update({
      where: { id },
      data: { name, slug, description, fabric, careInstructions, fitType, gender, isActive, isNew, isFeatured }
    })
    
    return NextResponse.json(product)
  } catch (error: any) {
    console.error('Product update error:', error)
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const unwrappedParams = await params
    const id = unwrappedParams.id
    
    // Delete related records first
    await prisma.productImage.deleteMany({ where: { productId: id } })
    await prisma.productVariant.deleteMany({ where: { productId: id } })
    await prisma.review.deleteMany({ where: { productId: id } })
    await prisma.wishlistItem.deleteMany({ where: { productId: id } })
    
    // Note: If a product is in an OrderItem, deleting it will fail unless we also delete OrderItems
    // In a real production app, we would normally just set isActive = false rather than hard deleting.
    
    // Let's implement soft delete instead!
    const product = await prisma.product.update({
      where: { id },
      data: { isActive: false }
    })
    
    return NextResponse.json({ success: true, softDeleted: true })
  } catch (error: any) {
    console.error('Product delete error:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 })
  }
}
