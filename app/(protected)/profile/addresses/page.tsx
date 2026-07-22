'use client'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import { MapPin, Plus, Trash2, Edit2, Star, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AddressesPage() {
  const { user } = useAuthStore()
  const [addresses, setAddresses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState<any>(null)

  const fetchAddresses = () => {
    fetch(`/api/profile/addresses?userId=${user?.id}`)
      .then(res => res.json())
      .then(data => { setAddresses(data); setLoading(false) })
  }

  useEffect(() => { if(user) fetchAddresses() }, [user])

  const handleDelete = async (id: string) => {
    if(!confirm('Are you sure?')) return
    await fetch('/api/profile/addresses', { method: 'DELETE', body: JSON.stringify({ id }) })
    fetchAddresses()
  }

  const handleSetDefault = async (address: any) => {
    await fetch('/api/profile/addresses', { method: 'PATCH', body: JSON.stringify({ id: address.id, userId: user?.id, isDefault: true }) })
    fetchAddresses()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())
    
    const payload = {
      ...data,
      userId: user?.id,
      isDefault: formData.get('isDefault') === 'on'
    }

    if (editData) {
      await fetch('/api/profile/addresses', { method: 'PATCH', body: JSON.stringify({ id: editData.id, ...payload }) })
    } else {
      await fetch('/api/profile/addresses', { method: 'POST', body: JSON.stringify(payload) })
    }
    
    setModalOpen(false)
    fetchAddresses()
  }

  const openAdd = () => { setEditData(null); setModalOpen(true) }
  const openEdit = (a: any) => { setEditData(a); setModalOpen(true) }

  if (loading) return <div className="grid md:grid-cols-2 gap-4">{[...Array(2)].map((_,i)=><div key={i} className="h-40 rounded-xl skeleton" />)}</div>

  return (
    <>
      <div className="space-y-6">
        <h2 className="font-display text-2xl text-cream mb-6">SAVED ADDRESSES</h2>
        
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {addresses.map(a => (
            <div key={a.id} className="bg-surface rounded-2xl border border-white/10 p-6 relative group">
              {a.isDefault && (
                <span className="absolute top-4 right-4 bg-accent/20 text-accent px-2 py-1 rounded text-xs font-mono flex items-center gap-1">
                  <Star size={12} className="fill-accent"/> DEFAULT
                </span>
              )}
              <h3 className="font-medium text-cream mb-1 pr-24">{a.name}</h3>
              <p className="text-muted text-sm mb-4">{a.phone}</p>
              
              <div className="text-sm text-muted space-y-1 mb-6 h-16">
                <p className="line-clamp-1">{a.flat}, {a.area}</p>
                <p className="line-clamp-1">{a.city}, {a.state} - {a.pincode}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => openEdit(a)} className="flex-1 btn-outline h-9 text-xs px-0 justify-center">EDIT</button>
                <button onClick={() => handleDelete(a.id)} className="w-10 h-9 border border-white/20 rounded-lg flex items-center justify-center hover:bg-red-400/10 hover:text-red-400 hover:border-red-400/20 transition-colors text-muted">
                  <Trash2 size={14} />
                </button>
                {!a.isDefault && (
                  <button onClick={() => handleSetDefault(a)} className="flex-1 border border-white/20 rounded-lg text-xs font-mono hover:border-accent text-muted hover:text-accent transition-colors">SET DEFAULT</button>
                )}
              </div>
            </div>
          ))}

          <button onClick={openAdd} className="bg-surface border border-white/10 border-dashed rounded-2xl p-6 min-h-[240px] flex flex-col items-center justify-center gap-4 hover:bg-surface2 hover:border-accent transition-colors group">
            <div className="w-12 h-12 rounded-full bg-bg border border-white/10 flex items-center justify-center text-muted group-hover:text-accent group-hover:border-accent/30 transition-colors">
              <Plus size={24} />
            </div>
            <span className="text-cream font-mono text-sm tracking-widest">ADD NEW ADDRESS</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={()=>setModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-surface rounded-2xl border border-white/10 p-6 w-full max-w-lg z-10 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display text-2xl text-cream">{editData ? 'EDIT ADDRESS' : 'NEW ADDRESS'}</h3>
                <button onClick={()=>setModalOpen(false)} className="text-muted hover:text-cream"><X size={20}/></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted mb-1 block">Full Name</label>
                    <input name="name" defaultValue={editData?.name} required className="input-base" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1 block">Phone Number</label>
                    <input name="phone" defaultValue={editData?.phone} required className="input-base" placeholder="9876543210" pattern="[0-9]{10}" />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted mb-1 block">Flat / House No. / Building</label>
                  <input name="flat" defaultValue={editData?.flat} required className="input-base" placeholder="A-101, Prestige Towers" />
                </div>

                <div>
                  <label className="text-xs text-muted mb-1 block">Area / Street / Sector</label>
                  <input name="area" defaultValue={editData?.area} required className="input-base" placeholder="Indiranagar" />
                </div>

                <div className="grid grid-cols-6 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs text-muted mb-1 block">Pincode</label>
                    <input name="pincode" defaultValue={editData?.pincode} required className="input-base" placeholder="560038" pattern="[0-9]{6}" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-muted mb-1 block">City</label>
                    <input name="city" defaultValue={editData?.city} required className="input-base" placeholder="Bengaluru" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-muted mb-1 block">State</label>
                    <input name="state" defaultValue={editData?.state} required className="input-base" placeholder="Karnataka" />
                  </div>
                </div>

                <label className="flex items-center gap-2 mt-4 cursor-pointer">
                  <input type="checkbox" name="isDefault" defaultChecked={editData?.isDefault} className="rounded bg-bg border-white/20 text-accent focus:ring-accent" />
                  <span className="text-sm text-muted">Set as default address</span>
                </label>

                <div className="pt-4 border-t border-white/10 mt-6 flex gap-4">
                  <button type="button" onClick={()=>setModalOpen(false)} className="btn-outline flex-1 justify-center">CANCEL</button>
                  <button type="submit" className="btn-primary flex-1 justify-center">SAVE ADDRESS</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
