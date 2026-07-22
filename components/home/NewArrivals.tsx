'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProductCard } from '@/components/product/ProductCard'

export function NewArrivals() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products?sort=createdAt&limit=8')
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
  }, [])

  return (
    <section className="py-20 px-6 md:px-12 bg-bg">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="section-eyebrow">Fresh drops</span>
          <h2 className="section-title">NEW ARRIVALS</h2>
        </div>
        <Link href="/shop" className="text-accent font-mono text-sm hover:underline">VIEW ALL →</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[4/5] rounded-xl skeleton" />
          ))
        ) : (
          products.map(p => <ProductCard key={p.id} product={p} />)
        )}
      </div>
    </section>
  )
}
