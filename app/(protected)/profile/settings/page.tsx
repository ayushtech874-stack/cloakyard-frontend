'use client'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'next/navigation'
import { User, Shield, Calendar, Phone } from 'lucide-react'

export default function ProfileSettingsPage() {
  const { user, setUser } = useAuthStore()
  const router = useRouter()
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [altPhone, setAltPhone] = useState('')
  const [dob, setDob] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }
    
    if (user.name) {
      const parts = user.name.split(' ')
      setFirstName(parts[0] || '')
      setLastName(parts.slice(1).join(' ') || '')
    }
    setUsername(user.username || '')
    setAltPhone(user.altPhone || '')
    setDob(user.dob || '')
  }, [user, router])

  const handleSave = async () => {
    setLoading(true)
    setMessage({ type: '', text: '' })
    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          firstName,
          lastName,
          username,
          altPhone,
          dob: dob || undefined // don't send empty string if it wasn't set
        })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' })
      } else {
        setUser(data.user)
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const isDobLocked = !!user?.dob

  if (!user) return null

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-4xl text-on-background mb-2 tracking-wide uppercase">Profile Settings</h1>
        <p className="text-on-surface-variant font-body-md text-sm">Manage your personal information, privacy, and security.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
          {message.text}
        </div>
      )}

      {/* Form Sections */}
      <div className="space-y-6">
        
        {/* Basic Info */}
        <div className="bg-surface border border-on-background/5 rounded-xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <User className="text-primary-fixed w-5 h-5" />
            <h2 className="font-headline-lg text-xl uppercase tracking-wider text-on-background">Basic Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">First Name</label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full bg-background border border-on-background/10 rounded-lg px-4 h-12 text-on-background outline-none focus:border-primary-fixed transition-colors" placeholder="John" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">Last Name</label>
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="w-full bg-background border border-on-background/10 rounded-lg px-4 h-12 text-on-background outline-none focus:border-primary-fixed transition-colors" placeholder="Doe" />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-surface border border-on-background/5 rounded-xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Phone className="text-primary-fixed w-5 h-5" />
            <h2 className="font-headline-lg text-xl uppercase tracking-wider text-on-background">Contact Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">Primary Phone (Login)</label>
              <input type="text" disabled value={user.phone} className="w-full bg-background/50 border border-on-background/5 rounded-lg px-4 h-12 text-on-surface-variant outline-none cursor-not-allowed opacity-70" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">Alternative Phone</label>
              <input type="tel" maxLength={10} value={altPhone} onChange={e => setAltPhone(e.target.value.replace(/\D/g, ''))} className="w-full bg-background border border-on-background/10 rounded-lg px-4 h-12 text-on-background outline-none focus:border-primary-fixed transition-colors" placeholder="Optional backup number" />
            </div>
          </div>
        </div>

        {/* Privacy & Social */}
        <div className="bg-surface border border-on-background/5 rounded-xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="text-primary-fixed w-5 h-5" />
            <h2 className="font-headline-lg text-xl uppercase tracking-wider text-on-background">Privacy (Public Reviews)</h2>
          </div>
          <p className="text-sm text-on-surface-variant mb-4">This username will be displayed when you leave product reviews to protect your real identity and phone number.</p>
          
          <div className="space-y-2 max-w-md">
            <label className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">Display Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-background border border-on-background/10 rounded-lg px-4 h-12 text-on-background outline-none focus:border-primary-fixed transition-colors" placeholder="e.g. hypebeast99" />
          </div>
        </div>

        {/* Birthday Offers */}
        <div className="bg-surface border border-on-background/5 rounded-xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="text-primary-fixed w-5 h-5" />
            <h2 className="font-headline-lg text-xl uppercase tracking-wider text-on-background">Birthday Offers</h2>
          </div>
          <p className="text-sm text-on-surface-variant mb-4">Enter your birthday to receive exclusive drops and discounts! <strong className="text-primary-fixed">Note: This can only be set once and cannot be changed later.</strong></p>
          
          <div className="space-y-2 max-w-md">
            <label className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">Date of Birth</label>
            <input 
              type="date" 
              value={dob} 
              onChange={e => setDob(e.target.value)} 
              disabled={isDobLocked}
              className={`w-full border rounded-lg px-4 h-12 outline-none transition-colors ${isDobLocked ? 'bg-background/50 border-on-background/5 text-on-surface-variant cursor-not-allowed opacity-70' : 'bg-background border-on-background/10 text-on-background focus:border-primary-fixed'}`} 
            />
            {isDobLocked && <p className="text-xs text-primary-fixed mt-2">🔒 Your birthday is locked and saved.</p>}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="bg-primary-fixed text-on-primary hover:opacity-80 transition-opacity font-display tracking-widest text-lg px-12 py-4 rounded-xl disabled:opacity-50 flex items-center justify-center min-w-[200px]"
          >
            {loading ? <div className="w-6 h-6 border-2 border-on-primary border-t-transparent rounded-full animate-spin" /> : 'SAVE CHANGES'}
          </button>
        </div>

      </div>
    </div>
  )
}
