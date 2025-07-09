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
        <router-link to="/admin" class="nav-link">Admin Dashboard</router-link>

        <!-- Light Mode / Dark Mode Toggle -->
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

          <!-- Tooltip -->
          <div
            v-if="showTooltip"
            class="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-800 text-white rounded shadow-lg whitespace-nowrap select-none pointer-events-none z-50"
          >
            {{ isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode' }}
          </div>
        </button>
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isMobileOpen = ref(false)
const showTooltip = ref(false)

const toggleMobileMenu = () => {
  isMobileOpen.value = !isMobileOpen.value
}

const closeMobileMenu = () => {
  isMobileOpen.value = false
}

// Dark mode logic
const isDark = ref(document.documentElement.classList.contains('dark'))

onMounted(() => {
  const saved = localStorage.getItem('theme')
  console.log('Saved theme:', saved) // check this in browser console

  if (saved === 'dark') {
    document.documentElement.classList.add('dark')
    isDark.value = true
  }
})

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  console.log('Toggling dark mode to:', isDark.value)

  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const scrollToSection = id => {
  const el = document.getElementById(id)
  if (el) {
    const yOffset = -128
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
    window.scrollTo({ top: y, behavior: 'smooth' })

    el.classList.add('highlight-border')

    setTimeout(() => {
      el.classList.remove('highlight-border')
    }, 1500)
  }
}

const handleNavClick = id => {
  closeMobileMenu()
  if (route.path === '/') {
    scrollToSection(id)
  } else {
    router.push('/').then(() => {
      setTimeout(() => scrollToSection(id), 300)
    })
  }
}
</script>
