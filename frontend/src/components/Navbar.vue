<template>
  <nav class="navbar">
    <div class="navbar-inner grid grid-cols-3 items-center relative">
      <!-- Hamburger (Mobile only, absolute) -->
      <button @click="toggleMobileMenu" class="hamburger-btn sm:hidden absolute left-4 top-1/2 -translate-y-1/2 z-20" aria-label="Toggle menu">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>

      <!-- Left Links (Desktop only) -->
      <div class="navbar-section navbar-left hidden sm:flex justify-start gap-4">
        <a href="#" @click.prevent="handleNavClick('booking')" class="nav-link">Booking</a>
        <a href="#" @click.prevent="handleNavClick('contact')" class="nav-link">Contact</a>
        <a href="#" @click.prevent="handleNavClick('company')" class="nav-link">About</a>
      </div>

      <!-- Center Logo (Always centered) -->
      <div class="flex justify-center col-span-3 sm:col-span-1">
        <img src="../assets/images/airtime-academy-badge.svg" alt="Logo" class="logo-image" />
      </div>

      <!-- Right Nav Links (Desktop only) -->
      <div class="navbar-section navbar-right hidden sm:flex items-center gap-4">
        <!-- Show Admin Dashboard link only if user is signed in -->
        <router-link v-if="user && user.role === 'admin'" to="/admin" class="nav-link"> Admin Dashboard </router-link>

        <!-- Dark Mode Toggle -->
        <button
          @click="toggleDarkMode"
          @mouseenter="showTooltip = true"
          @mouseleave="showTooltip = false"
          @focus="showTooltip = true"
          @blur="showTooltip = false"
          aria-label="Toggle Dark Mode"
          class="relative text-xl text-gray-700 dark:text-gray-200 hover:text-sky-500 transition cursor-pointer hover:scale-110"
        >
          <span v-if="isDark">🌞</span>
          <span v-else>🌙</span>

          <div
            v-if="showTooltip"
            class="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded shadow-lg whitespace-nowrap select-none pointer-events-none z-50"
          >
            {{ isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}
          </div>
        </button>

        <!-- User Account -->
        <div class="relative" ref="userMenuRef">
          <!-- Signed In: show icon button -->
          <button v-if="user" @click="toggleUserMenu" class="nav-link flex items-center cursor-pointer select-none" aria-label="User Account Menu">
            <!-- User Icon -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-gray-700 dark:text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
            </svg>
          </button>

          <!-- Signed Out: show Sign In -->
          <router-link v-else to="/login" class="nav-link underline" @click="closeUserMenu">Sign In</router-link>

          <!-- Dropdown Menu -->
          <div
            v-if="user && showUserMenu"
            class="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-md z-50"
          >
            <button
              @click="logout"
              class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-700 dark:text-red-400 rounded cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMobileOpen" class="mobile-nav sm:hidden">
      <a href="#" @click.prevent="handleNavClick('booking')" class="mobile-nav-link">Booking</a>
      <a href="#" @click.prevent="handleNavClick('contact')" class="mobile-nav-link">Contact</a>
      <a href="#" @click.prevent="handleNavClick('company')" class="mobile-nav-link">About</a>
      <router-link to="/admin" class="mobile-nav-link" @click.native="closeMobileMenu">Admin Dashboard</router-link>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/userStore.js'
import api from '../api.js'

const userStore = useUserStore()
const user = computed(() => userStore.user)

const router = useRouter()
const route = useRoute()

const isMobileOpen = ref(false)
const showTooltip = ref(false)
const showUserMenu = ref(false)

const isDark = ref(document.documentElement.classList.contains('dark'))

const userMenuRef = ref(null)

const handleClickOutside = event => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

onMounted(() => {
  // Load theme
  const saved = localStorage.getItem('theme')
  if (saved === 'dark') {
    document.documentElement.classList.add('dark')
    isDark.value = true
  }

  // Restore user
  // const storedUser = localStorage.getItem('user')
  // if (storedUser) {
  //   userStore.setUser(JSON.parse(storedUser))
  // }
})

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const scrollToSection = id => {
  const el = document.getElementById(id)
  if (el) {
    const yOffset = -128
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
    window.scrollTo({ top: y, behavior: 'smooth' })

    el.classList.add('highlight-border')
    setTimeout(() => el.classList.remove('highlight-border'), 1500)
  }
}

const handleNavClick = id => {
  closeMobileMenu()
  if (route.path === '/') {
    scrollToSection(id)
  } else {
    router.push('/').then(() => setTimeout(() => scrollToSection(id), 300))
  }
}

const toggleMobileMenu = () => (isMobileOpen.value = !isMobileOpen.value)
const closeMobileMenu = () => (isMobileOpen.value = false)
const toggleUserMenu = () => (showUserMenu.value = !showUserMenu.value)
const closeUserMenu = () => (showUserMenu.value = false)

async function logout() {
  try {
    await api.post('/auth/logout')
  } catch (e) {
    console.error('Logout error:', e)
  }
  userStore.clearUser()
  router.push('/login')
}
</script>
