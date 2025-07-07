<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <!-- Hamburger -->
      <button @click="toggleMobileMenu" class="hamburger-btn sm:hidden" aria-label="Toggle menu">
        <span :class="['hamburger-line', { open: isMobileOpen }]"></span>
        <span :class="['hamburger-line', { open: isMobileOpen }]"></span>
        <span :class="['hamburger-line', { open: isMobileOpen }]"></span>
      </button>

      <!-- Centered Logo -->
      <div class="navbar-logo navbar-logo-center">
        <img src="../assets/images/airtime-academy-badge.svg" alt="Logo" class="logo-image" />
      </div>

      <!-- Navbar links -->
      <div class="navbar-links hidden sm:flex">
        <a href="#booking" @click.prevent="handleNavClick('booking')" class="nav-link">Booking</a>
        <a href="#contact" @click.prevent="handleNavClick('contact')" class="nav-link">Contact</a>
        <a href="#company" @click.prevent="handleNavClick('company')" class="nav-link">About</a>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-if="isMobileOpen" class="mobile-nav sm:hidden">
      <a href="#booking" @click.prevent="handleMobileNavClick('booking')" class="mobile-nav-link">Booking</a>
      <a href="#contact" @click.prevent="handleMobileNavClick('contact')" class="mobile-nav-link">Contact</a>
      <a href="#company" @click.prevent="handleMobileNavClick('company')" class="mobile-nav-link">About</a>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

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
    const yOffset = -64 // Adjust if navbar height changes
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

const handleNavClick = id => {
  scrollToSection(id)
}

const handleMobileNavClick = id => {
  closeMobileMenu()
  scrollToSection(id)
}
</script>
