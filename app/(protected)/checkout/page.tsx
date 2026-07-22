'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { MapPin, Truck, CreditCard, CheckCircle2 } from 'lucide-react'

export default function CheckoutPage() {
  const { user } = useAuthStore()
  const { items, total, clearCart } = useCartStore()
  const router = useRouter()
  
  const [step, setStep] = useState(1)
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddress, setSelectedAddress] = useState<any>(null)
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const [loading, setLoading] = useState(false)
  const [serviceable, setServiceable] = useState<boolean | null>(null)

  const subtotal = total()
  const shippingCost = shippingMethod === 'standard' ? (subtotal >= 99900 ? 0 : 7900) : 14900
  const finalTotal = subtotal + shippingCost

  useEffect(() => {
    if (user && items.length > 0) {
      fetch(`/api/profile/addresses?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          setAddresses(data)
          const defaultAddr = data.find((a:any) => a.isDefault) || data[0]
          if (defaultAddr) {
            setSelectedAddress(defaultAddr)
            checkPincode(defaultAddr.pincode)
          }
        })
    } else if (items.length === 0) {
      router.push('/shop')
    }
  }, [user, items, router])

  const checkPincode = async (pincode: string) => {
    const res = await fetch(`/api/shipping/check-pincode?pincode=${pincode}`)
    const data = await res.json()
    setServiceable(data.serviceable)
  }

  const handleNextStep = () => {
    if (step === 1 && !selectedAddress) return alert('Select an address')
    if (step === 1 && serviceable === false) return alert('Delivery not available to this pincode')
    setStep(s => s + 1)
  }

  const handlePayment = async () => {
    setLoading(true)
    const orderData = {
      userId: user?.id,
      cartItems: items,
      addressId: selectedAddress.id,
      shippingCost,
      paymentMethod
    }

    if (paymentMethod === 'cod') {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST', body: JSON.stringify(orderData)
      })
      const data = await res.json()
      clearCart()
      router.push(`/profile/orders/${data.dbOrderId}?success=true`)
      return
    }

    // Razorpay flow
    const res = await fetch('/api/payment/create-order', {
      method: 'POST', body: JSON.stringify({ ...orderData, paymentMethod: 'razorpay' })
    })
    const data = await res.json()

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.total,
      currency: "INR",
      name: "CLOAKYARD",
      description: "Order Payment",
      order_id: data.rpOrderId,
      handler: async function (response: any) {
        const verifyRes = await fetch('/api/payment/verify', {
          method: 'POST',
          body: JSON.stringify({
            ...response,
            dbOrderId: data.dbOrderId
          })
        })
        if (verifyRes.ok) {
          clearCart()
          router.push(`/profile/orders/${data.dbOrderId}?success=true`)
        } else {
          alert('Payment verification failed')
          router.push(`/profile/orders/${data.dbOrderId}`)
        }
      },
      prefill: {
        name: user?.name || '',
        contact: user?.phone || '',
        email: user?.email || ''
      },
      theme: { color: "#C08B2C" }
    }
    const rzp = new (window as any).Razorpay(options)
    rzp.open()
    setLoading(false)
  }

  if (items.length === 0) return null

  return (
    <div className="min-h-screen bg-bg pt-24 px-6 md:px-12 max-w-6xl mx-auto pb-24">
      <h1 className="font-display text-4xl text-cream mb-8 text-center">CHECKOUT</h1>
      
      {/* Stepper */}
      <div className="flex justify-center items-center mb-12 max-w-2xl mx-auto">
        <div className={`flex flex-col items-center gap-2 ${step >= 1 ? 'text-accent' : 'text-muted'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-accent bg-accent/10' : 'border-white/10'}`}>
            <MapPin size={18} />
          </div>
          <span className="font-mono text-xs tracking-widest">ADDRESS</span>
        </div>
        <div className={`h-0.5 w-24 mx-4 ${step >= 2 ? 'bg-accent' : 'bg-white/10'}`} />
        <div className={`flex flex-col items-center gap-2 ${step >= 2 ? 'text-accent' : 'text-muted'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-accent bg-accent/10' : 'border-white/10'}`}>
            <Truck size={18} />
          </div>
          <span className="font-mono text-xs tracking-widest">DELIVERY</span>
        </div>
        <div className={`h-0.5 w-24 mx-4 ${step >= 3 ? 'bg-accent' : 'bg-white/10'}`} />
        <div className={`flex flex-col items-center gap-2 ${step >= 3 ? 'text-accent' : 'text-muted'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-accent bg-accent/10' : 'border-white/10'}`}>
            <CreditCard size={18} />
          </div>
          <span className="font-mono text-xs tracking-widest">PAYMENT</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Col - Steps */}
        <div className="flex-1 space-y-8">
          {step === 1 && (
            <div className="glass p-6 rounded-2xl border border-white/10 animate-fade-in">
              <h2 className="font-display text-2xl text-cream mb-6">Select Address</h2>
              <div className="space-y-4 mb-6">
                {addresses.map(a => (
                  <label key={a.id} className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${selectedAddress?.id === a.id ? 'border-accent bg-accent/5' : 'border-white/10 bg-surface hover:border-white/20'}`}>
                    <input type="radio" name="address" className="mt-1" checked={selectedAddress?.id === a.id} onChange={() => { setSelectedAddress(a); checkPincode(a.pincode); }} />
                    <div>
                      <p className="text-cream font-medium">{a.name} <span className="text-muted text-sm ml-2">{a.phone}</span></p>
                      <p className="text-muted text-sm mt-1">{a.flat}, {a.area}</p>
                      <p className="text-muted text-sm">{a.city}, {a.state} - {a.pincode}</p>
                      {selectedAddress?.id === a.id && serviceable === false && (
                        <p className="text-red-400 text-xs mt-2 font-mono">Not serviceable</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
              <button className="text-accent text-sm font-mono hover:underline mb-8">+ ADD NEW ADDRESS</button>
              <button onClick={handleNextStep} disabled={!selectedAddress || serviceable === false} className="btn-primary w-full justify-center">CONTINUE TO DELIVERY</button>
            </div>
          )}

          {step === 2 && (
            <div className="glass p-6 rounded-2xl border border-white/10 animate-fade-in">
              <h2 className="font-display text-2xl text-cream mb-6">Delivery Method</h2>
              <div className="space-y-4 mb-8">
                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${shippingMethod === 'standard' ? 'border-accent bg-accent/5' : 'border-white/10 bg-surface'}`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" name="shipping" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} />
                    <div>
                      <p className="text-cream font-medium">Standard Delivery</p>
                      <p className="text-muted text-sm">5-7 working days</p>
                    </div>
                  </div>
                  <span className="font-mono text-cream">{subtotal >= 99900 ? 'FREE' : '₹79'}</span>
                </label>

                <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${shippingMethod === 'express' ? 'border-accent bg-accent/5' : 'border-white/10 bg-surface'}`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" name="shipping" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} />
                    <div>
                      <p className="text-cream font-medium">Express Delivery</p>
                      <p className="text-muted text-sm">2-3 working days</p>
                    </div>
                  </div>
                  <span className="font-mono text-cream">₹149</span>
                </label>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="btn-outline flex-1 justify-center">BACK</button>
                <button onClick={handleNextStep} className="btn-primary flex-1 justify-center">CONTINUE TO PAYMENT</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="glass p-6 rounded-2xl border border-white/10 animate-fade-in">
              <h2 className="font-display text-2xl text-cream mb-6">Payment Method</h2>
              <div className="space-y-4 mb-8">
                <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'razorpay' ? 'border-accent bg-accent/5' : 'border-white/10 bg-surface'}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} />
                  <div>
                    <p className="text-cream font-medium flex items-center gap-2">UPI / Cards / NetBanking <CheckCircle2 size={14} className="text-green-400"/></p>
                    <p className="text-muted text-sm">Pay securely via Razorpay. Extra 5% off (Applied)</p>
                  </div>
                </label>

                <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-accent bg-accent/5' : 'border-white/10 bg-surface'}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                  <div>
                    <p className="text-cream font-medium">Cash on Delivery (COD)</p>
                    <p className="text-muted text-sm">Pay when you receive the order.</p>
                  </div>
                </label>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="btn-outline flex-1 justify-center">BACK</button>
                <button onClick={handlePayment} disabled={loading} className="btn-primary flex-1 justify-center">
                  {loading ? 'PROCESSING...' : `PAY ${formatPrice(finalTotal)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Col - Order Summary */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="glass p-6 rounded-2xl border border-white/10 sticky top-24">
            <h3 className="font-display text-xl text-cream mb-6">ORDER SUMMARY</h3>
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 no-scrollbar">
              {items.map(item => (
                <div key={item.variantId} className="flex justify-between text-sm">
                  <div className="flex-1 pr-4">
                    <p className="text-cream">{item.name}</p>
                    <p className="text-muted text-xs">{item.colour} / {item.size} x {item.quantity}</p>
                  </div>
                  <span className="font-mono text-cream">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-white/10 pt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="text-cream font-mono">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Shipping</span>
                <span className="text-cream font-mono">{step > 1 ? formatPrice(shippingCost) : 'Calculated next step'}</span>
              </div>
              {paymentMethod === 'razorpay' && step === 3 && (
                <div className="flex justify-between text-green-400">
                  <span>Prepaid Discount (5%)</span>
                  <span className="font-mono">-{formatPrice(subtotal * 0.05)}</span>
                </div>
              )}
            </div>
            
            <div className="border-t border-white/10 mt-4 pt-4 flex justify-between items-center">
              <span className="text-cream font-medium">Total</span>
              <span className="text-accent font-display text-2xl">
                {formatPrice(step === 3 && paymentMethod === 'razorpay' ? finalTotal - (subtotal * 0.05) : finalTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
