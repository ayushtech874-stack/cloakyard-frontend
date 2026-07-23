import { create } from 'zustand'

interface ToastStore {
  message: string
  open: boolean
  toast: (message: string) => void
  setOpen: (open: boolean) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  message: '',
  open: false,
  toast: (message) => set({ message, open: true }),
  setOpen: (open) => set({ open }),
}))
