'use client'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Link from 'next/link'

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-64 h-80 rounded-2xl border border-white/10 bg-surface flex items-center justify-center">
        <span className="text-muted font-mono text-sm">[ loading 3D ]</span>
      </div>
    </div>
  ),
})

const fadeUp = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0 } }

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-bg flex items-center">
      {/* Radial glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-24 lg:py-0">
        {/* Text column */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
          className="flex flex-col gap-6"
        >
          <motion.span variants={fadeUp} className="section-eyebrow">
            New collection — 2024
          </motion.span>
          <motion.h1
            variants={fadeUp}
            className="font-display text-[clamp(80px,12vw,140px)] leading-[0.9] text-cream"
          >
            WEAR<br />
            THE<br />
            <span className="text-accent">YARD.</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-muted text-lg md:text-xl max-w-md leading-relaxed"
          >
            Oversized. Boxy. Streetwear. Or entirely yours — built on demand, one tee at a time.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mt-2">
            <Link href="/shop" className="btn-primary">SHOP NOW</Link>
            <Link href="/customise" className="btn-outline">DESIGN YOURS →</Link>
          </motion.div>
          <motion.div variants={fadeUp} className="flex gap-8 pt-4">
            {[['500+', 'Designs'], ['8 Days', 'Custom delivery'], ['100%', 'Cotton']].map(([val, label]) => (
              <div key={label}>
                <p className="font-mono text-accent text-xl font-medium">{val}</p>
                <p className="text-muted text-sm">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* 3D Spline column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden lg:flex items-center justify-center h-[600px] relative"
        >
          <div className="w-full h-full rounded-2xl border border-white/10 bg-surface/30 flex flex-col items-center justify-center">
            <span className="text-muted font-mono text-sm mb-2">[ 3D Visual Coming Soon ]</span>
            <div className="w-32 h-32 opacity-20 bg-accent rounded-full blur-3xl animate-pulse" />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-muted text-xs font-mono uppercase tracking-widest">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-muted to-transparent" />
      </motion.div>
    </section>
  )
}
