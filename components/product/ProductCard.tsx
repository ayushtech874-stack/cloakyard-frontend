'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlist'
import { useAuthStore } from '@/store/auth'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: {
    id: string; slug: string; name: string; fitType: string; isNew: boolean
    images: { url: string; altText?: string | null }[]
    variants: { price: number; regularPrice?: number; colour: string; size: string; stock: number }[]
    avgRating?: number; reviewCount?: number
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggle, isInWishlist } = useWishlistStore()
  const { user, openLogin } = useAuthStore()
  const primaryImage = product.images[0]?.url ?? '/placeholder.jpg'
  const secondaryImage = product.images[1]?.url
  const minPrice = Math.min(...product.variants.map((v) => v.price))
  const minRegularPrice = Math.min(...product.variants.map((v) => v.regularPrice || v.price))
  const colours = [...new Set(product.variants.map((v) => v.colour))]
  const inWishlist = isInWishlist(product.id)
  const isSoldOut = product.variants.every((v) => v.stock === 0)

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) { openLogin(() => toggle(product.id)); return }
    toggle(product.id)
  }

  return (
    <Link href={`/shop/${product.slug}`} className="group block card-3d rounded-xl overflow-hidden bg-surface border border-white/[0.06]">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface2">
        <Image
          src={primaryImage} alt={product.name} fill
          className="object-cover transition-all duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        {secondaryImage && (
          <Image
            src={secondaryImage} alt={product.name} fill
            className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && <span className="badge badge-new">NEW</span>}
          {isSoldOut && <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: '#8a8580' }}>SOLD OUT</span>}
        </div>
        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/80"
        >
          <Heart size={14} className={inWishlist ? 'fill-accent text-accent' : 'text-white'} />
        </button>
        {/* Fit pill */}
        <div className="absolute bottom-3 left-3">
          <span className="text-[10px] font-mono bg-black/70 text-muted border border-white/10 rounded px-2 py-0.5 capitalize">
            {product.fitType}
          </span>
        </div>
      </div>
      {/* Info */}
      <div className="p-3 space-y-2">
        <p className="font-body text-sm font-medium text-cream truncate">{product.name}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="font-mono text-accent text-sm font-medium">{formatPrice(minPrice)}</p>
            {minRegularPrice > minPrice && (
              <p className="font-mono text-muted text-xs line-through">{formatPrice(minRegularPrice)}</p>
            )}
          </div>
          {product.avgRating && product.avgRating > 0 ? (
            <span className="text-xs text-muted flex items-center gap-1">
              <span className="text-accent">★</span> {product.avgRating.toFixed(1)}
            </span>
          ) : null}
        </div>
        {/* Colour dots */}
        {colours.length > 0 && (
          <div className="flex gap-1.5">
            {colours.slice(0, 5).map((c) => (
              <div key={c} title={c}
                className="w-3 h-3 rounded-full border border-white/20"
                style={{ background: c.toLowerCase() === 'white' ? '#f5f0e8' : c.toLowerCase() === 'black' ? '#1a1a1a' : c.toLowerCase() }}
              />
            ))}
            {colours.length > 5 && <span className="text-muted text-[10px]">+{colours.length - 5}</span>}
          </div>
        )}
      </div>
    </Link>
  )
}
