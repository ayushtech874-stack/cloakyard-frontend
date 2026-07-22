'use client'

export function AnnouncementBar() {
  return (
    <div className="h-9 bg-accent/10 border-b border-accent/20 flex items-center overflow-hidden whitespace-nowrap">
      <div className="animate-ticker inline-block">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="font-display text-sm text-accent tracking-widest mx-4">
            FREE SHIPPING ABOVE ₹999 · CUSTOM ORDERS OPEN · NEW DROPS EVERY FRIDAY ·
          </span>
        ))}
      </div>
    </div>
  )
}
