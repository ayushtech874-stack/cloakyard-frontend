'use client'
import { useState, useEffect } from 'react'
import { useWishlistStore } from '@/store/wishlist'
import { ProductCard } from '@/components/product/ProductCard'
import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function WishlistPage() {
  const { items } = useWishlistStore()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (items.length === 0) {
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`/api/products?view=all`)
      .then(res => res.json())
      .then(data => {
        // Filter only products that are in the user's wishlist
        const wishlistProducts = data.filter((p: any) => items.includes(p.id))
        setProducts(wishlistProducts)
        setLoading(false)
      })
  }, [items])

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-4xl text-on-background mb-2 tracking-wide uppercase">Wishlist</h1>
        <p className="text-on-surface-variant font-body-md text-sm">Products you've saved for later.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-6">
          {[...Array(3)].map((_, i) => <div key={i} className="aspect-[3/4] bg-surface border border-on-background/5 rounded-xl skeleton" />)}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-6">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-on-background/5 rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-2">
            <Heart size={24} className="text-on-surface-variant" />
          </div>
          <h2 className="font-headline-lg text-xl text-on-background uppercase tracking-wider">Your Wishlist is Empty</h2>
          <p className="text-on-surface-variant text-sm font-body-md max-w-sm">
            You haven't saved any items yet. Start exploring our latest drops and find your next favorite fit.
          </p>
          <Link href="/shop" className="bg-primary-fixed text-on-primary mt-4 inline-flex px-8 py-3 rounded-xl text-sm font-label-sm tracking-widest uppercase hover:opacity-80 transition-opacity">
            Browse Shop
          </Link>
        </div>
      )}
    </div>
  )
}
