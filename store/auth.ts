import { create } from 'zustand'

export interface AuthUser {
  id: string
  phone: string
  name?: string | null
  email?: string | null
}

interface AuthStore {
  user: AuthUser | null
  isLoginOpen: boolean
  pendingAction: (() => void) | null
  openLogin: (afterLogin?: () => void) => void
  closeLogin: () => void
  setUser: (user: AuthUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoginOpen: false,
  pendingAction: null,
  openLogin: (afterLogin) => set({ isLoginOpen: true, pendingAction: afterLogin ?? null }),
  closeLogin: () => set({ isLoginOpen: false, pendingAction: null }),
  setUser: (user) => set({ user, isLoginOpen: false }),
  logout: () => set({ user: null }),
}))
