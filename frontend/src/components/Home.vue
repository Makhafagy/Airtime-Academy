<template>
  <!-- Hero Container -->
  <section class="hero-container">
    <div class="hero-bg-image"></div>
    <div class="hero-fade-bottom"></div>

    <div class="hero-text">
      <h1 class="hero-title">Take Flight with Us</h1>
      <p class="hero-subtitle">Become a skilled pilot — book your flight instruction or rental today.</p>
      <button @click="scrollToSection('booking')" class="hero-button">Get Started</button>
    </div>
  </section>

  <!-- Page Content -->
  <div class="page-container">
    <Booking @open-modal="openModal" />

    <!-- Modal -->
    <BookingModal :show="modalOpen" :type="bookingType" @update:show="modalOpen = $event" />

    <!-- Contact Section -->
    <section id="contact">
      <Contact />
    </section>
    <!-- Spacer to separate from company section -->
    <div class="company-spacer"></div>
  </div>
  <!-- Company Info Section -->
  <div class="company-border-wrapper">
    <section id="company" class="company-container">
      <CompanyInfo />
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Booking from '../components/Booking.vue'
import BookingModal from '../components/BookingModal.vue'
import Contact from '../components/Contact.vue'
import CompanyInfo from '../components/CompanyInfo.vue'

const modalOpen = ref(false)
const bookingType = ref(null)

function openModal(type) {
  bookingType.value = type
  modalOpen.value = true
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
</script>
