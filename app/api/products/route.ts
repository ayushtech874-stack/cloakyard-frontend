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
      let formatted = wooProducts.map((p: any) => {
        const sizes = p.attributes?.find((a:any) => a.name.toLowerCase() === 'size')?.options || ['S', 'M', 'L', 'XL', 'XXL']
        const rawPrice = p.price || p.regular_price || p.sale_price || '0';
        const parsedPrice = parseInt(rawPrice);
        const basePrice = (isNaN(parsedPrice) ? 0 : parsedPrice) * 100;
        
        const parsedRegular = parseInt(p.regular_price || '0')
        const parsedSale = parseInt(p.sale_price || '0')
        const regularPrice = (isNaN(parsedRegular) ? 0 : parsedRegular) * 100
        const salePrice = (isNaN(parsedSale) ? 0 : parsedSale) * 100
        
        const stockQty = p.stock_quantity === null || p.stock_quantity === undefined ? 10 : p.stock_quantity
        const colour = p.attributes?.find((a:any) => a.name.toLowerCase() === 'color' || a.name.toLowerCase() === 'colour')?.options[0] || 'Black'
        const isDrop = p.tags?.some((t:any) => t.name.toLowerCase() === 'drop') || false
        
        return {
          id: p.id.toString(),
          slug: p.slug,
          name: p.name,
          fitType: p.attributes?.find((a:any) => a.name.toLowerCase() === 'fit')?.options[0]?.toLowerCase() || 'oversize',
          gender: p.attributes?.find((a:any) => a.name.toLowerCase() === 'gender')?.options[0]?.toLowerCase() || 'unisex',
          isNew: true,
          status: 'new',
          isDrop: isDrop,
          sizes: sizes,
          images: p.images?.length > 0 ? p.images.map((img:any) => ({ url: img.src })) : [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800' }],
          variants: sizes.map((size: string, idx: number) => ({ 
            id: `v${p.id}-${idx}`, price: basePrice, regularPrice: regularPrice, salePrice: salePrice, colour: colour, size: size, stock: stockQty 
          }))
        }
      })
      
      // Filter the results before sending them back to the frontend
      const view = searchParams.get('view')
      const filterFit = searchParams.get('fitType')?.toLowerCase().split(',')
      const filterGender = searchParams.get('gender')?.toLowerCase().split(',')
      const filterSize = searchParams.get('size')?.toLowerCase().split(',')

      if (view === 'drops') {
        formatted = formatted.filter((p: any) => p.isDrop === true)
      } else if (view !== 'all') {
        // If normal shop, exclude drops
        formatted = formatted.filter((p: any) => p.isDrop === false)
      }

      if (filterFit && filterFit.length > 0) {
        formatted = formatted.filter((p: any) => filterFit.includes(p.fitType))
      }
      if (filterGender && filterGender.length > 0) {
        formatted = formatted.filter((p: any) => filterGender.includes(p.gender))
      }
      if (filterSize && filterSize.length > 0) {
        formatted = formatted.filter((p: any) => p.sizes.some((s: string) => filterSize.includes(s.toLowerCase())))
      }

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
