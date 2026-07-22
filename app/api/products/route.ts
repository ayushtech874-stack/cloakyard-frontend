import { NextResponse } from 'next/server'
import { fetchWooCommerce } from '@/lib/woocommerce'

const DUMMY_PRODUCTS = [
  { id: '1', slug: 'void-oversized-tee', name: 'Void Oversized Tee', fitType: 'oversized', gender: 'unisex', isNew: true, status: 'new', sizes: ['S', 'M', 'L', 'XL'], images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800' }, { url: 'https://images.unsplash.com/photo-1503341733017-1901578f9f1e?w=800' }], variants: [{ id: 'v1', price: 89900, colour: 'Black', size: 'M', stock: 10 }] },
  { id: '2', slug: 'phantom-boxy-tee', name: 'Phantom Boxy Tee', fitType: 'boxy', gender: 'men', isNew: true, status: 'upcoming', sizes: ['M', 'L', 'XL', 'XXL'], images: [{ url: 'https://images.unsplash.com/photo-1503341733017-1901578f9f1e?w=800' }], variants: [{ id: 'v2', price: 89900, colour: 'White', size: 'M', stock: 10 }] },
  { id: '3', slug: 'grime-graphic-tee', name: 'Grime Graphic Tee', fitType: 'streetwear', gender: 'unisex', isNew: true, status: 'new', sizes: ['S', 'M', 'L'], images: [{ url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800' }], variants: [{ id: 'v3', price: 99900, colour: 'Black', size: 'L', stock: 5 }] },
  { id: '4', slug: 'clean-slate-tee', name: 'Clean Slate Tee', fitType: 'normal', gender: 'unisex', isNew: false, status: 'none', sizes: ['S', 'M', 'L', 'XL', 'XXL'], images: [{ url: 'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=800' }], variants: [{ id: 'v4', price: 79900, colour: 'Olive', size: 'M', stock: 20 }] },
]

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

    // Fallback to dummy data if WooCommerce is empty or failing
    console.log("WooCommerce returned empty, falling back to DUMMY_PRODUCTS")
    return NextResponse.json(DUMMY_PRODUCTS)
  } catch (error) {
    console.error("Failed to fetch from WooCommerce:", error)
    return NextResponse.json(DUMMY_PRODUCTS)
  }
}
