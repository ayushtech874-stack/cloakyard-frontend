'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Heart, Star, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { useAuthStore } from '@/store/auth'
import { formatPrice } from '@/lib/utils'
import { Footer } from '@/components/layout/Footer'
import ReviewsSection from '@/components/shop/ReviewsSection'

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const unwrappedParams = React.use(params)
  const slug = unwrappedParams.slug
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  
  const { addItem, openCart } = useCartStore()
  const { toggle, isInWishlist } = useWishlistStore()
  const { user, openLogin } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data)
        setLoading(false)
        if(data && data.variants && data.variants.length > 0) {
          setSelectedColor(data.variants[0].colour)
        }
      })
  }, [slug])

  if (loading) return <div className="min-h-screen bg-bg pt-20 px-12"><div className="w-full h-[600px] skeleton" /></div>
  if (!product || product.error) return <div className="min-h-screen flex items-center justify-center bg-bg text-cream font-display text-2xl">Product not found</div>

  const colors = [...new Set(product.variants.map((v: any) => v.colour))] as string[]
  const availableSizesForColor = product.variants.filter((v: any) => v.colour === selectedColor).map((v: any) => v.size)
  const selectedVariant = product.variants.find((v: any) => v.colour === selectedColor && v.size === selectedSize) || product.variants.find((v: any) => v.colour === selectedColor)
  
  const inWishlist = isInWishlist(product.id)
  
  const handleAddToCart = () => {
    if (!selectedSize) { alert('Please select a size'); return }
    if (!user) { openLogin(() => handleAddToCart()); return }
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      name: product.name,
      image: product.images[0]?.url,
      size: selectedSize,
      colour: selectedColor,
      price: selectedVariant.price
    })
  }

  const handleBuyNow = () => {
    if (!selectedSize) { alert('Please select a size'); return }
    if (!user) { openLogin(() => handleBuyNow()); return }
    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      name: product.name,
      image: product.images[0]?.url,
      size: selectedSize,
      colour: selectedColor,
      price: selectedVariant.price
    })
    router.push('/checkout')
  }

  return (
    <>
      <div className="bg-bg min-h-screen pb-24">
        {/* Breadcrumb */}
        <div className="px-6 md:px-12 py-6 flex items-center gap-2 text-xs font-mono text-muted">
          <span className="cursor-pointer hover:text-cream" onClick={() => router.push('/')}>Home</span> <ChevronRight size={12}/>
          <span className="cursor-pointer hover:text-cream" onClick={() => router.push('/shop')}>Shop</span> <ChevronRight size={12}/>
          <span className="text-accent">{product.name}</span>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] bg-surface2 rounded-xl overflow-hidden border border-white/[0.06]">
              <Image src={product.images[activeImage]?.url || '/placeholder.jpg'} alt={product.name} fill className="object-cover" priority />
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar">
              {product.images.map((img: any, i: number) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border ${activeImage === i ? 'border-accent' : 'border-white/10'}`}>
                  <Image src={img.url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <div className="mb-2">
              <span className="badge badge-custom uppercase">{product.fitType} FIT</span>
            </div>
            <h1 className="font-display text-[clamp(40px,5vw,64px)] text-cream leading-[0.9] mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <p className="font-mono text-2xl text-accent">{formatPrice(selectedVariant?.price || 0)}</p>
              {product.reviews.length > 0 && (
                <div className="flex items-center gap-1 text-sm text-muted">
                  <Star size={16} className="fill-accent text-accent" />
                  <span>{(product.reviews.reduce((a:any,b:any)=>a+b.rating,0)/product.reviews.length).toFixed(1)}</span>
                  <span className="underline cursor-pointer">({product.reviews.length} reviews)</span>
                </div>
              )}
            </div>

            {/* Colors */}
            <div className="mb-8">
              <p className="text-sm text-muted mb-3 font-mono uppercase tracking-widest">Colour : <span className="text-cream">{selectedColor}</span></p>
              <div className="flex gap-3">
                {colors.map(c => (
                  <button 
                    key={c} onClick={() => { setSelectedColor(c); setSelectedSize(''); }}
                    className={`w-8 h-8 rounded-full border-2 ${selectedColor === c ? 'border-accent' : 'border-transparent ring-1 ring-white/20'} transition-all`}
                    style={{ background: c.toLowerCase() === 'white' ? '#f5f0e8' : c.toLowerCase() === 'black' ? '#1a1a1a' : c.toLowerCase() }}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-10">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm text-muted font-mono uppercase tracking-widest">Size</p>
                <button className="text-xs text-accent underline">Size Guide</button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {['S', 'M', 'L', 'XL', 'XXL'].map(s => {
                  const isAvailable = availableSizesForColor.includes(s)
                  return (
                    <button 
                      key={s} onClick={() => isAvailable && setSelectedSize(s)} disabled={!isAvailable}
                      className={`h-12 border rounded-lg font-mono text-sm transition-colors ${!isAvailable ? 'opacity-30 cursor-not-allowed border-white/10 text-muted' : selectedSize === s ? 'bg-accent text-bg border-accent' : 'bg-surface border-white/20 text-cream hover:border-accent'}`}
                    >
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-12 mt-auto">
              <button onClick={handleAddToCart} className="btn-outline flex-1 justify-center py-4 text-sm font-display tracking-widest">ADD TO CART</button>
              <button onClick={handleBuyNow} className="btn-primary flex-1 justify-center py-4 text-sm font-display tracking-widest">BUY IT NOW</button>
              <button onClick={() => { if(!user) openLogin(()=>toggle(product.id)); else toggle(product.id); }} className="w-14 border border-white/20 rounded-lg flex items-center justify-center hover:border-accent transition-colors">
                <Heart size={20} className={inWishlist ? 'fill-accent text-accent' : 'text-cream'} />
              </button>
            </div>

            {/* Details tabs */}
            <div className="border-t border-white/[0.06] pt-8 space-y-6">
              <div>
                <h4 className="font-display text-xl text-cream mb-2">DESCRIPTION</h4>
                <p className="text-muted text-sm leading-relaxed">{product.description}</p>
              </div>
              <div className="flex gap-12">
                <div>
                  <h4 className="font-display text-xl text-cream mb-2">FABRIC</h4>
                  <p className="text-muted text-sm font-mono">{product.fabric}</p>
                </div>
                <div>
                  <h4 className="font-display text-xl text-cream mb-2">CARE</h4>
                  <p className="text-muted text-sm font-mono">{product.careInstructions}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <ReviewsSection productId={product.id} />
      </div>
      <Footer />
    </>
  )
}
