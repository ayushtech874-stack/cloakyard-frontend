'use client'
import { useState } from 'react'
import { useAuthStore } from '@/store/auth'
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react'

const FAQS = [
  { q: "What is your return policy?", a: "We offer a 7-day no-questions-asked return policy. The item must be unused, unwashed, and have all original tags attached." },
  { q: "How long does shipping take?", a: "Standard shipping takes 5-7 working days. Express shipping takes 2-3 working days. Custom orders take 8-10 working days as they are made to order." },
  { q: "How do custom orders work?", a: "You select a base product, upload your design, and add placement notes. We'll send you a digital mockup. Once you approve it, we print and ship." },
  { q: "What does 'Oversized' mean?", a: "Our oversized fit features dropped shoulders, a wider chest, and extended length compared to normal t-shirts. Stick to your usual size for the intended baggy look." },
]

export default function HelpPage() {
  const { user } = useAuthStore()
  const [ticketSubject, setTicketSubject] = useState('Order Issue')
  const [ticketMessage, setTicketMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/support', {
      method: 'POST',
      body: JSON.stringify({ userId: user?.id, subject: ticketSubject, message: ticketMessage })
    })
    setLoading(false)
    if (res.ok) {
      alert('Ticket raised successfully. Our team will get back to you within 24 hours.')
      setTicketMessage('')
    }
  }

  return (
    <div className="space-y-12">
      <div>
        <h2 className="font-display text-2xl text-cream mb-6">HELP & SUPPORT</h2>
        
        <div className="bg-surface rounded-2xl border border-white/10 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="text-accent" size={24} />
            <h3 className="font-display text-xl text-cream">RAISE A TICKET</h3>
          </div>
          
          <form onSubmit={handleTicketSubmit} className="space-y-4 max-w-xl">
            <div>
              <label className="text-xs text-muted mb-1 block">Subject</label>
              <select 
                value={ticketSubject} 
                onChange={e => setTicketSubject(e.target.value)}
                className="input-base"
              >
                <option>Order Issue</option>
                <option>Return / Exchange Request</option>
                <option>Custom Order Query</option>
                <option>Payment Failure</option>
                <option>Other</option>
              </select>
            </div>
            
            <div>
              <label className="text-xs text-muted mb-1 block">Message</label>
              <textarea 
                value={ticketMessage} 
                onChange={e => setTicketMessage(e.target.value)}
                required 
                rows={4} 
                className="input-base resize-none"
                placeholder="Describe your issue in detail..."
              />
            </div>
            
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'SUBMITTING...' : 'SUBMIT TICKET'}
            </button>
          </form>
        </div>
      </div>

      <div>
        <h3 className="font-display text-xl text-cream mb-6">FREQUENTLY ASKED QUESTIONS</h3>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-surface rounded-xl border border-white/10 overflow-hidden">
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left text-cream hover:bg-surface2 transition-colors"
              >
                <span className="font-medium pr-8">{faq.q}</span>
                {openFaq === i ? <ChevronUp size={18} className="text-muted flex-shrink-0" /> : <ChevronDown size={18} className="text-muted flex-shrink-0" />}
              </button>
              {openFaq === i && (
                <div className="p-4 pt-0 text-muted text-sm border-t border-white/5 mt-2 bg-bg leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
