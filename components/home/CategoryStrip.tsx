'use client'
import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const CATEGORIES = [
  { name: 'Oversized', slug: 'oversized', desc: 'Dropped shoulders, extended length', color: 'from-zinc-900 to-zinc-800' },
  { name: 'Boxy', slug: 'boxy', desc: 'Square cut, structured fit', color: 'from-stone-900 to-stone-800' },
  { name: 'Streetwear', slug: 'streetwear', desc: 'Graphics, culture, attitude', color: 'from-neutral-900 to-zinc-900' },
  { name: 'Normal', slug: 'normal', desc: 'Clean, everyday essential', color: 'from-zinc-900 to-neutral-800' },
  { name: 'Unisex', slug: 'unisex', desc: 'Made for everyone', color: 'from-stone-900 to-zinc-800' },
  { name: 'Custom', slug: 'custom', desc: 'Your design, our craft', color: 'from-amber-950 to-zinc-900' },
]

function CategoryCard({ cat, index }: { cat: typeof CATEGORIES[0]; index: number }) {
  const router = useRouter()
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    card.style.transform = `perspective(800px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) translateZ(12px)`
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px)'
  }

  const handleClick = () => {
    if (cat.slug === 'custom') router.push('/customise')
    else router.push(`/shop?fitType=${cat.slug}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      ref={cardRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex-shrink-0 w-48 h-72 rounded-2xl cursor-pointer overflow-hidden border border-white/[0.06] relative group"
      style={{ transition: 'transform 0.15s ease, box-shadow 0.3s ease', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${cat.color}`} />
      {cat.slug === 'custom' && (
        <div className="absolute inset-0 bg-accent/5 group-hover:bg-accent/10 transition-colors" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="font-display text-3xl text-cream">{cat.name}</p>
        <p className="text-muted text-xs mt-1 font-body">{cat.desc}</p>
        {cat.slug === 'custom' && (
          <span className="inline-block mt-2 text-accent text-xs font-mono border border-accent/30 rounded px-2 py-0.5">Design yours →</span>
        )}
      </div>
      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-white text-xs">→</span>
      </div>
    </motion.div>
  )
}

export function CategoryStrip() {
  return (
    <section className="py-20 px-6 md:px-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="section-eyebrow">Browse</span>
          <h2 className="section-title">SHOP BY FIT</h2>
        </div>
        <a href="/shop" className="text-accent font-mono text-sm hover:underline">VIEW ALL →</a>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
        {CATEGORIES.map((cat, i) => <CategoryCard key={cat.slug} cat={cat} index={i} />)}
      </div>
    </section>
  )
}
