'use client'
import { useState } from 'react'
import { MapPin, Check } from 'lucide-react'

export default function AddressesPage() {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  
  const [shipping, setShipping] = useState({
    firstName: '', lastName: '', street: '', apartment: '', city: '', state: '', zip: '', country: 'India'
  })
  
  const [billing, setBilling] = useState({
    sameAsShipping: true,
    firstName: '', lastName: '', street: '', apartment: '', city: '', state: '', zip: '', country: 'India'
  })

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 1000)
  }

  const Input = ({ label, value, onChange, disabled = false, width = 'full' }: any) => (
    <div className={`space-y-2 ${width === 'half' ? 'col-span-1' : 'col-span-full'}`}>
      <label className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">{label}</label>
      <input 
        type="text" value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
        className={`w-full h-12 px-4 rounded-lg outline-none transition-colors ${disabled ? 'bg-background/50 border border-on-background/5 text-on-surface-variant cursor-not-allowed opacity-70' : 'bg-background border border-on-background/10 text-on-background focus:border-primary-fixed'}`} 
      />
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-4xl text-on-background mb-2 tracking-wide uppercase">Addresses</h1>
        <p className="text-on-surface-variant font-body-md text-sm">Manage your shipping and billing locations.</p>
      </div>

      <div className="space-y-6">
        
        {/* Shipping */}
        <div className="bg-surface border border-on-background/5 rounded-xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-on-background/5">
            <MapPin className="text-primary-fixed w-5 h-5" />
            <h2 className="font-headline-lg text-xl uppercase tracking-wider text-on-background">Shipping Address</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <Input label="First Name" width="half" value={shipping.firstName} onChange={(v:any) => setShipping({...shipping, firstName: v})} />
            <Input label="Last Name" width="half" value={shipping.lastName} onChange={(v:any) => setShipping({...shipping, lastName: v})} />
            <Input label="Street Address" value={shipping.street} onChange={(v:any) => setShipping({...shipping, street: v})} />
            <Input label="Apartment, suite, etc." value={shipping.apartment} onChange={(v:any) => setShipping({...shipping, apartment: v})} />
            <Input label="City" width="half" value={shipping.city} onChange={(v:any) => setShipping({...shipping, city: v})} />
            <Input label="State / Province" width="half" value={shipping.state} onChange={(v:any) => setShipping({...shipping, state: v})} />
            <Input label="ZIP / Postal Code" width="half" value={shipping.zip} onChange={(v:any) => setShipping({...shipping, zip: v})} />
            <Input label="Country" width="half" value={shipping.country} onChange={(v:any) => setShipping({...shipping, country: v})} />
          </div>
        </div>

        {/* Billing */}
        <div className="bg-surface border border-on-background/5 rounded-xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-on-background/5">
            <div className="flex items-center gap-3">
              <MapPin className="text-primary-fixed w-5 h-5" />
              <h2 className="font-headline-lg text-xl uppercase tracking-wider text-on-background">Billing Address</h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-colors ${billing.sameAsShipping ? 'bg-primary-fixed border-primary-fixed' : 'border-on-background/20 group-hover:border-on-background/40'}`}>
                {billing.sameAsShipping && <Check size={12} className="text-on-primary" />}
              </div>
              <span className="text-on-surface-variant text-sm font-label-sm uppercase tracking-widest group-hover:text-on-background transition-colors">Same as Shipping</span>
              <input type="checkbox" className="hidden" checked={billing.sameAsShipping} onChange={() => setBilling({...billing, sameAsShipping: !billing.sameAsShipping})} />
            </label>
          </div>
          
          <div className={`grid grid-cols-2 gap-6 transition-all duration-300 ${billing.sameAsShipping ? 'opacity-50 pointer-events-none' : ''}`}>
            <Input disabled={billing.sameAsShipping} label="First Name" width="half" value={billing.sameAsShipping ? shipping.firstName : billing.firstName} onChange={(v:any) => setBilling({...billing, firstName: v})} />
            <Input disabled={billing.sameAsShipping} label="Last Name" width="half" value={billing.sameAsShipping ? shipping.lastName : billing.lastName} onChange={(v:any) => setBilling({...billing, lastName: v})} />
            <Input disabled={billing.sameAsShipping} label="Street Address" value={billing.sameAsShipping ? shipping.street : billing.street} onChange={(v:any) => setBilling({...billing, street: v})} />
            <Input disabled={billing.sameAsShipping} label="Apartment, suite, etc." value={billing.sameAsShipping ? shipping.apartment : billing.apartment} onChange={(v:any) => setBilling({...billing, apartment: v})} />
            <Input disabled={billing.sameAsShipping} label="City" width="half" value={billing.sameAsShipping ? shipping.city : billing.city} onChange={(v:any) => setBilling({...billing, city: v})} />
            <Input disabled={billing.sameAsShipping} label="State / Province" width="half" value={billing.sameAsShipping ? shipping.state : billing.state} onChange={(v:any) => setBilling({...billing, state: v})} />
            <Input disabled={billing.sameAsShipping} label="ZIP / Postal Code" width="half" value={billing.sameAsShipping ? shipping.zip : billing.zip} onChange={(v:any) => setBilling({...billing, zip: v})} />
            <Input disabled={billing.sameAsShipping} label="Country" width="half" value={billing.sameAsShipping ? shipping.country : billing.country} onChange={(v:any) => setBilling({...billing, country: v})} />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button 
            onClick={handleSave} 
            disabled={loading || saved}
            className={`transition-all font-display tracking-widest text-lg px-12 py-4 rounded-xl flex items-center justify-center min-w-[200px] ${saved ? 'bg-green-500 text-white' : 'bg-primary-fixed text-on-primary hover:opacity-80 disabled:opacity-50'}`}
          >
            {loading ? <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" /> : saved ? 'SAVED!' : 'SAVE ADDRESS'}
          </button>
        </div>

      </div>
    </div>
  )
}
