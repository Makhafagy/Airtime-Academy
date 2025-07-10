import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import router from './router'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useUserStore } from './stores/userStore'

const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)

  app.use(router)
  app.use(pinia)

  const userStore = useUserStore()
  try {
    const res = await fetch('http://localhost:3001/api/auth/me', {
      credentials: 'include',
    })
    if (res.ok) {
      const data = await res.json()
      userStore.setUser(data)
    } else {
      userStore.clearUser()
    }
  } catch (err) {
    userStore.clearUser()
    console.error('Failed to load user on app start:', err)
  }

  app.mount('#app')
}

bootstrap()
