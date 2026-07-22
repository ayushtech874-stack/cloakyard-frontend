'use client'
import * as Toast from '@radix-ui/react-toast'
import { useState, createContext, useContext } from 'react'

const ToastContext = createContext<any>(null)

export function useToast() {
  return useContext(ToastContext)
}

export function Toaster() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  const toast = (msg: string) => {
    setMessage(msg)
    setOpen(true)
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      <Toast.Provider swipeDirection="right">
        <Toast.Root open={open} onOpenChange={setOpen} className="bg-surface border border-white/10 text-cream p-4 rounded-lg shadow-lg">
          <Toast.Title>{message}</Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 p-6 flex flex-col gap-2 w-96 max-w-[100vw] z-[100]" />
      </Toast.Provider>
    </ToastContext.Provider>
  )
}
