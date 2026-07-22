'use client'

import Link from 'next/link'
import { ThreeCanvas } from '@/components/canvas/ThreeCanvas'
import { ProductCard } from '@/components/product/ProductCard'
import { useState, useEffect } from 'react'

export default function Home() {
  const [featured, setFeatured] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products?view=all')
      .then(res => res.json())
      .then(data => {
        setFeatured(data.slice(0, 4))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])
  return (
    <div className="w-full bg-background min-h-screen custom-scrollbar transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background">
        
        {/* Fullscreen 3D Canvas */}
        <div className="absolute inset-0 z-0 opacity-80 cursor-crosshair">
          <ThreeCanvas />
          <div className="absolute top-24 left-8 p-sm text-primary-fixed/50 font-label-sm text-label-sm tracking-[0.2em] pointer-events-none mix-blend-difference text-white">C-YRD / CORE</div>
          <div className="absolute bottom-8 right-8 p-sm text-primary-fixed/50 font-label-sm text-label-sm pointer-events-none mix-blend-difference text-white">FW_2026</div>
        </div>
        
        <div className="z-10 text-center flex flex-col items-center justify-between h-full w-full py-32 px-md pointer-events-none relative">
          
          <h1 className="font-headline-xl text-6xl md:text-[120px] uppercase tracking-tighter text-on-background drop-shadow-xl mt-8">
            WEAR THE <span className="text-on-background">YARD</span>
          </h1>
          
          <div className="flex flex-col md:flex-row gap-md items-center pointer-events-auto mb-12">
            <Link href="/shop" className="bg-primary-fixed text-on-primary border border-primary-fixed px-xl py-4 font-label-sm text-label-sm uppercase tracking-widest transition-all duration-300 hover:bg-transparent hover:text-primary-fixed">
              Explore Collection
            </Link>
            <Link href="/shop?fitType=oversized" className="glass border border-primary-fixed/30 text-primary-fixed px-xl py-4 font-label-sm text-label-sm uppercase tracking-widest hover:bg-primary-fixed hover:text-on-primary transition-all duration-300">
              View Lookbook
            </Link>
          </div>

        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-xl px-md max-w-[1440px] mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-xl gap-md">
          <div className="max-w-2xl">
            <div className="flex items-center gap-sm text-primary-fixed mb-sm">
              <div className="w-12 h-[1px] bg-primary-fixed"></div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest">New Arrivals</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg uppercase leading-none">The Foundation <br/>Series</h2>
          </div>
          <p className="font-body-md text-on-surface-variant max-w-sm text-right md:text-left">
            Minimal silhouettes meeting maximal impact. Boxy fits for the modern wardrobe.
          </p>
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {loading ? (
            [...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] bg-surface border border-on-background/5 rounded-xl skeleton" />)
          ) : featured.length > 0 ? (
            featured.map(p => <ProductCard key={p.id} product={p} />)
          ) : (
            <div className="col-span-full py-12 text-center text-on-surface-variant font-label-sm uppercase tracking-widest border border-dashed border-on-background/10 rounded-xl">No products added yet.</div>
          )}
        </div>
      </section>

      {/* Bento Section for Brand Vibe */}
      <section className="py-xl px-md max-w-[1440px] mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-sm h-auto md:h-[600px]">
          <div className="md:col-span-2 md:row-span-2 glass border border-on-background/10 flex flex-col justify-end p-lg relative overflow-hidden group rounded-2xl bg-black">
            <img className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale group-hover:scale-105 transition-transform duration-1000" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"/>
            <div className="relative z-10">
              <h4 className="font-headline-lg text-headline-lg uppercase mb-sm leading-none text-white">Custom Studio</h4>
              <p className="text-white/70 mb-md max-w-sm font-body-md">Bring your own brutalist vision to life with our premium heavyweight blanks and advanced printing.</p>
              <Link className="text-white font-label-sm text-label-sm uppercase flex items-center gap-xs hover:underline" href="/customise">
                Start Creating <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
              </Link>
            </div>
          </div>
          
          <div className="md:col-span-2 glass border border-on-background/10 flex items-center justify-between p-lg group overflow-hidden rounded-2xl bg-surface">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-xs">Quality</span>
              <h4 className="font-headline-lg text-[32px] uppercase text-primary-fixed">Heavyweight Cotton</h4>
            </div>
            <span className="material-symbols-outlined text-[80px] text-on-background/10 group-hover:rotate-12 transition-transform duration-500">layers</span>
          </div>
          
          <div className="md:col-span-1 glass border border-on-background/10 flex flex-col items-center justify-center p-md text-center hover:bg-on-background/5 transition-colors rounded-2xl bg-surface">
            <span className="material-symbols-outlined text-primary-fixed mb-sm text-3xl">local_shipping</span>
            <span className="font-label-sm text-label-sm uppercase text-primary-fixed">Pan India</span>
          </div>
          
          <div className="md:col-span-1 glass border border-on-background/10 flex flex-col items-center justify-center p-md text-center hover:bg-on-background/5 transition-colors rounded-2xl bg-surface">
            <span className="material-symbols-outlined text-primary-fixed mb-sm text-3xl">replay</span>
            <span className="font-label-sm text-label-sm uppercase text-primary-fixed">Easy Returns</span>
          </div>
        </div>
      </section>
    </div>
  )
}
