'use client'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'

export default function NotificationsPage() {
  const { user } = useAuthStore()
  const [prefs, setPrefs] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      fetch(`/api/profile?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          setPrefs(data.notifications || {
            smsEnabled: true, whatsappEnabled: true, emailEnabled: true,
            marketingSms: false, marketingWhatsapp: false, marketingEmail: false
          })
          setLoading(false)
        })
    }
  }, [user])

  const handleChange = async (key: string, value: boolean) => {
    const newPrefs = { ...prefs, [key]: value }
    setPrefs(newPrefs)
    setSaving(true)
    await fetch('/api/profile/notifications', {
      method: 'PATCH',
      body: JSON.stringify({ userId: user?.id, ...newPrefs })
    })
    setSaving(false)
  }

  if (loading) return <div className="h-64 rounded-xl skeleton" />

  const Toggle = ({ label, desc, checked, onChange }: any) => (
    <div className="flex items-center justify-between p-4 border-b border-white/10 last:border-0">
      <div>
        <p className="text-cream font-medium">{label}</p>
        <p className="text-muted text-sm">{desc}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div className="w-11 h-6 bg-surface2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent border border-white/10"></div>
      </label>
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-4 mb-6">
          <h2 className="font-display text-2xl text-cream">NOTIFICATIONS</h2>
          {saving && <span className="text-xs text-accent font-mono animate-pulse">Saving...</span>}
        </div>
        
        <div className="bg-surface rounded-2xl border border-white/10 overflow-hidden mb-8">
          <div className="p-4 bg-surface2 border-b border-white/10">
            <h3 className="text-cream font-medium text-sm font-mono tracking-widest">ORDER UPDATES</h3>
          </div>
          <Toggle 
            label="SMS" desc="Order confirmation, shipping, out for delivery"
            checked={prefs.smsEnabled} onChange={(v:boolean) => handleChange('smsEnabled', v)}
          />
          <Toggle 
            label="WhatsApp" desc="Get instant updates directly on WhatsApp"
            checked={prefs.whatsappEnabled} onChange={(v:boolean) => handleChange('whatsappEnabled', v)}
          />
          <Toggle 
            label="Email" desc="Detailed invoice and order tracking links"
            checked={prefs.emailEnabled} onChange={(v:boolean) => handleChange('emailEnabled', v)}
          />
        </div>

        <div className="bg-surface rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-4 bg-surface2 border-b border-white/10">
            <h3 className="text-cream font-medium text-sm font-mono tracking-widest">PROMOTIONS & DROPS</h3>
          </div>
          <Toggle 
            label="SMS Marketing" desc="Early access codes and flash sales"
            checked={prefs.marketingSms} onChange={(v:boolean) => handleChange('marketingSms', v)}
          />
          <Toggle 
            label="WhatsApp Marketing" desc="New collection drops and lookbooks"
            checked={prefs.marketingWhatsapp} onChange={(v:boolean) => handleChange('marketingWhatsapp', v)}
          />
          <Toggle 
            label="Email Newsletter" desc="Brand stories, community spotlights, offers"
            checked={prefs.marketingEmail} onChange={(v:boolean) => handleChange('marketingEmail', v)}
          />
        </div>
      </div>
    </div>
  )
}
