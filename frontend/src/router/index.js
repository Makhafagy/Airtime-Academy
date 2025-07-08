import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components//Home.vue'
import AdminDashboard from '../components/AdminDashboard.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/admin', name: 'Admin', component: AdminDashboard },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
