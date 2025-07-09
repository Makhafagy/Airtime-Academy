<template>
  <div class="contact-wrapper">
    <!-- Left: Contact Form -->
    <div class="contact-form-container">
      <h2 class="form-title">Contact Us</h2>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label class="label-base">Name:</label>
          <input v-model="form.name" type="text" class="input-base" required />
        </div>
        <div>
          <label class="label-base">Email:</label>
          <input v-model="form.email" type="email" class="input-base" required />
        </div>
        <div>
          <label class="label-base">Message:</label>
          <textarea v-model="form.message" class="textarea-base" rows="4" required></textarea>
        </div>
        <button type="submit" class="button-primary">Send Message</button>
      </form>
    </div>

    <!-- Right: Contact Info -->
    <div class="contact-info-box">
      <h3 class="company-heading">Visit Us</h3>
      <p class="company-list mb-4">
        123 Mohamed Lane,<br />
        911 City, CA 90210<br />
        United States
      </p>

      <h3 class="company-heading">Hours</h3>
      <ul class="company-list mb-4">
        <li>Mon–Fri: 8:00 AM – 6:00 PM</li>
        <li>Sat: 9:00 AM – 3:00 PM</li>
        <li>Sun: Closed</li>
      </ul>

      <h3 class="company-heading">Contact</h3>
      <ul class="company-list">
        <li>Email: info@airtimeaviation.com</li>
        <li>Phone: (562) 336-5331</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  name: '',
  email: '',
  message: '',
})

function submitForm() {
  alert(`Thank you, ${form.name}! We'll get back to you soon.`)
  Object.assign(form, {
    name: '',
    email: '',
    message: '',
  })
}
</script>
