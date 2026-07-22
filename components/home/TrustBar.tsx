'use client'
import { Package2, RefreshCw, Clock, Truck } from 'lucide-react'

export function TrustBar() {
  const items = [
    { icon: <Package2 className="text-accent" size={24} />, title: 'Premium Quality', desc: '100% Cotton 240GSM' },
    { icon: <Truck className="text-accent" size={24} />, title: 'Free Shipping', desc: 'On orders above ₹999' },
    { icon: <RefreshCw className="text-accent" size={24} />, title: 'Easy Returns', desc: '7 days return policy' },
    { icon: <Clock className="text-accent" size={24} />, title: 'Fast Delivery', desc: '5-7 working days' },
  ]

  return (
    <section className="bg-surface border-y border-white/[0.06] py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
              {item.icon}
            </div>
            <div>
              <p className="font-display tracking-widest text-cream text-lg">{item.title}</p>
              <p className="font-body text-muted text-xs mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
