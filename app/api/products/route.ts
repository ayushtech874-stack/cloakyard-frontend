import { NextResponse } from 'next/server'
import { fetchWooCommerce } from '@/lib/woocommerce'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    
    // Try to fetch from WooCommerce
    const wooProducts = await fetchWooCommerce('products?status=publish&per_page=20')
    
    if (wooProducts && Array.isArray(wooProducts) && wooProducts.length > 0) {
      // Map WooCommerce structure to our frontend structure
      const formatted = wooProducts.map((p: any) => {
        const sizes = p.attributes?.find((a:any) => a.name.toLowerCase() === 'size')?.options || ['S', 'M', 'L', 'XL', 'XXL']
        const basePrice = parseInt(p.price || p.regular_price || '0') * 100
        const stockQty = p.stock_quantity === null || p.stock_quantity === undefined ? 10 : p.stock_quantity
        const colour = p.attributes?.find((a:any) => a.name.toLowerCase() === 'color' || a.name.toLowerCase() === 'colour')?.options[0] || 'Black'
        
        return {
          id: p.id.toString(),
          slug: p.slug,
          name: p.name,
          fitType: p.attributes?.find((a:any) => a.name.toLowerCase() === 'fit')?.options[0]?.toLowerCase() || 'oversize',
          gender: p.attributes?.find((a:any) => a.name.toLowerCase() === 'gender')?.options[0]?.toLowerCase() || 'unisex',
          isNew: true,
          status: 'new',
          sizes: sizes,
          images: p.images?.length > 0 ? p.images.map((img:any) => ({ url: img.src })) : [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800' }],
          // Generate a variant for each size so they don't show as Out of Stock
          variants: sizes.map((size: string, idx: number) => ({ 
            id: `v${p.id}-${idx}`, 
            price: basePrice, 
            colour: colour, 
            size: size, 
            stock: stockQty 
          }))
        }
      })
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
