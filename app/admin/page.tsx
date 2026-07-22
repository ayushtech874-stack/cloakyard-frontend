'use client'
import { useState, useEffect } from 'react'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const pwd = localStorage.getItem('cloakyard_admin_pwd')
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${pwd}` }
      })
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
      setLoading(false)
    }
    fetchStats()
  }, [])

  if (loading) return <div className="h-64 rounded-2xl skeleton" />

  return (
    <>
      <h2 className="font-display text-3xl mb-8 text-cream">DASHBOARD</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-surface p-6 rounded-2xl border border-white/10">
          <p className="text-muted text-sm font-mono mb-2">TODAY'S REVENUE</p>
          <p className="text-3xl text-cream font-mono">₹{stats ? (stats.revenueToday / 100).toLocaleString() : '0'}</p>
        </div>
        <div className="bg-surface p-6 rounded-2xl border border-white/10">
          <p className="text-muted text-sm font-mono mb-2">ORDERS TODAY</p>
          <p className="text-3xl text-cream font-mono">{stats ? stats.ordersTodayCount : '0'}</p>
        </div>
        <div className="bg-surface p-6 rounded-2xl border border-white/10">
          <p className="text-muted text-sm font-mono mb-2">PENDING CUSTOM</p>
          <p className="text-3xl text-accent font-mono">{stats ? stats.pendingCustom : '0'}</p>
        </div>
        <div className="bg-surface p-6 rounded-2xl border border-white/10">
          <p className="text-muted text-sm font-mono mb-2">OPEN TICKETS</p>
          <p className="text-3xl text-cream font-mono">{stats ? stats.openTickets : '0'}</p>
        </div>
      </div>

      <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-surface2">
          <h3 className="font-display text-xl text-cream">RECENT ORDERS</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface border-b border-white/5 text-muted font-mono text-xs">
              <tr>
                <th className="p-4">ORDER ID</th>
                <th className="p-4">CUSTOMER</th>
                <th className="p-4">TOTAL</th>
                <th className="p-4">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats?.recentOrders?.map((order: any) => (
                <tr key={order.id} className="hover:bg-surface2 transition-colors">
                  <td className="p-4 font-mono text-muted">#{order.id.slice(-6).toUpperCase()}</td>
                  <td className="p-4 text-cream">{order.user?.name || order.user?.phone || 'Guest'}</td>
                  <td className="p-4 font-mono text-accent">₹{(order.total / 100).toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-mono border ${order.status === 'DELIVERED' ? 'bg-green-400/10 text-green-400 border-green-400/20' : order.status === 'CANCELLED' ? 'bg-red-400/10 text-red-400 border-red-400/20' : 'bg-accent/10 text-accent border-accent/20'}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!stats?.recentOrders?.length && (
                <tr><td colSpan={4} className="p-8 text-center text-muted font-mono">No recent orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
