<template>
  <div class="auth-page-wrapper">
    <div class="auth-form">
      <h2 class="auth-title">Login</h2>
      <form @submit.prevent="login" class="space-y-4">
        <input v-model="email" type="email" placeholder="Email" class="input-base" />
        <input v-model="password" type="password" placeholder="Password" class="input-base" />
        <button type="submit" class="button-primary">Login</button>
      </form>
      <p class="text-sm mt-4 text-center text-gray-600 dark:text-gray-300">
        No account?
        <router-link to="/register" class="text-sky-700 dark:text-sky-400 hover:underline"> Register here </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../api.js'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore.js'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')

const login = async () => {
  try {
    // Step 1: Login
    await api.post(
      '/auth/login',
      {
        email: email.value,
        password: password.value,
      },
      {
        withCredentials: true, // Ensure cookies are sent
      }
    )

    // Step 2: Get fresh user data from the server
    const meRes = await api.get('/auth/me', {
      withCredentials: true,
    })

    // Step 3: Update user store
    userStore.setUser(meRes.data)

    // Step 4: Navigate to homepage
    router.push('/')
  } catch (err) {
    alert('Login failed')
    console.error(err)
  }
}
</script>
