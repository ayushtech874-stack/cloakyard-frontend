import { useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'

export default function ProductFormModal({ isOpen, onClose, onSave, initialData }: { isOpen: boolean, onClose: () => void, onSave: () => void, initialData?: any }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Basic Fields
  const [name, setName] = useState(initialData?.name || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [fabric, setFabric] = useState(initialData?.fabric || '')
  const [careInstructions, setCareInstructions] = useState(initialData?.careInstructions || '')
  const [fitType, setFitType] = useState(initialData?.fitType || 'Oversized')
  const [gender, setGender] = useState(initialData?.gender || 'Unisex')
  
  // Flags
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true)
  const [isNew, setIsNew] = useState(initialData?.isNew ?? true)
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false)

  // Complex fields (only for creation in this simplified version)
  const [images, setImages] = useState<string[]>(initialData ? [] : [''])
  const [variants, setVariants] = useState<any[]>(initialData ? [] : [{ size: 'M', colour: 'Black', price: '149900', stock: '100', sku: 'SKU-' + Date.now() }])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      name, slug, description, fabric, careInstructions, fitType, gender, isActive, isNew, isFeatured,
      images: images.filter(i => i.trim() !== ''),
      variants
    }

    const pwd = localStorage.getItem('cloakyard_admin_pwd')
    
    try {
      const url = initialData ? `/api/admin/products/${initialData.id}` : '/api/admin/products'
      const method = initialData ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${pwd}`
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save product')
      }

      onSave()
      onClose()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addImage = () => setImages([...images, ''])
  const updateImage = (index: number, val: string) => {
    const newImgs = [...images]
    newImgs[index] = val
    setImages(newImgs)
  }
  const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index))

  const addVariant = () => setVariants([...variants, { size: 'L', colour: 'Black', price: '149900', stock: '100', sku: 'SKU-' + Date.now() }])
  const updateVariant = (index: number, field: string, val: string) => {
    const newVars = [...variants]
    newVars[index][field] = val
    setVariants(newVars)
  }
  const removeVariant = (index: number) => setVariants(variants.filter((_, i) => i !== index))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface rounded-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-surface2">
          <h2 className="font-display text-2xl text-cream">{initialData ? 'EDIT PRODUCT' : 'NEW PRODUCT'}</h2>
          <button onClick={onClose} className="text-muted hover:text-cream"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form id="productForm" onSubmit={handleSubmit} className="space-y-8">
            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">{error}</div>}
            
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-mono text-accent text-sm border-b border-white/5 pb-2">BASIC INFO</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-muted block mb-1">Product Name</label><input required value={name} onChange={e=>setName(e.target.value)} className="input-base" placeholder="Void Oversized Tee" /></div>
                <div><label className="text-xs text-muted block mb-1">Slug (URL friendly)</label><input required value={slug} onChange={e=>setSlug(e.target.value)} className="input-base" placeholder="void-oversized-tee" /></div>
              </div>
              <div><label className="text-xs text-muted block mb-1">Description</label><textarea required value={description} onChange={e=>setDescription(e.target.value)} className="input-base min-h-[100px]" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs text-muted block mb-1">Fabric</label><input required value={fabric} onChange={e=>setFabric(e.target.value)} className="input-base" placeholder="100% French Terry Cotton (240 GSM)" /></div>
                <div><label className="text-xs text-muted block mb-1">Care Instructions</label><input required value={careInstructions} onChange={e=>setCareInstructions(e.target.value)} className="input-base" placeholder="Machine wash cold. Do not iron on print." /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted block mb-1">Fit Type</label>
                  <select value={fitType} onChange={e=>setFitType(e.target.value)} className="input-base"><option>Oversized</option><option>Boxy</option><option>Regular</option><option>Slim</option></select>
                </div>
                <div>
                  <label className="text-xs text-muted block mb-1">Gender</label>
                  <select value={gender} onChange={e=>setGender(e.target.value)} className="input-base"><option>Unisex</option><option>Men</option><option>Women</option></select>
                </div>
              </div>
              <div className="flex gap-6 mt-4">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isActive} onChange={e=>setIsActive(e.target.checked)} /> Active (Visible in store)</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isNew} onChange={e=>setIsNew(e.target.checked)} /> Mark as "New Arrival"</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isFeatured} onChange={e=>setIsFeatured(e.target.checked)} /> Featured on Homepage</label>
              </div>
            </div>

            {/* Images (Only on create for now) */}
            {!initialData && (
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-white/5 pb-2">
                  <h3 className="font-mono text-accent text-sm">IMAGES (URLs)</h3>
                  <button type="button" onClick={addImage} className="text-xs text-cream flex items-center gap-1 hover:text-accent"><Plus size={14}/> Add Image</button>
                </div>
                {images.map((img, i) => (
                  <div key={i} className="flex gap-2">
                    <input value={img} onChange={e=>updateImage(i, e.target.value)} className="input-base flex-1" placeholder="https://your-storage.com/image.jpg" />
                    <button type="button" onClick={() => removeImage(i)} className="btn-outline px-3 border-red-500/20 text-red-400 hover:bg-red-500/10"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            )}

            {/* Variants (Only on create for now) */}
            {!initialData && (
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-white/5 pb-2">
                  <h3 className="font-mono text-accent text-sm">VARIANTS (Sizes/Colors)</h3>
                  <button type="button" onClick={addVariant} className="text-xs text-cream flex items-center gap-1 hover:text-accent"><Plus size={14}/> Add Variant</button>
                </div>
                {variants.map((v, i) => (
                  <div key={i} className="grid grid-cols-6 gap-2 items-center bg-surface2 p-3 rounded-xl border border-white/5">
                    <div className="col-span-1"><label className="text-[10px] text-muted block">Size</label><input value={v.size} onChange={e=>updateVariant(i, 'size', e.target.value)} className="input-base py-1 px-2 text-sm h-8" /></div>
                    <div className="col-span-1"><label className="text-[10px] text-muted block">Color</label><input value={v.colour} onChange={e=>updateVariant(i, 'colour', e.target.value)} className="input-base py-1 px-2 text-sm h-8" /></div>
                    <div className="col-span-1"><label className="text-[10px] text-muted block">Price (in paise)</label><input type="number" value={v.price} onChange={e=>updateVariant(i, 'price', e.target.value)} className="input-base py-1 px-2 text-sm h-8" /></div>
                    <div className="col-span-1"><label className="text-[10px] text-muted block">Stock</label><input type="number" value={v.stock} onChange={e=>updateVariant(i, 'stock', e.target.value)} className="input-base py-1 px-2 text-sm h-8" /></div>
                    <div className="col-span-1"><label className="text-[10px] text-muted block">SKU</label><input value={v.sku} onChange={e=>updateVariant(i, 'sku', e.target.value)} className="input-base py-1 px-2 text-sm h-8" /></div>
                    <div className="col-span-1 flex justify-end pt-4"><button type="button" onClick={() => removeVariant(i)} className="text-red-400 hover:text-red-300"><Trash2 size={16}/></button></div>
                  </div>
                ))}
              </div>
            )}
            
            {initialData && (
              <p className="text-xs text-muted italic">Note: Editing existing variants and images is disabled in this simplified panel. Please create a new product or use Prisma Studio to modify nested relations.</p>
            )}

          </form>
        </div>

        <div className="p-6 border-t border-white/10 bg-surface2 flex justify-end gap-4">
          <button type="button" onClick={onClose} className="btn-outline">CANCEL</button>
          <button type="submit" form="productForm" disabled={loading} className="btn-primary">
            {loading ? 'SAVING...' : 'SAVE PRODUCT'}
          </button>
        </div>
      </div>
    </div>
  )
}
