import { createApp } from 'vue'
import App from './App.vue'
import VCalendar from 'v-calendar'
import './assets/tailwind.css'
import 'v-calendar/dist/style.css'

const app = createApp(App)

// Register the plugin before mounting
app.use(VCalendar)

app.mount('#app')
