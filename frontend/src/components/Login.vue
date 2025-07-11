<template>
  <div class="auth-page-wrapper">
    <div class="auth-form">
      <h2 class="auth-title">Login</h2>
      <form @submit.prevent="login" class="space-y-4">
        <p v-if="errorMessage" class="text-sm text-red-600 dark:text-red-400 text-center">
          {{ errorMessage }}
        </p>
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
const errorMessage = ref('')

const login = async () => {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter both email and password.'
    return
  }

  try {
    await api.post(
      '/auth/login',
      {
        email: email.value,
        password: password.value,
      },
      {
        withCredentials: true,
      }
    )

    const meRes = await api.get('/auth/me', {
      withCredentials: true,
    })

    userStore.setUser(meRes.data)
    router.push('/')
  } catch (err) {
    if (err.response) {
      const status = err.response.status
      const data = err.response.data

      if (status === 401) {
        errorMessage.value = 'Invalid email or password.'
      } else if (status === 400) {
        errorMessage.value = data.message || 'Invalid input.'
      } else {
        errorMessage.value = 'Something went wrong. Please try again.'
      }
    } else {
      errorMessage.value = 'Network error. Please check your connection.'
    }

    console.error('Login error:', err)
  }
}
</script>
