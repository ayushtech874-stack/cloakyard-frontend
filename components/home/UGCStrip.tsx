'use client'
import { motion } from 'framer-motion'
import { useRef } from 'react'

export function UGCStrip() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section className="py-24 px-6 md:px-12 bg-bg overflow-hidden">
      <div className="text-center mb-12">
        <span className="section-eyebrow">Community</span>
        <h2 className="section-title">AS WORN BY YOU</h2>
      </div>

      <div className="relative">
        {/* Fading edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-bg to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-bg to-transparent z-10 pointer-events-none" />

        <div 
          ref={containerRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-8 px-12 scroll-smooth"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -8 }}
              className="flex-shrink-0 cursor-pointer group"
            >
              <div className="w-64 h-64 bg-surface2 rounded-xl border border-white/5 overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-50">
                  <span className="font-mono text-muted text-xs">Image {i}</span>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
              <p className="mt-4 font-mono text-xs text-muted group-hover:text-cream transition-colors">
                @user_name_{i}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
