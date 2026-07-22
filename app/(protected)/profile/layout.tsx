'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { Footer } from '@/components/layout/Footer'

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  const tabs = [
    { name: 'Orders', path: '/profile/orders' },
    { name: 'Wishlist', path: '/profile/wishlist' },
    { name: 'Addresses', path: '/profile/addresses' },
    { name: 'Notifications', path: '/profile/notifications' },
    { name: 'Help & Support', path: '/profile/help' },
  ]

  return (
    <>
      <div className="min-h-screen bg-bg pt-20 px-6 md:px-12 max-w-7xl mx-auto pb-24">
        <div className="mb-12">
          <h1 className="font-display text-4xl text-cream mb-2">MY ACCOUNT</h1>
          <p className="text-muted text-sm font-mono">+91 {user?.phone}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <nav className="flex flex-col gap-2">
              {tabs.map(t => {
                const isActive = pathname.startsWith(t.path)
                return (
                  <Link 
                    key={t.name} href={t.path} 
                    className={`px-4 py-3 rounded-lg text-sm transition-colors font-medium ${isActive ? 'bg-surface2 text-accent border border-white/10' : 'text-muted hover:text-cream hover:bg-surface border border-transparent'}`}
                  >
                    {t.name}
                  </Link>
                )
              })}
              <button 
                onClick={() => { logout(); window.location.href = '/' }} 
                className="px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-400/10 transition-colors text-left font-medium mt-4 border border-transparent"
              >
                Log Out
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </>
  )
}
