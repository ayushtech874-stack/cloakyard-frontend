import Link from 'next/link'
import { Package } from 'lucide-react'

export default function OrdersPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-4xl text-on-background mb-2 tracking-wide uppercase">Order History</h1>
        <p className="text-on-surface-variant font-body-md text-sm">Track, return or purchase items again.</p>
      </div>

      <div className="bg-surface border border-on-background/5 rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mb-2">
          <Package size={24} className="text-on-surface-variant" />
        </div>
        <h2 className="font-headline-lg text-xl text-on-background uppercase tracking-wider">No Orders Yet</h2>
        <p className="text-on-surface-variant text-sm font-body-md max-w-sm">
          You haven't placed any orders yet. When you do, their tracking status and details will appear here.
        </p>
        <Link href="/shop" className="bg-primary-fixed text-on-primary mt-4 inline-flex px-8 py-3 rounded-xl text-sm font-label-sm tracking-widest uppercase hover:opacity-80 transition-opacity">
          Start Shopping
        </Link>
      </div>
    </div>
  )
}
