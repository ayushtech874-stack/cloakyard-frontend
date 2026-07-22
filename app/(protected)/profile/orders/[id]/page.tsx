'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, Package, Truck, CheckCircle2, Download } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params)
  const id = unwrappedParams.id
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data)
        setLoading(false)
      })
  }, [id])

  if (loading) return <div className="h-[600px] rounded-xl skeleton" />
  if (!order || order.error) return <div>Order not found</div>

  const statusMap = {
    PLACED: { icon: Package, label: 'Order Placed', color: 'text-accent' },
    CONFIRMED: { icon: CheckCircle2, label: 'Confirmed', color: 'text-accent' },
    PROCESSING: { icon: Package, label: 'Processing', color: 'text-accent' },
    SHIPPED: { icon: Truck, label: 'Shipped', color: 'text-blue-400' },
    OUT_FOR_DELIVERY: { icon: Truck, label: 'Out for Delivery', color: 'text-blue-400' },
    DELIVERED: { icon: CheckCircle2, label: 'Delivered', color: 'text-green-400' },
    CANCELLED: { icon: null, label: 'Cancelled', color: 'text-red-400' },
  }

  const currentStatusIndex = Object.keys(statusMap).indexOf(order.status)
  
  return (
    <div className="space-y-6">
      <Link href="/profile/orders" className="text-muted hover:text-cream text-sm flex items-center gap-1 w-max">
        <ChevronLeft size={16} /> Back to Orders
      </Link>
      
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div>
          <h2 className="font-display text-3xl text-cream">ORDER #{order.id.slice(-6).toUpperCase()}</h2>
          <p className="text-muted text-sm mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <button className="btn-outline text-xs h-10 gap-2">
          <Download size={14} /> INVOICE
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          <div className="bg-surface rounded-2xl border border-white/10 p-6">
            <h3 className="font-display text-xl text-cream mb-6">STATUS</h3>
            <div className="flex flex-col gap-6">
              {['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'].map((s, i) => {
                const isActive = currentStatusIndex >= Object.keys(statusMap).indexOf(s)
                const Icon = statusMap[s as keyof typeof statusMap].icon || CheckCircle2
                return (
                  <div key={s} className="flex items-start gap-4 relative">
                    {i < 3 && <div className={`absolute top-8 left-4 w-px h-10 ${currentStatusIndex > Object.keys(statusMap).indexOf(s) ? 'bg-accent' : 'bg-white/10'}`} />}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${isActive ? 'bg-accent text-bg' : 'bg-surface2 border border-white/20 text-muted'}`}>
                      <Icon size={16} />
                    </div>
                    <div className="mt-1">
                      <p className={`font-medium ${isActive ? 'text-cream' : 'text-muted'}`}>{statusMap[s as keyof typeof statusMap].label}</p>
                      {s === 'SHIPPED' && order.trackingId && (
                        <p className="text-xs text-accent mt-1 hover:underline cursor-pointer">Track: {order.trackingId}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Items */}
          <div className="bg-surface rounded-2xl border border-white/10 p-6">
            <h3 className="font-display text-xl text-cream mb-6">ITEMS</h3>
            <div className="space-y-4">
              {order.items.map((item:any) => (
                <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-surface2">
                  <div className="w-20 h-24 relative rounded bg-bg overflow-hidden flex-shrink-0">
                    <img src={item.product.images[0]?.url || '/placeholder.jpg'} alt="" className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-cream font-medium text-sm pr-4 line-clamp-2">{item.product.name}</p>
                      <span className="font-mono text-accent">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                    <p className="text-muted text-xs mt-1">{item.colour} / {item.size}</p>
                    <p className="text-muted text-xs mt-1">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-surface rounded-2xl border border-white/10 p-6">
            <h3 className="font-display text-xl text-cream mb-6">SUMMARY</h3>
            <div className="space-y-3 text-sm pb-4 border-b border-white/10">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="text-cream font-mono">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Shipping</span>
                <span className="text-cream font-mono">{order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="text-cream font-medium">Total</span>
              <span className="text-accent font-display text-2xl">{formatPrice(order.total)}</span>
            </div>
            <p className="text-xs text-muted mt-4 font-mono">Paid via {order.paymentMethod.toUpperCase()}</p>
          </div>

          {/* Delivery Address */}
          <div className="bg-surface rounded-2xl border border-white/10 p-6">
            <h3 className="font-display text-xl text-cream mb-4">DELIVERY TO</h3>
            <div className="text-sm space-y-1">
              <p className="text-cream font-medium">{order.addressSnapshot.name}</p>
              <p className="text-muted">{order.addressSnapshot.phone}</p>
              <p className="text-muted">{order.addressSnapshot.flat}, {order.addressSnapshot.area}</p>
              <p className="text-muted">{order.addressSnapshot.city}, {order.addressSnapshot.state} - {order.addressSnapshot.pincode}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
