import { defineStore } from 'pinia'
import { authApi, type User } from '@/api/videohost'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
  }),

  getters: {
    userName: (state) => state.user?.name || 'Гость',
    userAvatar: (state) => state.user?.avatar_path || null,
  },

  actions: {
    async login(email: string, password: string) {
      const response = await authApi.login(email, password)
      const { user, token } = response.data

      this.user = user
      this.token = token
      this.isAuthenticated = true

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      return user
    },

    async register(name: string, email: string, password: string, password_confirmation: string) {
      const response = await authApi.register(name, email, password, password_confirmation)
      const { user, token } = response.data

      this.user = user
      this.token = token
      this.isAuthenticated = true

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      return user
    },

    async logout() {
      try {
        await authApi.logout()
      } catch (e) {
        console.error('Logout error:', e)
      }

      this.user = null
      this.token = null
      this.isAuthenticated = false

      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    async fetchUser() {
      try {
        const response = await authApi.getUser()
        this.user = response.data.user
        localStorage.setItem('user', JSON.stringify(this.user))
      } catch (e) {
        this.logout()
      }
    },

    updateUser(userData: Partial<User>) {
      if (this.user) {
        this.user = { ...this.user, ...userData }
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    },
  },
})
