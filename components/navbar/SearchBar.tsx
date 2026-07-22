'use client'
import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!query) { setResults([]); return }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=5`)
      if (res.ok) {
        const data = await res.json()
        setResults(data)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="relative w-full">
      <div className={`flex items-center bg-surface2 border ${isFocused ? 'border-accent' : 'border-white/10'} rounded-lg px-3 h-10 transition-colors`}>
        <Search size={16} className="text-muted" />
        <input
          type="text"
          placeholder="Search oversized, boxy, custom..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="bg-transparent border-none outline-none text-sm text-cream ml-2 w-full font-body"
        />
      </div>
      
      {isFocused && query && (
        <div className="absolute top-12 left-0 right-0 bg-surface border border-white/10 rounded-lg shadow-2xl overflow-hidden z-[100]">
          {results.length > 0 ? (
            results.map((p) => (
              <Link href={`/shop/${p.slug}`} key={p.id} className="flex items-center gap-3 p-3 hover:bg-surface2 border-b border-white/5 last:border-0 transition-colors">
                <div className="relative w-10 h-10 rounded bg-bg overflow-hidden flex-shrink-0">
                  <Image src={p.images[0]?.url || '/placeholder.jpg'} alt={p.name} fill className="object-cover" />
                </div>
                <div className="flex-1 truncate">
                  <p className="text-sm text-cream font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted font-mono">{formatPrice(p.variants[0]?.price || 0)}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted">No results found</div>
          )}
        </div>
      )}
    </div>
  )
}
