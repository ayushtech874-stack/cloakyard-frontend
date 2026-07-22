'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/auth'
import { formatPrice } from '@/lib/utils'

export default function OrdersPage() {
  const { user } = useAuthStore()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetch(`/api/orders?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          setOrders(data)
          setLoading(false)
        })
    }
  }, [user])

  if (loading) return <div className="space-y-4">{[...Array(3)].map((_,i)=><div key={i} className="h-40 rounded-xl skeleton" />)}</div>

  if (orders.length === 0) return (
    <div className="text-center py-20 bg-surface rounded-2xl border border-white/10">
      <p className="text-cream text-lg font-display mb-2">No orders yet</p>
      <p className="text-muted text-sm mb-6">Looks like you haven't placed an order.</p>
      <Link href="/shop" className="btn-primary">START SHOPPING</Link>
    </div>
  )

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl text-cream mb-6">ORDER HISTORY</h2>
      {orders.map(order => (
        <div key={order.id} className="bg-surface rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-white/10 flex flex-wrap gap-4 justify-between items-center bg-surface2">
            <div>
              <p className="text-xs text-muted font-mono mb-1">ORDER ID</p>
              <p className="text-sm text-cream font-mono">#{order.id.slice(-6).toUpperCase()}</p>
            </div>
            <div>
              <p className="text-xs text-muted font-mono mb-1">DATE</p>
              <p className="text-sm text-cream">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted font-mono mb-1">TOTAL</p>
              <p className="text-sm text-accent font-mono">{formatPrice(order.total)}</p>
            </div>
            <div>
              <span className={`px-3 py-1 rounded-full text-xs font-mono border ${order.status === 'DELIVERED' ? 'bg-green-400/10 text-green-400 border-green-400/20' : order.status === 'CANCELLED' ? 'bg-red-400/10 text-red-400 border-red-400/20' : 'bg-accent/10 text-accent border-accent/20'}`}>
                {order.status}
              </span>
            </div>
          </div>
          
          <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex gap-4 items-center">
              <div className="flex -space-x-4">
                {order.items.slice(0, 3).map((item:any, i:number) => (
                  <div key={i} className="w-16 h-16 rounded-lg border border-white/20 bg-bg overflow-hidden relative z-10" style={{ zIndex: 10 - i }}>
                    <img src={item.product.images[0]?.url || '/placeholder.jpg'} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="w-16 h-16 rounded-lg border border-white/20 bg-surface flex items-center justify-center text-xs text-muted font-mono relative z-0">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>
              <div className="text-sm">
                <p className="text-cream mb-1">{order.items.length} item(s)</p>
                <p className="text-muted line-clamp-1">{order.items.map((i:any)=>i.product.name).join(', ')}</p>
              </div>
            </div>
            
            <Link href={`/profile/orders/${order.id}`} className="btn-outline text-xs h-10 w-full md:w-auto justify-center">
              VIEW DETAILS
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
