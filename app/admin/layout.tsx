'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = localStorage.getItem('cloakyard_admin_auth')
      const pwd = localStorage.getItem('cloakyard_admin_pwd')
      if (isAuth === 'true' && pwd) {
        // Verify with API
        const res = await fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${pwd}` }
        })
        if (res.ok) {
          setIsAuthenticated(true)
        } else {
          handleLogout()
        }
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${password}` }
    })
    
    if (res.ok) {
      setIsAuthenticated(true)
      localStorage.setItem('cloakyard_admin_auth', 'true')
      localStorage.setItem('cloakyard_admin_pwd', password)
    } else {
      setError('Invalid admin password')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('cloakyard_admin_auth')
    localStorage.removeItem('cloakyard_admin_pwd')
  }

  if (loading) return <div className="min-h-screen bg-bg flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" /></div>

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6">
        <div className="bg-surface p-8 rounded-2xl border border-white/10 w-full max-w-sm">
          <h1 className="font-display text-2xl text-accent mb-6 text-center">ADMIN PANEL</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-base"
                autoFocus
              />
            </div>
            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            <button type="submit" className="btn-primary w-full justify-center">LOGIN</button>
          </form>
        </div>
      </div>
    )
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Orders', path: '/admin/orders' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Support Tickets', path: '/admin/support' },
  ]

  return (
    <div className="min-h-screen bg-bg text-cream font-body flex flex-col">
      <header className="bg-surface border-b border-white/10 p-4 px-6 flex justify-between items-center z-20 relative">
        <div className="flex items-center gap-4">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-cream">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link href="/admin" className="font-display text-2xl text-accent">CLOAKYARD ADMIN</Link>
        </div>
        <button onClick={handleLogout} className="text-sm text-muted hover:text-cream transition-colors">Logout</button>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <aside className={`w-64 border-r border-white/10 bg-surface2 overflow-y-auto absolute inset-y-0 left-0 z-10 transform transition-transform md:relative md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <nav className="p-4 space-y-2 text-sm font-medium">
            {navItems.map(item => {
              const active = pathname === item.path
              return (
                <Link key={item.path} href={item.path} onClick={() => setMobileMenuOpen(false)}>
                  <div className={`p-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-accent/10 text-accent border border-accent/20' : 'text-muted hover:bg-surface border border-transparent'}`}>
                    {item.name}
                  </div>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
