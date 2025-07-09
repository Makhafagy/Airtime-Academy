import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import router from './router'

const savedTheme = localStorage.getItem('theme')
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

const app = createApp(App)
app.use(router)
app.mount('#app')
