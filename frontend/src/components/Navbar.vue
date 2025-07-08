<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <!-- Hamburger button -->
      <button @click="toggleMobileMenu" class="hamburger-btn sm:hidden" aria-label="Toggle menu">
        <span :class="['hamburger-line', { open: isMobileOpen }]"></span>
        <span :class="['hamburger-line', { open: isMobileOpen }]"></span>
        <span :class="['hamburger-line', { open: isMobileOpen }]"></span>
      </button>

      <!-- Logo -->
      <div class="navbar-logo navbar-logo-center">
        <img src="../assets/images/airtime-academy-badge.svg" alt="Logo" class="logo-image" />
      </div>

      <!-- Desktop nav links -->
      <div class="navbar-links hidden sm:flex">
        <a href="#" @click.prevent="handleNavClick('booking')" class="nav-link">Booking</a>
        <a href="#" @click.prevent="handleNavClick('contact')" class="nav-link">Contact</a>
        <a href="#" @click.prevent="handleNavClick('company')" class="nav-link">About</a>
        <router-link to="/admin" class="nav-link">Admin Dashboard</router-link>
      </div>
    </div>

    <!-- Mobile nav menu -->
    <div v-if="isMobileOpen" class="mobile-nav sm:hidden">
      <a href="#" @click.prevent="handleNavClick('booking')" class="mobile-nav-link">Booking</a>
      <a href="#" @click.prevent="handleNavClick('contact')" class="mobile-nav-link">Contact</a>
      <a href="#" @click.prevent="handleNavClick('company')" class="mobile-nav-link">About</a>
      <router-link to="/admin" class="mobile-nav-link" @click.native="closeMobileMenu">Admin Dashboard</router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isMobileOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileOpen.value = !isMobileOpen.value
}

const closeMobileMenu = () => {
  isMobileOpen.value = false
}

const scrollToSection = id => {
  const el = document.getElementById(id)
  if (el) {
    const yOffset = -64
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
