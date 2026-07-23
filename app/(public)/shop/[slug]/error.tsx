'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("PRODUCT PAGE ERROR:", error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg text-cream font-mono p-12 text-center">
      <h2 className="text-2xl text-red-400 mb-4">Something went wrong loading this product!</h2>
      <div className="bg-surface2 p-6 rounded text-left border border-white/10 mb-8 max-w-2xl overflow-auto text-sm">
        <p className="text-accent mb-2">Error Details:</p>
        <p>{error.message}</p>
        <p className="text-xs text-muted mt-4 whitespace-pre-wrap">{error.stack}</p>
      </div>
      <button
        onClick={() => reset()}
        className="btn-primary"
      >
        Try again
      </button>
    </div>
  )
}
