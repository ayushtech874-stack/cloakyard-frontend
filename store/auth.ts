import { create } from 'zustand'

export interface AuthUser {
  id: string
  phone: string
  name?: string | null
  email?: string | null
  username?: string | null
  dob?: string | null
  altPhone?: string | null
  avatar?: string | null
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
  logout: () => {
    document.cookie = 'cloakyard-user-id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    set({ user: null })
  },
}))
