'use client'
import { useState } from 'react'
import { Bell, Smartphone, Mail } from 'lucide-react'

export default function NotificationsPage() {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  
  const [prefs, setPrefs] = useState({
    orderSms: true,
    orderEmail: true,
    promoEmail: false,
    promoSms: false,
    restockEmail: true,
  })

  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 1000)
  }

  const Toggle = ({ label, description, checked, onChange, icon: Icon }: any) => (
    <div className="flex items-start justify-between py-5 border-b border-on-background/5 last:border-0">
      <div className="flex gap-4">
        <div className="mt-1 flex-shrink-0 text-on-surface-variant">
          <Icon size={20} />
        </div>
        <div>
          <p className="font-headline-sm text-on-background tracking-wider uppercase mb-1">{label}</p>
          <p className="text-sm text-on-surface-variant font-body-md max-w-sm">{description}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div className="w-11 h-6 bg-on-background/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:border-on-background/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-fixed peer-checked:after:bg-on-primary"></div>
      </label>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-4xl text-on-background mb-2 tracking-wide uppercase">Notifications</h1>
        <p className="text-on-surface-variant font-body-md text-sm">Choose how you want to be updated.</p>
      </div>

      <div className="space-y-6">
        
        <div className="bg-surface border border-on-background/5 rounded-xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-on-background/5">
            <Bell className="text-primary-fixed w-5 h-5" />
            <h2 className="font-headline-lg text-xl uppercase tracking-wider text-on-background">Order Updates</h2>
          </div>
          
          <div className="flex flex-col">
            <Toggle 
              icon={Smartphone}
              label="SMS Tracking" 
              description="Receive text messages when your order ships and is out for delivery."
              checked={prefs.orderSms} 
              onChange={(v:any) => setPrefs({...prefs, orderSms: v})} 
            />
            <Toggle 
              icon={Mail}
              label="Email Tracking" 
              description="Receive emails with detailed tracking links and invoices."
              checked={prefs.orderEmail} 
              onChange={(v:any) => setPrefs({...prefs, orderEmail: v})} 
            />
          </div>
        </div>

        <div className="bg-surface border border-on-background/5 rounded-xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-on-background/5">
            <Bell className="text-primary-fixed w-5 h-5" />
            <h2 className="font-headline-lg text-xl uppercase tracking-wider text-on-background">Drops & Offers</h2>
          </div>
          
          <div className="flex flex-col">
            <Toggle 
              icon={Mail}
              label="Restock Alerts" 
              description="Get emailed instantly when a sold-out item in your wishlist comes back in stock."
              checked={prefs.restockEmail} 
              onChange={(v:any) => setPrefs({...prefs, restockEmail: v})} 
            />
            <Toggle 
              icon={Smartphone}
              label="Exclusive Drops (SMS)" 
              description="Get early access text messages 1 hour before new collections drop."
              checked={prefs.promoSms} 
              onChange={(v:any) => setPrefs({...prefs, promoSms: v})} 
            />
            <Toggle 
              icon={Mail}
              label="Promotions & News" 
              description="Occasional emails about sales, new collections, and brand news."
              checked={prefs.promoEmail} 
              onChange={(v:any) => setPrefs({...prefs, promoEmail: v})} 
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            onClick={handleSave} 
            disabled={loading || saved}
            className={`transition-all font-display tracking-widest text-lg px-12 py-4 rounded-xl flex items-center justify-center min-w-[200px] ${saved ? 'bg-green-500 text-white' : 'bg-primary-fixed text-on-primary hover:opacity-80 disabled:opacity-50'}`}
          >
            {loading ? <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" /> : saved ? 'SAVED!' : 'SAVE PREFERENCES'}
          </button>
        </div>

      </div>
    </div>
  )
}
