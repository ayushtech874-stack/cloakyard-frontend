'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Plus, Minus, Trash2, Heart } from 'lucide-react'
import { useCartStore } from '@/store/cart'
import { useAuthStore } from '@/store/auth'
import { useWishlistStore } from '@/store/wishlist'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'

export function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, total } = useCartStore()
  const { user, openLogin } = useAuthStore()
  const { toggle } = useWishlistStore()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const subtotal = total()
  const freeShippingThreshold = 99900
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100)

  const handleCheckout = () => {
    closeCart()
    // Redirect directly to the Hostinger WooCommerce checkout
    window.location.href = 'http://cloakyard.in/checkout';
  }

  const handleSaveForLater = (item: any) => {
    toggle(item.productId)
    removeItem(item.variantId)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex justify-end">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-md bg-surface h-full flex flex-col border-l border-white/[0.06] shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
              <h2 className="font-display text-2xl text-cream">YOUR CART <span className="text-muted text-lg">({items.length})</span></h2>
              <button onClick={closeCart} className="text-muted hover:text-cream transition-colors"><X size={20}/></button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <ShoppingBag size={48} className="text-white/10 mb-4" />
                <p className="text-cream text-lg font-display mb-2">Your cart is empty</p>
                <p className="text-muted text-sm mb-6">Looks like you haven't added anything yet.</p>
                <button onClick={() => { closeCart(); router.push('/shop'); }} className="btn-primary">SHOP NOW</button>
              </div>
            ) : (
              <>
                <div className="p-4 bg-surface2 border-b border-white/[0.06]">
                  <p className="text-xs text-cream font-mono mb-2 text-center">
                    {subtotal >= freeShippingThreshold ? "You've unlocked free shipping!" : `Add ${formatPrice(freeShippingThreshold - subtotal)} more for free shipping`}
                  </p>
                  <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                    <div className="h-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-4">
                      <div className="w-24 h-32 relative rounded-lg overflow-hidden bg-bg flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-cream font-medium text-sm pr-4 line-clamp-2">{item.name}</p>
                          <button onClick={() => removeItem(item.variantId)} className="text-muted hover:text-red-400 transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-muted text-xs mb-auto">{item.colour} / {item.size}</p>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3 bg-bg rounded-lg border border-white/10 px-2 py-1">
                            <button onClick={() => updateQuantity(item.variantId, item.quantity - 1)} className="text-muted hover:text-cream"><Minus size={14}/></button>
                            <span className="text-cream text-sm font-mono w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)} className="text-muted hover:text-cream"><Plus size={14}/></button>
                          </div>
                          <p className="text-accent font-mono text-sm">{formatPrice(item.price * item.quantity)}</p>
                        </div>
                        <button onClick={() => handleSaveForLater(item)} className="text-muted text-xs text-left mt-2 flex items-center gap-1 hover:text-cream w-max">
                          <Heart size={12} /> Save for later
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-6 border-t border-white/[0.06] bg-bg space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted">Subtotal</span>
                    <span className="text-cream font-mono">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pb-4 border-b border-white/[0.06]">
                    <span className="text-muted">Shipping</span>
                    <span className="text-cream font-mono">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cream font-medium">Total</span>
                    <span className="text-accent font-display text-xl">{formatPrice(subtotal)}</span>
                  </div>
                  <button onClick={handleCheckout} className="btn-primary w-full justify-center py-4">
                    PROCEED TO CHECKOUT
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
