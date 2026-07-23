'use client'
import * as Toast from '@radix-ui/react-toast'
import { useToastStore } from '@/store/toast'

export function Toaster() {
  const { open, message, setOpen } = useToastStore()

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root open={open} onOpenChange={setOpen} className="bg-surface border border-white/10 text-cream p-4 rounded-lg shadow-lg">
        <Toast.Title>{message}</Toast.Title>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-0 right-0 p-6 flex flex-col gap-2 w-96 max-w-[100vw] z-[100]" />
    </Toast.Provider>
  )
}

