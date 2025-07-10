import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
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
        throw err
      }
    },
    clearUser() {
      this.user = null
    },
    setUser(user) {
      this.user = user
    },
  },
})
