<template>
  <div class="auth-page-wrapper">
    <div class="auth-form">
      <h2 class="auth-title">Create Account</h2>

      <form @submit.prevent="register" class="space-y-4">
        <div v-if="errorMessage" class="text-red-600 dark:text-red-400 mb-4 text-center">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="text-green-600 dark:text-green-400 mb-4 text-center">
          {{ successMessage }}
        </div>

        <input v-model="firstName" type="text" placeholder="First Name" class="input-base" required />
        <p v-if="firstName && !isFirstNameValid" class="text-sm text-red-600 dark:text-red-400">First name must contain only letters.</p>

        <input v-model="lastName" type="text" placeholder="Last Name" class="input-base" required />
        <p v-if="lastName && !isLastNameValid" class="text-sm text-red-600 dark:text-red-400">Last name must contain only letters.</p>

        <input v-model="email" type="email" placeholder="Email" class="input-base" required />
        <p v-if="email && !isEmailValid" class="text-sm text-red-600 dark:text-red-400">Please enter a valid email address.</p>

        <input v-model="password" type="password" placeholder="Password" class="input-base" required />
        <p v-if="password && !isPasswordStrong" class="text-sm text-red-600 dark:text-red-400">
          Password must be at least 8 characters, include uppercase, lowercase, number, and special character.
        </p>

        <button type="submit" class="button-primary">Register</button>
      </form>

      <p class="text-sm mt-4 text-center text-gray-600 dark:text-gray-300">
        Already have an account?
        <router-link to="/login" class="text-sky-700 dark:text-sky-400 hover:underline">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import api from '../api.js'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore.js'

const router = useRouter()
const userStore = useUserStore()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const successMessage = ref('')
const errorMessage = ref('')

// Validation regexes
const nameRegex = /^[A-Za-z]+$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W_]{8,}$/

// Validation computed props
const isFirstNameValid = computed(() => nameRegex.test(firstName.value))
const isLastNameValid = computed(() => nameRegex.test(lastName.value))
const isEmailValid = computed(() => emailRegex.test(email.value))
const isPasswordStrong = computed(() => passwordRegex.test(password.value))

const isFormValid = computed(() => {
  return isFirstNameValid.value && isLastNameValid.value && isEmailValid.value && isPasswordStrong.value
})

const register = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!isFormValid.value) {
    errorMessage.value = 'Please complete all fields correctly.'
    return
  }

  try {
    const res = await api.post('/auth/register', {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    })

    if (!res.data.user) {
      errorMessage.value = 'Registration succeeded but no user info returned.'
      return
    }

    userStore.setUser(res.data.user)

    successMessage.value = 'Account created successfully! Redirecting...'

    setTimeout(() => {
      router.push('/')
    }, 1500)
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      errorMessage.value = err.response.data.message
    } else {
      errorMessage.value = 'Registration failed. Please try again.'
    }
    console.error(err)
  }
}
</script>
