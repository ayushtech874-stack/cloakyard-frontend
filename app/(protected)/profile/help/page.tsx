'use client'
import { useState } from 'react'
import { HelpCircle, Mail, MessageSquare, ChevronDown, Phone } from 'lucide-react'

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  
  const [contact, setContact] = useState({ subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const faqs = [
    { q: 'How long does shipping usually take?', a: 'Standard shipping within India takes 3-5 business days. Express shipping takes 1-2 business days. For international orders, please allow 7-14 business days.' },
    { q: 'What is your return and exchange policy?', a: 'We offer a 14-day return and exchange policy for unworn items with tags still attached. Sale items and limited drops are final sale and cannot be returned.' },
    { q: 'How do your oversized tees fit?', a: 'Our garments are true-to-size for an oversized streetwear fit. If you prefer a more regular fit, we recommend sizing down one full size.' },
    { q: 'How do I wash and care for my clothes?', a: 'For best results and longevity, machine wash cold inside-out with like colors. Do not tumble dry—always hang dry. Iron on the reverse side to protect puff prints and graphics.' },
    { q: 'Restocks for sold-out drops?', a: 'Our exclusive drops are usually limited runs and do not restock once sold out. However, our core collection items restock every month. Subscribe to SMS alerts to be notified first.' },
  ]

  const handleSend = () => {
    if (!contact.subject || !contact.message) return alert("Please fill out both fields")
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
      setContact({ subject: '', message: '' })
      setTimeout(() => setSent(false), 3000)
    }, 1500)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-4xl text-on-background mb-2 tracking-wide uppercase">Help & Support</h1>
        <p className="text-on-surface-variant font-body-md text-sm">We're here to help. Find answers or reach out to us directly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* FAQ Section */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface border border-on-background/5 rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-on-background/5">
              <HelpCircle className="text-primary-fixed w-5 h-5" />
              <h2 className="font-headline-lg text-xl uppercase tracking-wider text-on-background">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-on-background/10 rounded-lg overflow-hidden bg-background/50 transition-all">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-surface2 transition-colors"
                  >
                    <span className="font-headline-sm text-sm uppercase tracking-widest text-on-background">{faq.q}</span>
                    <ChevronDown size={16} className={`text-on-surface-variant transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="p-4 pt-0 text-sm text-on-surface-variant leading-relaxed font-body-md border-t border-on-background/5 mt-2">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-on-background/5 rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-on-background/5">
              <MessageSquare className="text-primary-fixed w-5 h-5" />
              <h2 className="font-headline-lg text-xl uppercase tracking-wider text-on-background">Contact Us</h2>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-on-surface-variant text-sm font-body-md">
                <Mail size={16} />
                <a href="mailto:support@cloakyard.in" className="hover:text-primary-fixed transition-colors">support@cloakyard.in</a>
              </div>
              <div className="flex items-center gap-3 text-on-surface-variant text-sm font-body-md">
                <Phone size={16} />
                <a href="tel:+919876543210" className="hover:text-primary-fixed transition-colors">+91 98765 43210</a>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">Subject</label>
                <select 
                  value={contact.subject} onChange={e => setContact({...contact, subject: e.target.value})}
                  className="w-full h-12 px-4 rounded-lg outline-none transition-colors bg-background border border-on-background/10 text-on-background focus:border-primary-fixed appearance-none"
                >
                  <option value="" disabled>Select a topic...</option>
                  <option value="order_status">Where is my order?</option>
                  <option value="return_exchange">Return / Exchange Request</option>
                  <option value="product_question">Question about a product</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">Message</label>
                <textarea 
                  value={contact.message} onChange={e => setContact({...contact, message: e.target.value})}
                  placeholder="How can we help you?"
                  className="w-full p-4 min-h-[120px] rounded-lg outline-none transition-colors bg-background border border-on-background/10 text-on-background focus:border-primary-fixed resize-none"
                />
              </div>
              
              <button 
                onClick={handleSend} 
                disabled={loading || sent}
                className={`w-full transition-all font-display tracking-widest text-sm px-6 py-4 rounded-xl flex items-center justify-center ${sent ? 'bg-green-500 text-white' : 'bg-primary-fixed text-on-primary hover:opacity-80 disabled:opacity-50'}`}
              >
                {loading ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : sent ? 'MESSAGE SENT!' : 'SEND MESSAGE'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
