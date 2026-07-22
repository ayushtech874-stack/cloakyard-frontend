'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import dynamic from 'next/dynamic'
import Image from 'next/image'
const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false })

export function LoginModal() {
  const { isLoginOpen, closeLogin, setUser, pendingAction } = useAuthStore()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(0)

  const sendOTP = async () => {
    if (phone.length !== 10) { setError('Enter a valid 10-digit number'); return }
    setLoading(true); setError('')
    const res = await fetch('/api/auth/send-otp', { method: 'POST', body: JSON.stringify({ phone }), headers: { 'Content-Type': 'application/json' } })
    setLoading(false)
    if (res.ok) {
      setStep('otp')
      setTimer(45)
      const interval = setInterval(() => setTimer(t => { if (t <= 1) { clearInterval(interval); return 0 } return t - 1 }), 1000)
    } else setError('Failed to send OTP. Try again.')
  }

  const verifyOTP = async () => {
    const code = otp.join('')
    if (code.length !== 6) { setError('Enter all 6 digits'); return }
    setLoading(true); setError('')
    const res = await fetch('/api/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phone, otp: code }), headers: { 'Content-Type': 'application/json' } })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      setUser(data.user)
      closeLogin()
      if (pendingAction) pendingAction()
      setStep('phone'); setPhone(''); setOtp(['', '', '', '', '', ''])
    } else setError(data.error ?? 'Invalid OTP')
  }

  const handleOTPInput = (val: string, idx: number) => {
    const next = [...otp]; next[idx] = val.slice(-1)
    setOtp(next)
    if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus()
  }

  if (!isLoginOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={closeLogin}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative z-10 w-full max-w-sm mx-4 rounded-2xl overflow-hidden"
          style={{ background: 'rgba(14,14,14,0.97)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 40px 100px rgba(0,0,0,0.9)' }}
        >
          {/* 3D background strip */}
          <div className="h-32 relative overflow-hidden bg-surface2">
            {/* <Spline scene="https://prod.spline.design/REPLACE_WITH_LOGIN_SCENE/scene.splinecode" /> */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(14,14,14,0.97)]" />
          </div>

          <div className="px-8 pb-8 -mt-4 relative z-10">
            <button onClick={closeLogin} className="absolute top-0 right-6 text-muted hover:text-cream transition-colors">
              <X size={18} />
            </button>

            <div className="mb-4">
              <Image src="/logo.jpeg" alt="Cloakyard" width={140} height={35} className="object-contain" />
            </div>

            <AnimatePresence mode="wait">
              {step === 'phone' ? (
                <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="font-display text-4xl text-cream mb-1">SIGN IN</h2>
                  <p className="text-muted text-sm mb-6">Enter your mobile number to continue</p>
                  <div className="flex items-center gap-0 mb-4" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10 }}>
                    <span className="px-3 text-muted font-mono text-sm border-r border-white/10 h-12 flex items-center">+91</span>
                    <input
                      type="tel" maxLength={10} value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                      onKeyDown={e => e.key === 'Enter' && sendOTP()}
                      placeholder="10-digit number"
                      className="flex-1 bg-transparent px-3 text-cream font-body text-sm outline-none h-12"
                    />
                  </div>
                  {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
                  <button onClick={sendOTP} disabled={loading} className="btn-primary w-full justify-center">
                    {loading ? 'Sending...' : 'SEND OTP'}
                  </button>
                  <p className="text-muted text-xs text-center mt-3">No password. No hassle.</p>
                </motion.div>
              ) : (
                <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h2 className="font-display text-4xl text-cream mb-1">VERIFY</h2>
                  <p className="text-muted text-sm mb-6">Sent to +91 {phone}</p>
                  <div className="flex gap-2 mb-4">
                    {otp.map((digit, i) => (
                      <input
                        key={i} id={`otp-${i}`}
                        type="text" maxLength={1} value={digit}
                        onChange={e => handleOTPInput(e.target.value, i)}
                        onKeyDown={e => e.key === 'Backspace' && !digit && i > 0 && document.getElementById(`otp-${i-1}`)?.focus()}
                        className="flex-1 h-12 text-center font-mono text-lg text-cream rounded-lg outline-none focus:border-accent transition-colors"
                        style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
                      />
                    ))}
                  </div>
                  {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
                  <button onClick={verifyOTP} disabled={loading} className="btn-primary w-full justify-center">
                    {loading ? 'Verifying...' : 'VERIFY →'}
                  </button>
                  <div className="text-center mt-3">
                    {timer > 0 ? (
                      <p className="text-muted text-xs">Resend in {timer}s</p>
                    ) : (
                      <button onClick={() => { setStep('phone'); setOtp(['','','','','','']) }} className="text-accent text-xs hover:underline">
                        Change number or resend OTP
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
