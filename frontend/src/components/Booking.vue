<template>
  <section id="booking" class="booking-container">
    <div class="booking-card">
      <h2 class="booking-card-title">Flight Instruction</h2>
      <p class="booking-card-desc mb-3">Book one-on-one instruction with a certified flight instructor.</p>
      <ul class="booking-card-list">
        <li>Aircraft: Cessna 172</li>
        <li>Includes certified instructor</li>
        <li>Pre- and post-flight briefing</li>
        <li>Insurance included</li>
        <li>Starts at $150/hour</li>
      </ul>
      <button @click="openModal('Instruction')" class="booking-button">Book Now</button>
    </div>

    <div class="booking-card">
      <h2 class="booking-card-title">Flight Rentals</h2>
      <p class="booking-card-desc mb-3">Schedule time in our aircraft for solo or dual rental.</p>
      <ul class="booking-card-list">
        <li>Aircraft: Cessna 172</li>
        <li>Pilot license required</li>
        <li>Checkout flight may be required</li>
        <li>$130/hour (wet rate)</li>
        <li>Insurance available upon request</li>
      </ul>
      <button @click="openModal('Rental')" class="booking-button">Book Now</button>
    </div>
  </section>
</template>

<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['open-modal'])

function openModal(type) {
  emit('open-modal', type)
}
</script>
