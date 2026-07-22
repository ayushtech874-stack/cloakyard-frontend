'use client'
import Link from 'next/link'

export function CustomiseTeaser() {
  return (
    <section className="bg-surface py-24 px-6 md:px-12 border-y border-white/[0.06] overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <span className="section-eyebrow">Custom orders</span>
          <h2 className="font-display text-[clamp(60px,8vw,100px)] leading-[0.9] text-cream">
            YOUR DESIGN.<br />
            <span className="text-accent">OUR CRAFT.</span>
          </h2>
          <p className="text-muted max-w-md font-body text-lg">
            Bring your vision to life. Choose your fit, upload your artwork, and let us handle the rest. Premium printing on 240GSM cotton.
          </p>
          <Link href="/customise" className="btn-primary inline-flex mt-4">START DESIGNING →</Link>
        </div>
        <div className="flex-1 w-full relative h-[400px]">
          <div className="absolute inset-0 bg-surface2 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden group">
            <div className="w-64 h-80 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center bg-bg relative z-10 transition-transform group-hover:scale-105 duration-500">
              <span className="text-muted font-mono text-sm">[ your design here ]</span>
            </div>
            {/* Background elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-accent/10 rounded-full blur-xl" />
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent/5 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
