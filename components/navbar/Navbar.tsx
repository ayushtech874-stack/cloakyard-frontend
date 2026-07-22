'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/wishlist'
import { useAuthStore } from '@/store/auth'
import { SearchBar } from './SearchBar'
import { AnnouncementBar } from './AnnouncementBar'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const cartCount = useCartStore((s) => s.itemCount())
  const wishlistCount = useWishlistStore((s) => s.items.length)
  const { user, openLogin } = useAuthStore()
  const { openCart } = useCartStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <AnnouncementBar />
      <nav className={`fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface/80 backdrop-blur-xl border-b border-white/10 dark:border-white/10 duration-300 ease-in-out transition-all ${scrolled ? 'py-sm shadow-xl' : 'py-md'}`}>
        <div className="flex justify-between items-center px-lg w-full max-w-[1440px] mx-auto">
          
          <div className="flex items-center gap-4">
            <button className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
              <span className="material-symbols-outlined text-on-surface-variant">menu</span>
            </button>
            <Link href="/" className="hidden md:block">
              <Image 
                src="/logo-cropped.png" 
                alt="Cloakyard" 
                width={160} 
                height={40} 
                className="object-contain dark:invert-0 invert" 
              />
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8 justify-center">
            <div className="flex items-center gap-lg">
              <Link href="/" className={`${pathname === '/' ? 'text-primary-fixed border-b-2 border-primary-fixed pb-1' : 'text-on-surface-variant hover:text-primary-fixed transition-colors'} font-label-sm text-label-sm uppercase tracking-widest`}>Home</Link>
              <Link href="/shop" className={`${pathname === '/shop' && (typeof window === 'undefined' || !window.location.search.includes('view=drops')) ? 'text-primary-fixed border-b-2 border-primary-fixed pb-1' : 'text-on-surface-variant hover:text-primary-fixed transition-colors'} font-label-sm text-label-sm uppercase tracking-widest`}>Shop</Link>
              <Link href="/shop?view=drops" className={`${pathname === '/shop' && typeof window !== 'undefined' && window.location.search.includes('view=drops') ? 'text-primary-fixed border-b-2 border-primary-fixed pb-1' : 'text-on-surface-variant hover:text-primary-fixed transition-colors'} font-label-sm text-label-sm uppercase tracking-widest`}>Drops</Link>
              <Link href="/customise" className={`${pathname === '/customise' ? 'text-primary-fixed border-b-2 border-primary-fixed pb-1' : 'text-on-surface-variant hover:text-primary-fixed transition-colors'} font-label-sm text-label-sm uppercase tracking-widest`}>Vault</Link>
              <Link href="/about" className={`${pathname === '/about' ? 'text-primary-fixed border-b-2 border-primary-fixed pb-1' : 'text-on-surface-variant hover:text-primary-fixed transition-colors'} font-label-sm text-label-sm uppercase tracking-widest`}>About</Link>
            </div>
          </div>

          <Link href="/" className="md:hidden absolute left-1/2 -translate-x-1/2">
            <Image 
              src="/logo-cropped.png" 
              alt="Cloakyard" 
              width={120} 
              height={30} 
              className="object-contain dark:invert-0 invert" 
            />
          </Link>

          <div className="flex items-center gap-md">
            
            {/* Theme Toggle */}
            {mounted && (
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="group hover:opacity-80 transition-opacity hidden md:block"
              >
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary-fixed">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>
            )}

            <Link href="/profile/wishlist" className="relative group hidden md:block hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-on-surface-variant">favorite</span>
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-primary-fixed text-on-primary-fixed text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <button onClick={user ? undefined : () => openLogin()} className="group hover:opacity-80 transition-opacity">
              {user ? (
                <Link href="/profile">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary-fixed">person</span>
                </Link>
              ) : (
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary-fixed">person</span>
              )}
            </button>

            <button onClick={openCart} className="relative group hover:opacity-80 transition-opacity">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary-fixed">shopping_bag</span>
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-primary-fixed text-on-primary-fixed text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-surface p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <Image 
                src="/logo-cropped.png" 
                alt="Cloakyard" 
                width={160} 
                height={40} 
                className="object-contain dark:invert-0 invert" 
              />
            </Link>
            <button onClick={() => setMobileMenuOpen(false)}>
              <span className="material-symbols-outlined text-on-background">close</span>
            </button>
          </div>
          <SearchBar />
          <nav className="mt-8 flex flex-col gap-6 text-xl font-headline-lg text-on-background uppercase">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className={pathname === '/' ? 'text-primary-fixed' : ''}>Home</Link>
            <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className={pathname === '/shop' && (typeof window === 'undefined' || !window.location.search.includes('view=drops')) ? 'text-primary-fixed' : ''}>Shop All</Link>
            <Link href="/shop?view=drops" onClick={() => setMobileMenuOpen(false)} className={pathname === '/shop' && typeof window !== 'undefined' && window.location.search.includes('view=drops') ? 'text-primary-fixed' : ''}>Drops</Link>
            <Link href="/customise" onClick={() => setMobileMenuOpen(false)} className={pathname === '/customise' ? 'text-primary-fixed' : ''}>Customise</Link>
            <Link href="/profile" onClick={() => { setMobileMenuOpen(false); if(!user) openLogin(); }} className={pathname === '/profile' ? 'text-primary-fixed' : ''}>Profile</Link>
          </nav>
          {/* Mobile Theme Toggle */}
          {mounted && (
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="mt-auto flex items-center gap-2 text-on-surface-variant hover:text-primary-fixed uppercase font-label-sm text-label-sm tracking-widest"
            >
              <span className="material-symbols-outlined">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
              Switch Theme
            </button>
          )}
        </div>
      )}
    </>
  )
}
