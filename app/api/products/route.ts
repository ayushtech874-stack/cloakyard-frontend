import { NextResponse } from 'next/server'
import { fetchWooCommerce } from '@/lib/woocommerce'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    
    // Try to fetch from WooCommerce
    const wooProducts = await fetchWooCommerce('products?status=publish&per_page=20')
    
    if (wooProducts && Array.isArray(wooProducts) && wooProducts.length > 0) {
      // Fetch variations for all variable products in parallel
      const variationPromises = wooProducts.map(async (p: any) => {
        if (p.type === 'variable') {
          try {
            return await fetchWooCommerce(`products/${p.id}/variations`)
          } catch (e) {
            console.error(`Failed to fetch variations for ${p.id}`, e)
            return []
          }
        }
        return []
      })
      
      const allVariations = await Promise.all(variationPromises)

      // Map WooCommerce structure to our frontend structure
      let formatted = wooProducts.map((p: any, index: number) => {
        const sizes = p.attributes?.find((a:any) => a.name.toLowerCase() === 'size')?.options || ['S', 'M', 'L', 'XL', 'XXL']
        const rawPrice = p.price || p.regular_price || p.sale_price || '0';
        const parsedPrice = parseInt(rawPrice);
        const basePrice = (isNaN(parsedPrice) ? 0 : parsedPrice) * 100;
        
        let parsedRegular = parseInt(p.regular_price || '0')
        if (isNaN(parsedRegular) || parsedRegular === 0) {
          if (p.price_html && p.price_html.includes('<del')) {
            const match = p.price_html.match(/<del[^>]*>[\s\S]*?([\d,]+(\.\d+)?)[\s\S]*?<\/del>/)
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
        
        const productVariations = allVariations[index]
        
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
          price_html: p.price_html,
          images: p.images?.length > 0 ? p.images.map((img:any) => ({ url: img.src })) : [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800' }],
          variants: sizes.map((size: string, idx: number) => {
            let varPrice = basePrice
            let varReg = regularPrice
            let varSale = salePrice
            
            if (productVariations && Array.isArray(productVariations)) {
              const matchedVar = productVariations.find((v:any) => 
                v.attributes?.some((a:any) => a.name.toLowerCase() === 'size' && a.option.toUpperCase() === size.toUpperCase())
              )
              
              if (matchedVar) {
                const matchedParsedPrice = parseInt(matchedVar.price || '0')
                varPrice = (isNaN(matchedParsedPrice) ? 0 : matchedParsedPrice) * 100
                
                const matchedReg = parseInt(matchedVar.regular_price || '0')
                varReg = (isNaN(matchedReg) ? 0 : matchedReg) * 100
                
                const matchedSale = parseInt(matchedVar.sale_price || '0')
                varSale = (isNaN(matchedSale) ? 0 : matchedSale) * 100
              }
            }
            
            return {
              id: `v${p.id}-${idx}`, 
              price: varPrice, 
              regularPrice: varReg, 
              salePrice: varSale, 
              colour: colour, 
              size: size, 
              stock: stockQty 
            }
          })
        }
      })
      
      // Filter the results before sending them back to the frontend
      const view = searchParams.get('view')
      const filterFit = searchParams.get('fitType')?.toLowerCase().split(',')
      const filterGender = searchParams.get('gender')?.toLowerCase().split(',')
      const filterSize = searchParams.get('size')?.toLowerCase().split(',')
      const filterStatus = searchParams.get('status')?.toLowerCase().split(',')

      if (view === 'drops') {
        formatted = formatted.filter((p: any) => p.isDrop === true)
        
        // Add Status Filtering for Drops
        if (filterStatus && filterStatus.length > 0) {
          formatted = formatted.filter((p: any) => filterStatus.includes(p.status))
        }
      } else if (view !== 'all') {
        // If normal shop, exclude drops
        formatted = formatted.filter((p: any) => p.isDrop === false)
      }

      if (filterFit && filterFit.length > 0) {
        // Handle "oversized" vs "oversize" mismatch
        const mappedFits = filterFit.map((f: string) => f === 'oversized' ? 'oversize' : f)
        formatted = formatted.filter((p: any) => mappedFits.includes(p.fitType))
      }
      if (filterGender && filterGender.length > 0) {
        // Handle "men" vs "male" mismatch
        const mappedGenders = filterGender.map((g: string) => g === 'men' ? 'male' : g === 'women' ? 'female' : g)
        formatted = formatted.filter((p: any) => mappedGenders.includes(p.gender))
      }
      if (filterSize && filterSize.length > 0) {
        formatted = formatted.filter((p: any) => p.sizes.some((s: string) => filterSize.includes(s.toLowerCase())))
      }

      // Handle Sorting
      const sort = searchParams.get('sort')
      if (sort === 'price-asc') {
        formatted.sort((a, b) => {
          const aPrice = Math.min(...a.variants.map((v:any) => v.price))
          const bPrice = Math.min(...b.variants.map((v:any) => v.price))
          return aPrice - bPrice
        })
      } else if (sort === 'price-desc') {
        formatted.sort((a, b) => {
          const aPrice = Math.min(...a.variants.map((v:any) => v.price))
          const bPrice = Math.min(...b.variants.map((v:any) => v.price))
          return bPrice - aPrice
        })
      }
      // 'createdAt' is the default sorting from WooCommerce (Date, descending)

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
