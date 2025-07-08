<template>
  <!-- Hero Container -->
  <section class="hero-container pt-24">
    <div class="hero-bg-image absolute inset-0 z-0"></div>

    <!-- Gradient Fade Layer -->
    <div class="hero-fade-bottom"></div>

    <div class="hero-text z-10">
      <h1 class="hero-title">Take Flight with Us</h1>
      <p class="hero-subtitle">Become a skilled pilot — book your flight instruction or rental today.</p>
      <button @click="scrollToSection('booking')" class="hero-button">Get Started</button>
    </div>
  </section>

  <div class="page-container">
    <!-- Booking Container -->
    <section id="booking" class="booking-container">
      <div class="booking-card">
        <h2 class="booking-card-title">Flight Instruction</h2>
        <p class="booking-card-desc">Book your flight instruction session. Requests require instructor approval.</p>
        <button @click="openModal('Instruction')" class="booking-button">Book Now</button>
      </div>

      <div class="booking-card">
        <h2 class="booking-card-title">Flight Rentals</h2>
        <p class="booking-card-desc">Book your flight rental time. Choose your preferred time.</p>
        <button @click="openModal('Rental')" class="booking-button">Book Now</button>
      </div>
    </section>

    <!-- Modal -->
    <BookingModal :show="modalOpen" :type="bookingType" @update:show="modalOpen = $event" />

    <!-- Contact Container -->
    <section id="contact" class="contact-container">
      <Contact />
    </section>

    <!-- Company Container -->
    <section id="company" class="company-container">
      <CompanyInfo />
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
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
    const yOffset = -64
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
    window.scrollTo({ top: y, behavior: 'smooth' })

    el.classList.add('highlight-border')

    setTimeout(() => {
      el.classList.remove('highlight-border')
    }, 1500)
  }
}
</script>
