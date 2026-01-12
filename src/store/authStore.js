import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Authentication Store
 * Manages user authentication state using Zustand
 * Persists to localStorage for session persistence
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      /**
       * Set user authentication data
       */
      setAuth: (user, accessToken, refreshToken) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      /**
       * Update access token (used when refreshing)
       */
      setAccessToken: (accessToken) =>
        set({ accessToken }),

      /**
       * Update user profile
       */
      setUser: (user) =>
        set({ user }),

      /**
       * Clear authentication data (logout)
       */
      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      /**
       * Set loading state
       */
      setLoading: (isLoading) =>
        set({ isLoading }),

      /**
       * Get current access token
       */
      getAccessToken: () => get().accessToken,

      /**
       * Get current refresh token
       */
      getRefreshToken: () => get().refreshToken,
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
