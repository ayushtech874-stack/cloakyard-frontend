'use client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProductCard } from '@/components/product/ProductCard'
import { Footer } from '@/components/layout/Footer'

import { Suspense } from 'react'

function ShopContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const view = searchParams.get('view') || 'shop'
  
  // URL Params as arrays
  const fitTypes = searchParams.get('fitType')?.split(',').filter(Boolean) || []
  const genders = searchParams.get('gender')?.split(',').filter(Boolean) || []
  const sizes = searchParams.get('size')?.split(',').filter(Boolean) || []
  const statuses = searchParams.get('status')?.split(',').filter(Boolean) || []
  const sort = searchParams.get('sort') || 'createdAt'

  useEffect(() => {
    setLoading(true)
    const q = new URLSearchParams()
    if (fitTypes.length) q.set('fitType', fitTypes.join(','))
    if (genders.length) q.set('gender', genders.join(','))
    if (sizes.length) q.set('size', sizes.join(','))
    if (statuses.length) q.set('status', statuses.join(','))
    if (sort) q.set('sort', sort)
    
    fetch(`/api/products?${q.toString()}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
  }, [searchParams])

  const toggleArrayFilter = (key: string, val: string, currentArray: string[]) => {
    const q = new URLSearchParams(searchParams.toString())
    let newArray = [...currentArray]
    if (newArray.includes(val)) {
      newArray = newArray.filter(i => i !== val)
    } else {
      newArray.push(val)
    }

    if (newArray.length > 0) {
      q.set(key, newArray.join(','))
    } else {
      q.delete(key)
    }
    
    router.push(`/shop?${q.toString()}`, { scroll: false })
  }

  const updateSort = (val: string) => {
    const q = new URLSearchParams(searchParams.toString())
    if (val) q.set('sort', val)
    else q.delete('sort')
    router.push(`/shop?${q.toString()}`, { scroll: false })
  }

  const isDropsView = view === 'drops'

  return (
    <>
      <div className="min-h-screen bg-background pt-32 px-6 md:px-12 max-w-[1600px] mx-auto transition-colors duration-300">
        <div className="flex flex-col md:flex-row gap-8 pb-24">
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
            <div>
              <h1 className="font-headline-xl text-4xl text-on-background mb-2 tracking-tighter uppercase">
                {isDropsView ? 'LATEST DROPS' : 'SHOP ALL'}
              </h1>
              <p className="text-on-surface-variant text-sm font-label-sm uppercase tracking-widest">{products.length} Products</p>
            </div>

            {isDropsView ? (
              // Drops Sidebar
              <div className="space-y-4">
                <h3 className="font-headline-lg text-xl text-on-background uppercase tracking-wider">AVAILABILITY</h3>
                <div className="flex flex-col gap-2">
                  {['new', 'upcoming'].map(s => (
                    <label key={s} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-colors ${statuses.includes(s) ? 'bg-primary-fixed border-primary-fixed' : 'border-on-background/20 group-hover:border-on-background/40'}`}>
                        {statuses.includes(s) && <span className="material-symbols-outlined text-[12px] text-on-primary">check</span>}
                      </div>
                      <span className="text-on-surface-variant text-sm uppercase font-label-sm tracking-widest group-hover:text-on-background">
                        {s === 'new' ? 'New Arrivals' : 'Upcoming Arrivals'}
                      </span>
                      <input type="checkbox" className="hidden" checked={statuses.includes(s)} onChange={() => toggleArrayFilter('status', s, statuses)} />
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              // Shop Sidebar
              <>
                <div className="space-y-4">
                  <h3 className="font-headline-lg text-xl text-on-background uppercase tracking-wider">FIT</h3>
                  <div className="flex flex-col gap-2">
                    {['oversized', 'boxy', 'streetwear', 'normal'].map(f => (
                      <label key={f} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-colors ${fitTypes.includes(f) ? 'bg-primary-fixed border-primary-fixed' : 'border-on-background/20 group-hover:border-on-background/40'}`}>
                          {fitTypes.includes(f) && <span className="material-symbols-outlined text-[12px] text-on-primary">check</span>}
                        </div>
                        <span className="text-on-surface-variant text-sm capitalize group-hover:text-on-background font-body-md">{f}</span>
                        <input type="checkbox" className="hidden" checked={fitTypes.includes(f)} onChange={() => toggleArrayFilter('fitType', f, fitTypes)} />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-headline-lg text-xl text-on-background uppercase tracking-wider">GENDER</h3>
                  <div className="flex flex-col gap-2">
                    {['men', 'women', 'unisex'].map(g => (
                      <label key={g} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-colors ${genders.includes(g) ? 'bg-primary-fixed border-primary-fixed' : 'border-on-background/20 group-hover:border-on-background/40'}`}>
                          {genders.includes(g) && <span className="material-symbols-outlined text-[12px] text-on-primary">check</span>}
                        </div>
                        <span className="text-on-surface-variant text-sm capitalize group-hover:text-on-background font-body-md">{g}</span>
                        <input type="checkbox" className="hidden" checked={genders.includes(g)} onChange={() => toggleArrayFilter('gender', g, genders)} />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-headline-lg text-xl text-on-background uppercase tracking-wider">SIZE</h3>
                  <div className="flex flex-col gap-2">
                    {['S', 'M', 'L', 'XL', 'XXL'].map(s => (
                      <label key={s} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-colors ${sizes.includes(s) ? 'bg-primary-fixed border-primary-fixed' : 'border-on-background/20 group-hover:border-on-background/40'}`}>
                          {sizes.includes(s) && <span className="material-symbols-outlined text-[12px] text-on-primary">check</span>}
                        </div>
                        <span className="text-on-surface-variant text-sm capitalize group-hover:text-on-background font-body-md">{s}</span>
                        <input type="checkbox" className="hidden" checked={sizes.includes(s)} onChange={() => toggleArrayFilter('size', s, sizes)} />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-headline-lg text-xl text-on-background uppercase tracking-wider">SORTING</h3>
                  <div className="flex flex-col gap-2">
                    {[
                      { val: 'createdAt', label: 'Newest Arrivals' },
                      { val: 'price-asc', label: 'Price: Low to High' },
                      { val: 'price-desc', label: 'Price: High to Low' },
                    ].map(s => (
                      <label key={s.val} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-4 h-4 border rounded-full flex items-center justify-center transition-colors ${sort === s.val ? 'border-primary-fixed' : 'border-on-background/20 group-hover:border-on-background/40'}`}>
                          {sort === s.val && <div className="w-2 h-2 bg-primary-fixed rounded-full" />}
                        </div>
                        <span className="text-on-surface-variant text-sm group-hover:text-on-background font-body-md">{s.label}</span>
                        <input type="radio" className="hidden" checked={sort === s.val} onChange={() => updateSort(s.val)} />
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </aside>

          {/* Main Grid */}
          <div className="flex-1 mt-8 md:mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {loading ? (
                [...Array(8)].map((_, i) => <div key={i} className="aspect-[3/4] bg-surface border border-on-background/5 rounded-xl skeleton" />)
              ) : products.length > 0 ? (
                products.map(p => <ProductCard key={p.id} product={p} />)
              ) : (
                <div className="col-span-full py-32 text-center text-on-surface-variant font-label-sm uppercase tracking-widest border border-dashed border-on-background/10 rounded-xl">No products found matching your filters.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary-fixed border-t-transparent rounded-full animate-spin"></div></div>}>
      <ShopContent />
    </Suspense>
  )
}
