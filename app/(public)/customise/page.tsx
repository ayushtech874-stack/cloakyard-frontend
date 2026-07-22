'use client'
import { useState, useRef } from 'react'
import { useAuthStore } from '@/store/auth'
import { Upload, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CustomisePage() {
  const router = useRouter()
  const { user, openLogin } = useAuthStore()
  const [step, setStep] = useState(1)
  
  // Step 1
  const [base, setBase] = useState('Oversized')
  const [color, setColor] = useState('Black')
  const [size, setSize] = useState('L')
  
  // Step 2
  const [placement, setPlacement] = useState('Front Center')
  const [brief, setBrief] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    if (!user) { openLogin(() => handleSubmit()); return }
    setLoading(true)
    const res = await fetch('/api/customise', {
      method: 'POST',
      body: JSON.stringify({
        userId: user.id, baseProduct: base, baseColour: color, size, placement, brief
      })
    })
    setLoading(false)
    if (res.ok) setSuccess(true)
  }

  if (success) return (
    <div className="min-h-screen bg-background pt-40 px-6 flex flex-col items-center text-center transition-colors duration-300">
      <CheckCircle2 size={64} className="text-primary-fixed mb-6" />
      <h1 className="font-headline-xl text-4xl text-on-background mb-4 uppercase tracking-tighter">REQUEST SUBMITTED</h1>
      <p className="text-on-surface-variant max-w-md mb-8 font-body-md">Our team will review your brief and send a digital mockup to your registered email and WhatsApp within 24 hours.</p>
      <button onClick={() => router.push('/profile/orders')} className="bg-primary-fixed text-on-primary border border-primary-fixed px-lg py-md font-label-sm text-label-sm uppercase tracking-widest transition-all duration-300 hover:bg-transparent hover:text-primary-fixed">VIEW ORDERS</button>
    </div>
  )

  return (
    <>
      <div className="min-h-screen bg-background pt-32 px-6 md:px-12 max-w-5xl mx-auto pb-24 transition-colors duration-300">
        <div className="text-center mb-16">
          <h1 className="font-headline-xl text-[clamp(40px,6vw,80px)] text-on-background leading-[0.9] mb-4 tracking-tighter uppercase">
            BUILD <span className="text-on-background/40">YOUR OWN.</span>
          </h1>
          <p className="text-on-surface-variant max-w-lg mx-auto font-body-md">Upload your artwork, choose your fit, and let us handle the premium printing and finishing.</p>
        </div>

        <div className="flex gap-4 mb-12 max-w-md mx-auto">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-none transition-colors ${step >= i ? 'bg-primary-fixed' : 'bg-on-background/10'}`} />
          ))}
        </div>

        <div className="bg-surface rounded-none border border-on-background/10 p-6 md:p-12 min-h-[500px]">
          {step === 1 && (
            <div className="animate-fade-in space-y-10">
              <div>
                <h3 className="font-headline-lg text-2xl text-on-background mb-4 uppercase tracking-wider">1. CHOOSE BASE</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Oversized', 'Boxy', 'Streetwear', 'Normal'].map(b => (
                    <button key={b} onClick={() => setBase(b)} className={`h-16 border font-label-sm text-sm uppercase tracking-widest transition-colors ${base === b ? 'bg-primary-fixed border-primary-fixed text-on-primary' : 'bg-background border-on-background/10 text-on-surface-variant hover:border-on-background/30 hover:text-on-background'}`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-headline-lg text-2xl text-on-background mb-4 uppercase tracking-wider">2. BASE COLOUR</h3>
                <div className="flex gap-4">
                  {['Black', 'White', 'Grey', 'Olive', 'Navy'].map(c => (
                    <button 
                      key={c} onClick={() => setColor(c)}
                      className={`w-12 h-12 rounded-none border-2 ${color === c ? 'border-primary-fixed' : 'border-transparent ring-1 ring-on-background/20'}`}
                      style={{ background: c.toLowerCase() === 'white' ? '#f5f0e8' : c.toLowerCase() === 'black' ? '#1a1a1a' : c.toLowerCase() }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-headline-lg text-2xl text-on-background mb-4 uppercase tracking-wider">3. SELECT SIZE</h3>
                <div className="flex gap-4">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(s => (
                    <button key={s} onClick={() => setSize(s)} className={`w-14 h-14 border font-label-sm text-sm uppercase tracking-widest transition-colors ${size === s ? 'bg-primary-fixed border-primary-fixed text-on-primary' : 'bg-background border-on-background/10 text-on-surface-variant hover:border-on-background/30 hover:text-on-background'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-8 border-t border-on-background/10 mt-8">
                <button onClick={() => setStep(2)} className="bg-primary-fixed text-on-primary border border-primary-fixed px-lg py-md font-label-sm text-label-sm uppercase tracking-widest transition-all duration-300 hover:bg-transparent hover:text-primary-fixed">NEXT: DESIGN & ARTWORK →</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in space-y-10">
              <div>
                <h3 className="font-headline-lg text-2xl text-on-background mb-4 uppercase tracking-wider">4. PLACEMENT</h3>
                <div className="grid grid-cols-2 gap-4">
                  {['Front Center', 'Left Chest', 'Back Center', 'Front & Back'].map(p => (
                    <button key={p} onClick={() => setPlacement(p)} className={`h-16 border font-label-sm text-sm uppercase tracking-widest transition-colors ${placement === p ? 'bg-primary-fixed border-primary-fixed text-on-primary' : 'bg-background border-on-background/10 text-on-surface-variant hover:border-on-background/30 hover:text-on-background'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-headline-lg text-2xl text-on-background mb-4 uppercase tracking-wider">5. UPLOAD ARTWORK</h3>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".png,.jpg,.jpeg,.svg"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 border border-dashed border-on-background/20 bg-background flex flex-col items-center justify-center gap-2 hover:border-primary-fixed hover:text-primary-fixed transition-colors text-on-surface-variant group"
                >
                  <Upload size={24} className="group-hover:-translate-y-1 transition-transform" />
                  <span className="font-label-sm tracking-widest uppercase text-sm">
                    {file ? `Selected: ${file.name}` : 'Click to upload files (PNG, JPG, SVG)'}
                  </span>
                </button>
              </div>

              <div>
                <h3 className="font-headline-lg text-2xl text-on-background mb-4 uppercase tracking-wider">6. DESIGN BRIEF</h3>
                <textarea 
                  value={brief} onChange={e => setBrief(e.target.value)}
                  placeholder="Describe how you want it to look. e.g. 'Print the logo 4 inches wide on the left chest, and the main artwork covering the back...'"
                  className="w-full h-32 bg-background border border-on-background/10 p-4 text-on-background focus:border-primary-fixed outline-none resize-none font-body-md"
                />
              </div>

              <div className="flex justify-between pt-8 border-t border-on-background/10 mt-8">
                <button onClick={() => setStep(1)} className="glass border border-on-background/30 text-on-background px-lg py-md font-label-sm text-label-sm uppercase tracking-widest hover:border-primary-fixed hover:text-primary-fixed transition-all duration-300">← BACK</button>
                <button onClick={() => setStep(3)} className="bg-primary-fixed text-on-primary border border-primary-fixed px-lg py-md font-label-sm text-label-sm uppercase tracking-widest transition-all duration-300 hover:bg-transparent hover:text-primary-fixed disabled:opacity-50 disabled:cursor-not-allowed" disabled={!brief}>NEXT: REVIEW →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h3 className="font-headline-lg text-2xl text-on-background mb-8 text-center uppercase tracking-wider">ORDER SUMMARY</h3>
              
              <div className="bg-background border border-on-background/10 p-6 max-w-lg mx-auto space-y-4 mb-12">
                <div className="flex justify-between border-b border-on-background/10 pb-4">
                  <span className="text-on-surface-variant font-label-sm uppercase tracking-widest text-xs">Base Product</span>
                  <span className="text-on-background font-medium font-label-sm uppercase tracking-widest text-sm">{base} Tee</span>
                </div>
                <div className="flex justify-between border-b border-on-background/10 pb-4">
                  <span className="text-on-surface-variant font-label-sm uppercase tracking-widest text-xs">Colour & Size</span>
                  <span className="text-on-background font-medium font-label-sm uppercase tracking-widest text-sm">{color} / {size}</span>
                </div>
                <div className="flex justify-between border-b border-on-background/10 pb-4">
                  <span className="text-on-surface-variant font-label-sm uppercase tracking-widest text-xs">Print Placement</span>
                  <span className="text-on-background font-medium font-label-sm uppercase tracking-widest text-sm">{placement}</span>
                </div>
                <div className="flex justify-between border-b border-on-background/10 pb-4">
                  <span className="text-on-surface-variant font-label-sm uppercase tracking-widest text-xs">Artwork</span>
                  <span className="text-on-background font-medium font-label-sm uppercase tracking-widest text-sm">{file ? file.name : 'None'}</span>
                </div>
                <div>
                  <span className="text-on-surface-variant block mb-2 font-label-sm uppercase tracking-widest text-xs">Brief</span>
                  <p className="text-on-background text-sm italic font-body-md">"{brief}"</p>
                </div>
              </div>

              <div className="flex justify-between max-w-lg mx-auto">
                <button onClick={() => setStep(2)} className="glass border border-on-background/30 text-on-background px-lg py-md font-label-sm text-label-sm uppercase tracking-widest hover:border-primary-fixed hover:text-primary-fixed transition-all duration-300">← BACK</button>
                <button onClick={handleSubmit} disabled={loading} className="bg-primary-fixed text-on-primary border border-primary-fixed px-lg py-md font-label-sm text-label-sm uppercase tracking-widest transition-all duration-300 hover:bg-transparent hover:text-primary-fixed disabled:opacity-50">
                  {loading ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
