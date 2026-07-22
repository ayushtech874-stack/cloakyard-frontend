'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/store/auth'
import dynamic from 'next/dynamic'
import Link from 'next/link'

import { Suspense } from 'react'

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false })

function LoginContent() {
  const { user, setUser } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/profile'

  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    if (user) {
      router.push(redirect)
    }
  }, [user, router, redirect])

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
      document.cookie = `cloakyard-user-id=${data.user.id}; path=/; max-age=2592000` // 30 days
      router.push(redirect)
    } else setError(data.error ?? 'Invalid OTP')
  }

  const handleOTPInput = (val: string, idx: number) => {
    const next = [...otp]; next[idx] = val.slice(-1)
    setOtp(next)
    if (val && idx < 5) document.getElementById(`otp-page-${idx + 1}`)?.focus()
  }

  if (user) return null

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* <Spline scene="https://prod.spline.design/REPLACE_WITH_LOGIN_SCENE/scene.splinecode" /> */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      <Link href="/" className="absolute top-8 left-8 font-display text-2xl text-accent z-20">CLOAKYARD</Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md mx-4 rounded-3xl overflow-hidden glass p-10 border border-white/10"
      >
        <AnimatePresence mode="wait">
          {step === 'phone' ? (
            <motion.div key="phone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="font-display text-5xl text-cream mb-2">ACCESS</h2>
              <p className="text-muted mb-8 font-body">Enter your mobile number to continue</p>
              
              <div className="flex items-center gap-0 mb-6 bg-surface border border-white/10 rounded-xl overflow-hidden focus-within:border-accent transition-colors">
                <span className="px-4 text-muted font-mono border-r border-white/10 h-14 flex items-center">+91</span>
                <input
                  type="tel" maxLength={10} value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && sendOTP()}
                  placeholder="10-digit number"
                  className="flex-1 bg-transparent px-4 text-cream font-mono text-lg outline-none h-14"
                  autoFocus
                />
              </div>
              
              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
              
              <button onClick={sendOTP} disabled={loading} className="btn-primary w-full justify-center h-14 text-lg">
                {loading ? 'SENDING...' : 'CONTINUE →'}
              </button>
            </motion.div>
          ) : (
            <motion.div key="otp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="font-display text-5xl text-cream mb-2">VERIFY</h2>
              <p className="text-muted mb-8 font-body">Sent to +91 {phone}</p>
              
              <div className="flex gap-3 mb-6">
                {otp.map((digit, i) => (
                  <input
                    key={i} id={`otp-page-${i}`}
                    type="text" maxLength={1} value={digit}
                    onChange={e => handleOTPInput(e.target.value, i)}
                    onKeyDown={e => e.key === 'Backspace' && !digit && i > 0 && document.getElementById(`otp-page-${i-1}`)?.focus()}
                    className="flex-1 min-w-0 w-0 h-14 text-center font-mono text-xl text-cream rounded-xl outline-none focus:border-accent transition-colors bg-surface border border-white/10"
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              
              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
              
              <button onClick={verifyOTP} disabled={loading} className="btn-primary w-full justify-center h-14 text-lg mb-4">
                {loading ? 'VERIFYING...' : 'ENTER'}
              </button>
              
              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-muted text-sm font-mono">Resend in {timer}s</p>
                ) : (
                  <button onClick={() => { setStep('phone'); setOtp(['','','','','','']) }} className="text-accent text-sm hover:underline font-mono">
                    Change number or resend
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg flex items-center justify-center"><div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div></div>}>
      <LoginContent />
    </Suspense>
  )
}
