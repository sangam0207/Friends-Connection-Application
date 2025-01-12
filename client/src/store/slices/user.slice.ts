import { StateCreator } from 'zustand';

export interface UserSlice {
  isAuthenticated: boolean | null;
  setAuthenticated: (isAuthenticated: boolean | null) => void;
  user: Record<string, unknown> | null;
  setUser: (user: Record<string, unknown> | null) => void;
  count: number; // New count property
  setCount: (count: number) => void; // Method to update count
}

export interface ProfileSlice {
  profile: Record<string, unknown> | null;
  setProfile: (profile: Record<string, unknown>) => void;
}

export interface TokenSlice {
  token: string | null;
  setToken: (token: string | null) => void;
}

export const userSlice: StateCreator<UserSlice> = (set) => ({
  isAuthenticated: false,
  setAuthenticated: (isAuthenticated: boolean | null) =>
    set(() => ({ isAuthenticated })),
  user: null,
  setUser: (user: Record<string, unknown> | null) => set(() => ({ user })),
  count: 0, 
  setCount: (count: number) => set(() => ({ count })), 
});

export const profileSlice: StateCreator<ProfileSlice> = (set) => ({
  profile: null,
  setProfile: (profile: Record<string, unknown>) => set(() => ({ profile })),
});

export const tokenSlice: StateCreator<TokenSlice> = (set) => ({
  token: null,
  setToken: (token: string | null) => set(() => ({ token })),
});
