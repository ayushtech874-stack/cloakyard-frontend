'use client'
import { useState, useEffect } from 'react'
import { formatPrice } from '@/lib/utils'
import { Search, MapPin, Edit3 } from 'lucide-react'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [statusUpdate, setStatusUpdate] = useState('')
  const [trackingIdUpdate, setTrackingIdUpdate] = useState('')
  const [updating, setUpdating] = useState(false)

  const fetchOrders = async () => {
    const pwd = localStorage.getItem('cloakyard_admin_pwd')
    const res = await fetch('/api/admin/orders', {
      headers: { Authorization: `Bearer ${pwd}` }
    })
    if (res.ok) {
      setOrders(await res.json())
    }
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    const pwd = localStorage.getItem('cloakyard_admin_pwd')
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${pwd}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        orderId: selectedOrder.id, 
        status: statusUpdate,
        trackingId: trackingIdUpdate
      })
    })
    setUpdating(false)
    setSelectedOrder(null)
    fetchOrders()
  }

  if (loading) return <div className="h-96 rounded-2xl skeleton" />

  return (
    <div className="flex gap-6 h-[calc(100vh-100px)]">
      {/* Left List */}
      <div className="flex-1 bg-surface border border-white/10 rounded-2xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center gap-4 bg-surface2">
          <h2 className="font-display text-xl text-cream flex-shrink-0">ALL ORDERS</h2>
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input type="text" placeholder="Search orders..." className="input-base pl-10 h-10 w-full" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {orders.map(order => (
            <div 
              key={order.id} 
              onClick={() => {
                setSelectedOrder(order)
                setStatusUpdate(order.status)
                setTrackingIdUpdate(order.trackingId || '')
              }}
              className={`p-4 border-b border-white/5 cursor-pointer transition-colors ${selectedOrder?.id === order.id ? 'bg-accent/10 border-accent/20' : 'hover:bg-surface2'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-mono text-cream">#{order.id.slice(-6).toUpperCase()}</p>
                  <p className="text-sm text-muted">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-mono border ${order.status === 'DELIVERED' ? 'bg-green-400/10 text-green-400 border-green-400/20' : order.status === 'CANCELLED' ? 'bg-red-400/10 text-red-400 border-red-400/20' : 'bg-accent/10 text-accent border-accent/20'}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <p className="text-muted truncate pr-4">{order.user?.name || order.addressSnapshot.name}</p>
                <p className="font-mono text-accent">{formatPrice(order.total)}</p>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="p-8 text-center text-muted font-mono">No orders found</div>
          )}
        </div>
      </div>

      {/* Right Detail Pane */}
      {selectedOrder ? (
        <div className="w-96 flex-shrink-0 bg-surface border border-white/10 rounded-2xl overflow-y-auto hidden lg:block">
          <div className="p-6 border-b border-white/10 bg-surface2">
            <h3 className="font-display text-2xl text-cream">ORDER DETAILS</h3>
            <p className="text-sm text-muted font-mono">#{selectedOrder.id}</p>
          </div>
          
          <div className="p-6 space-y-6">
            <form onSubmit={handleUpdate} className="bg-bg border border-white/10 rounded-xl p-4 space-y-4">
              <h4 className="text-xs font-mono text-muted mb-2 flex items-center gap-2"><Edit3 size={14}/> UPDATE STATUS</h4>
              <div>
                <label className="text-xs text-muted block mb-1">Status</label>
                <select value={statusUpdate} onChange={e => setStatusUpdate(e.target.value)} className="input-base">
                  <option value="PLACED">PLACED</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted block mb-1">Tracking ID</label>
                <input value={trackingIdUpdate} onChange={e => setTrackingIdUpdate(e.target.value)} className="input-base" placeholder="Optional tracking link/id" />
              </div>
              <button type="submit" disabled={updating} className="btn-primary w-full justify-center">
                {updating ? 'UPDATING...' : 'SAVE CHANGES'}
              </button>
            </form>

            <div>
              <h4 className="text-xs font-mono text-muted mb-3 flex items-center gap-2"><MapPin size={14}/> SHIPPING TO</h4>
              <div className="text-sm text-cream bg-surface2 p-4 rounded-xl border border-white/5 space-y-1">
                <p className="font-medium text-accent">{selectedOrder.addressSnapshot.name}</p>
                <p className="text-muted">{selectedOrder.addressSnapshot.phone}</p>
                <p className="text-muted">{selectedOrder.addressSnapshot.flat}, {selectedOrder.addressSnapshot.area}</p>
                <p className="text-muted">{selectedOrder.addressSnapshot.city}, {selectedOrder.addressSnapshot.state} - {selectedOrder.addressSnapshot.pincode}</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-mono text-muted mb-3">ITEMS</h4>
              <div className="space-y-3">
                {selectedOrder.items.map((item:any) => (
                  <div key={item.id} className="flex justify-between items-start text-sm bg-surface2 p-3 rounded-lg border border-white/5">
                    <div>
                      <p className="text-cream pr-4 line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted mt-1">{item.colour} / {item.size} x {item.quantity}</p>
                    </div>
                    <span className="font-mono text-accent">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-4 text-sm space-y-2">
              <div className="flex justify-between text-muted"><span>Subtotal</span><span className="font-mono">{formatPrice(selectedOrder.subtotal)}</span></div>
              <div className="flex justify-between text-muted"><span>Shipping</span><span className="font-mono">{formatPrice(selectedOrder.shippingCost)}</span></div>
              <div className="flex justify-between text-cream font-medium pt-2 border-t border-white/5"><span>Total</span><span className="font-mono text-accent text-lg">{formatPrice(selectedOrder.total)}</span></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-96 flex-shrink-0 bg-surface border border-white/10 rounded-2xl flex flex-col items-center justify-center text-muted hidden lg:flex p-8 text-center">
          <Edit3 size={40} className="mb-4 text-white/5" />
          <p className="font-display">Select an order</p>
          <p className="text-sm mt-2">Click on an order from the list to view its details and update its status.</p>
        </div>
      )}
    </div>
  )
}
