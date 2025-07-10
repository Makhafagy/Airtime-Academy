import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import AdminDashboard from '../components/AdminDashboard.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import { useUserStore } from '../stores/userStore.js'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/admin', name: 'Admin', component: AdminDashboard, meta: { requiresAuth: true, adminOnly: true } },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  if (!userStore.user && userStore.loadUser) {
    try {
      await userStore.loadUser()
    } catch (e) {
      console.warn('User not authenticated')
    }
  }

  const requiresAuth = to.meta?.requiresAuth || false
  const adminOnly = to.meta?.adminOnly || false

  const isAuthenticated = userStore.$state.user !== null
  const isAdmin = userStore.$state.user?.role === 'admin'

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (adminOnly && !isAdmin) {
    next('/')
  } else {
    next()
  }
})

export default router
