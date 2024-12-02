import { create } from 'zustand';

interface AuthState {
  authToken: string | undefined;
  setAuthToken: (token: string) => void;
  clearAuthToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  authToken: undefined,
  setAuthToken: (token) => set({ authToken: token }),
  clearAuthToken: () => set({ authToken: undefined }),
}));