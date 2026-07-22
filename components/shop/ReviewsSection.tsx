'use client'
import { useState, useEffect } from 'react'
import { Star, User } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

export default function ReviewsSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([])
  const [stats, setStats] = useState({ totalRatings: 0, avgRating: 0 })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  
  const { user, openLogin } = useAuthStore()

  // Form state
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`)
      if (res.ok) {
        const data = await res.json()
        setReviews(data.reviews || [])
        setStats(data.stats || { totalRatings: 0, avgRating: 0 })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      openLogin(() => setShowForm(true))
      return
    }
    
    setSubmitting(true)
    setError('')
    
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          userId: user.id,
          rating,
          title,
          body
        })
      })
      
      if (!res.ok) throw new Error('Failed to submit review')
      
      setShowForm(false)
      setTitle('')
      setBody('')
      setRating(5)
      fetchReviews() // refresh list
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="py-12 border-t border-white/10 text-center text-muted">Loading reviews...</div>

  return (
    <div className="py-16 border-t border-white/10 mt-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h2 className="font-display text-3xl text-cream mb-2">CUSTOMER REVIEWS</h2>
            <div className="flex items-center gap-2">
              <div className="flex text-accent">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} size={20} className={star <= Math.round(stats.avgRating) ? 'fill-accent' : 'text-white/20'} />
                ))}
              </div>
              <span className="text-cream font-mono">{stats.avgRating.toFixed(1)} out of 5</span>
              <span className="text-muted text-sm ml-2">Based on {stats.totalRatings} reviews</span>
            </div>
          </div>
          
          {!showForm && (
            <button 
              onClick={() => user ? setShowForm(true) : openLogin(() => setShowForm(true))} 
              className="btn-outline"
            >
              WRITE A REVIEW
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-surface p-6 md:p-8 rounded-2xl border border-white/10 mb-12">
            <h3 className="font-display text-xl text-cream mb-6">Write Your Review</h3>
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            
            <div className="mb-6">
              <label className="text-sm text-muted block mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    type="button" 
                    onClick={() => setRating(star)}
                    className={`hover:scale-110 transition-transform ${star <= rating ? 'text-accent' : 'text-white/20'}`}
                  >
                    <Star size={32} className={star <= rating ? 'fill-accent' : ''} />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-sm text-muted block mb-2">Review Title</label>
              <input required value={title} onChange={e=>setTitle(e.target.value)} className="input-base" placeholder="Sum up your experience" />
            </div>

            <div className="mb-6">
              <label className="text-sm text-muted block mb-2">Review Details</label>
              <textarea required value={body} onChange={e=>setBody(e.target.value)} className="input-base min-h-[120px]" placeholder="How does it fit? How is the quality?" />
            </div>

            <div className="flex gap-4">
              <button type="submit" disabled={submitting} className="btn-primary flex-1 justify-center">
                {submitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline px-6">CANCEL</button>
            </div>
          </form>
        )}

        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-center text-muted py-8">No reviews yet. Be the first to review this item!</p>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="bg-surface2 p-6 rounded-xl border border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center text-muted">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-cream font-medium flex items-center gap-2">
                        {review.user?.name || review.user?.phone || 'Anonymous'}
                        {review.isVerified && <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded font-mono uppercase tracking-wider border border-accent/20">Verified</span>}
                      </p>
                      <p className="text-xs text-muted">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex text-accent">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={14} className={star <= review.rating ? 'fill-accent' : 'text-white/20'} />
                    ))}
                  </div>
                </div>
                
                {review.title && <h4 className="text-cream font-medium mb-2">{review.title}</h4>}
                <p className="text-muted text-sm leading-relaxed">{review.body}</p>
                
                {review.teamReply && (
                  <div className="mt-4 p-4 bg-surface rounded-lg border border-white/5 ml-6">
                    <p className="text-xs text-accent font-mono mb-1">CLOAKYARD TEAM</p>
                    <p className="text-sm text-cream">{review.teamReply}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
