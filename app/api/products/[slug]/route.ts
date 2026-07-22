import { NextResponse } from 'next/server'
import { fetchWooCommerce } from '@/lib/woocommerce'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const slug = (await params).slug
    
    // Fetch from WooCommerce by slug
    const wooProducts = await fetchWooCommerce(`products?slug=${slug}`)
    
    if (wooProducts && Array.isArray(wooProducts) && wooProducts.length > 0) {
      const p = wooProducts[0]
      const sizes = p.attributes?.find((a:any) => a.name.toLowerCase() === 'size')?.options || ['S', 'M', 'L', 'XL', 'XXL']
      const rawPrice = p.price || p.regular_price || p.sale_price || '0'
      const parsedPrice = parseInt(rawPrice)
      const basePrice = (isNaN(parsedPrice) ? 0 : parsedPrice) * 100
      
      let parsedRegular = parseInt(p.regular_price || '0')
      if (isNaN(parsedRegular) || parsedRegular === 0) {
        if (p.price_html && p.price_html.includes('<del')) {
          const match = p.price_html.match(/<del[^>]*>.*?([\d,]+(\.\d+)?).*?<\/del>/)
          if (match && match[1]) {
            parsedRegular = parseInt(match[1].replace(/,/g, ''))
          }
        }
      }
      const parsedSale = parseInt(p.sale_price || '0')
      const regularPrice = (isNaN(parsedRegular) ? 0 : parsedRegular) * 100
      const salePrice = (isNaN(parsedSale) ? 0 : parsedSale) * 100
      const stockQty = p.stock_quantity === null || p.stock_quantity === undefined ? 10 : p.stock_quantity
      const colour = p.attributes?.find((a:any) => a.name.toLowerCase() === 'color' || a.name.toLowerCase() === 'colour')?.options[0] || 'Black'
      const isDrop = p.tags?.some((t:any) => t.name.toLowerCase() === 'drop') || false
      
      const formatted = {
        id: p.id.toString(),
        slug: p.slug,
        name: p.name,
        description: p.short_description ? p.short_description.replace(/<[^>]+>/g, '') : p.description.replace(/<[^>]+>/g, ''),
        fabric: '100% Premium French Terry Cotton (240 GSM)',
        careInstructions: 'Machine wash cold. Do not tumble dry. Iron on reverse.',
        fitType: p.attributes?.find((a:any) => a.name.toLowerCase() === 'fit')?.options[0]?.toLowerCase() || 'oversize',
        gender: p.attributes?.find((a:any) => a.name.toLowerCase() === 'gender')?.options[0]?.toLowerCase() || 'unisex',
        isNew: true,
        status: 'new',
        isDrop: isDrop,
        sizes: sizes,
        images: p.images?.length > 0 ? p.images.map((img:any) => ({ url: img.src })) : [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800' }],
        variants: sizes.map((size: string, idx: number) => ({ 
          id: `v${p.id}-${idx}`, price: basePrice, regularPrice: regularPrice, salePrice: salePrice, colour: colour, size: size, stock: stockQty 
        })),
        reviews: [] // Fallback, could fetch from WooCommerce later
      }
      
      return NextResponse.json(formatted)
    }

    return NextResponse.json({ error: "Product not found" }, { status: 404 })
  } catch (error) {
    console.error("Failed to fetch product from WooCommerce:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
