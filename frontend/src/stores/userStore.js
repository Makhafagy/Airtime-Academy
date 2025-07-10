import { defineStore } from 'pinia'
import api from '../api.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    userLoaded: false, // add this
  }),
  getters: {
    isAuthenticated: state => !!state.user,
    isAdmin: state => state.user?.role === 'admin',
  },
  actions: {
    async loadUser() {
      try {
        const res = await api.get('/auth/me')
        this.user = res.data
      } catch (err) {
        this.user = null
      } finally {
        this.userLoaded = true
      }
    },
    clearUser() {
      this.user = null
      this.userLoaded = true
    },
    setUser(user) {
      this.user = user
      this.userLoaded = true
    },
  },
})
