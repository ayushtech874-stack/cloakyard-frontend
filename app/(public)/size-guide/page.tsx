'use client'
import { Footer } from '@/components/layout/Footer'
import Link from 'next/link'

export default function SizeGuidePage() {
  return (
    <>
      <div className="min-h-screen bg-bg pt-20 px-6 md:px-12 max-w-4xl mx-auto pb-24">
        <h1 className="font-display text-4xl text-cream mb-12 text-center">SIZE GUIDE</h1>
        
        <div className="flex flex-col md:flex-row gap-12 items-start mb-16">
          <div className="flex-1 w-full bg-surface2 rounded-2xl p-8 border border-white/10 flex items-center justify-center min-h-[300px]">
            {/* SVG measurement diagram placeholder */}
            <svg viewBox="0 0 200 240" className="w-full max-w-xs text-muted" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M50 40 L150 40 L190 80 L190 120 L150 120 L150 220 L50 220 L50 120 L10 120 L10 80 Z" strokeWidth="4" />
              {/* Chest arrow */}
              <path d="M50 140 L150 140" strokeDasharray="4 4" />
              <text x="100" y="135" fontSize="12" fill="currentColor" stroke="none" textAnchor="middle">Chest</text>
              {/* Length arrow */}
              <path d="M100 40 L100 220" strokeDasharray="4 4" />
              <text x="110" y="130" fontSize="12" fill="currentColor" stroke="none" textAnchor="start">Length</text>
              {/* Shoulder arrow */}
              <path d="M50 60 L150 60" strokeDasharray="4 4" />
              <text x="100" y="55" fontSize="12" fill="currentColor" stroke="none" textAnchor="middle">Shoulder</text>
            </svg>
          </div>
          
          <div className="flex-1 space-y-6 text-sm text-muted leading-relaxed">
            <div>
              <h3 className="font-display text-xl text-cream mb-2">HOW TO MEASURE</h3>
              <p>Grab your favorite fitting t-shirt and lay it flat on a table. Measure across the chest, right under the armholes, and compare it with our chart.</p>
            </div>
            <div>
              <h3 className="font-display text-xl text-cream mb-2">OVERSIZED FIT</h3>
              <p>Our oversized items are designed to be intentionally baggy with dropped shoulders. We recommend ordering your true size for the intended look, or sizing down if you prefer a standard fit.</p>
            </div>
            <div>
              <h3 className="font-display text-xl text-cream mb-2">BOXY FIT</h3>
              <p>Boxy tees are shorter in length and wider in the chest, creating a square silhouette. Perfect for layering or pairing with high-waisted bottoms.</p>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h3 className="font-display text-2xl text-cream mb-6">OVERSIZED FIT CHART (IN INCHES)</h3>
            <div className="overflow-x-auto border border-white/10 rounded-xl">
              <table className="w-full text-left text-sm text-cream font-mono">
                <thead className="bg-surface2 border-b border-white/10">
                  <tr>
                    <th className="p-4 font-medium">SIZE</th>
                    <th className="p-4 font-medium">CHEST</th>
                    <th className="p-4 font-medium">LENGTH</th>
                    <th className="p-4 font-medium">SHOULDER</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-bg">
                  <tr><td className="p-4 text-accent">S</td><td className="p-4">44</td><td className="p-4">28</td><td className="p-4">22</td></tr>
                  <tr><td className="p-4 text-accent">M</td><td className="p-4">46</td><td className="p-4">29</td><td className="p-4">23</td></tr>
                  <tr><td className="p-4 text-accent">L</td><td className="p-4">48</td><td className="p-4">30</td><td className="p-4">24</td></tr>
                  <tr><td className="p-4 text-accent">XL</td><td className="p-4">50</td><td className="p-4">31</td><td className="p-4">25</td></tr>
                  <tr><td className="p-4 text-accent">XXL</td><td className="p-4">52</td><td className="p-4">32</td><td className="p-4">26</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 className="font-display text-2xl text-cream mb-6">BOXY FIT CHART (IN INCHES)</h3>
            <div className="overflow-x-auto border border-white/10 rounded-xl">
              <table className="w-full text-left text-sm text-cream font-mono">
                <thead className="bg-surface2 border-b border-white/10">
                  <tr>
                    <th className="p-4 font-medium">SIZE</th>
                    <th className="p-4 font-medium">CHEST</th>
                    <th className="p-4 font-medium">LENGTH</th>
                    <th className="p-4 font-medium">SHOULDER</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-bg">
                  <tr><td className="p-4 text-accent">S</td><td className="p-4">46</td><td className="p-4">25</td><td className="p-4">23</td></tr>
                  <tr><td className="p-4 text-accent">M</td><td className="p-4">48</td><td className="p-4">26</td><td className="p-4">24</td></tr>
                  <tr><td className="p-4 text-accent">L</td><td className="p-4">50</td><td className="p-4">27</td><td className="p-4">25</td></tr>
                  <tr><td className="p-4 text-accent">XL</td><td className="p-4">52</td><td className="p-4">28</td><td className="p-4">26</td></tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-muted text-sm mb-4">Still not sure? We're here to help.</p>
          <Link href="/profile/help" className="btn-outline">CONTACT SUPPORT</Link>
        </div>
      </div>
      <Footer />
    </>
  )
}
