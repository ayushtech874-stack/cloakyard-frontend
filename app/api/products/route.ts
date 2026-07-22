import { NextResponse } from 'next/server'
import { fetchWooCommerce } from '@/lib/woocommerce'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    
    // Try to fetch from WooCommerce
    const wooProducts = await fetchWooCommerce('products?status=publish&per_page=20')
    
    if (wooProducts && Array.isArray(wooProducts) && wooProducts.length > 0) {
      // Map WooCommerce structure to our frontend structure
      const formatted = wooProducts.map((p: any) => ({
        id: p.id.toString(),
        slug: p.slug,
        name: p.name,
        fitType: p.attributes?.find((a:any) => a.name.toLowerCase() === 'fit')?.options[0]?.toLowerCase() || 'normal',
        gender: p.attributes?.find((a:any) => a.name.toLowerCase() === 'gender')?.options[0]?.toLowerCase() || 'unisex',
        isNew: true,
        status: 'new',
        sizes: p.attributes?.find((a:any) => a.name.toLowerCase() === 'size')?.options || ['S', 'M', 'L'],
        images: p.images?.length > 0 ? p.images.map((img:any) => ({ url: img.src })) : [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800' }],
        // Store price in cents to match old schema
        variants: [{ id: 'v' + p.id, price: parseInt(p.price || p.regular_price || '0') * 100, colour: 'Black', size: 'M', stock: p.stock_quantity || 10 }]
      }))
      return NextResponse.json(formatted)
    }

    // Fallback to empty array if WooCommerce is empty or failing
    console.log("WooCommerce returned empty")
    return NextResponse.json([])
  } catch (error) {
    console.error("Failed to fetch from WooCommerce:", error)
    return NextResponse.json([])
  }
}
