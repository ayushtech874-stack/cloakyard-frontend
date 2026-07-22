'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { formatPrice } from '@/lib/utils'
import { HeartCrack } from 'lucide-react'

export default function WishlistPage() {
  const { user } = useAuthStore()
  const { addItem, openCart } = useCartStore()
  const { removeItem } = useWishlistStore()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchWishlist = () => {
    fetch(`/api/wishlist?userId=${user?.id}`)
      .then(res => res.json())
      .then(data => {
        setItems(data)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (user) fetchWishlist()
  }, [user])

  const handleRemove = async (productId: string) => {
    removeItem(productId) // Optimistic local store update
    setItems(items.filter(i => i.productId !== productId))
    await fetch('/api/wishlist', {
      method: 'POST',
      body: JSON.stringify({ userId: user?.id, productId })
    })
  }

  const handleAddToCart = (item: any) => {
    const defaultVariant = item.product.variants[0]
    if(!defaultVariant) return
    addItem({
      variantId: defaultVariant.id,
      productId: item.product.id,
      name: item.product.name,
      image: item.product.images[0]?.url,
      size: defaultVariant.size,
      colour: defaultVariant.colour,
      price: defaultVariant.price
    })
    handleRemove(item.product.id)
  }

  if (loading) return <div className="grid grid-cols-2 gap-4">{[...Array(4)].map((_,i)=><div key={i} className="aspect-[4/5] rounded-xl skeleton" />)}</div>

  if (items.length === 0) return (
    <div className="text-center py-20 bg-surface rounded-2xl border border-white/10 flex flex-col items-center">
      <HeartCrack size={40} className="text-white/10 mb-4" />
      <p className="text-cream text-lg font-display mb-2">Wishlist is empty</p>
      <p className="text-muted text-sm mb-6">You haven't saved any items yet.</p>
      <Link href="/shop" className="btn-primary">EXPLORE</Link>
    </div>
  )

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-cream mb-6">SAVED ITEMS</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {items.map(({ product }) => (
          <div key={product.id} className="bg-surface rounded-xl border border-white/10 overflow-hidden flex flex-col">
            <Link href={`/shop/${product.slug}`} className="relative aspect-[4/5] block bg-bg">
              <img src={product.images[0]?.url || '/placeholder.jpg'} alt="" className="w-full h-full object-cover" />
            </Link>
            <div className="p-4 flex flex-col flex-1">
              <p className="text-sm font-medium text-cream truncate mb-1">{product.name}</p>
              <p className="font-mono text-accent text-sm mb-4">{formatPrice(product.variants[0]?.price || 0)}</p>
              <div className="mt-auto space-y-2">
                <button onClick={() => handleAddToCart({product})} className="btn-primary w-full justify-center h-10 text-xs">MOVE TO CART</button>
                <button onClick={() => handleRemove(product.id)} className="btn-outline w-full justify-center h-10 text-xs">REMOVE</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
