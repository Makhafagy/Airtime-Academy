<template>
  <form @submit.prevent="submitForm" class="form-container" novalidate>
    <h2 class="form-title">
      {{ form.type === 'Instruction' ? 'Book a Course' : 'Book a Flight' }}
    </h2>

    <!-- Row 1: Name & Email -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label class="label-base">Name:</label>
        <input v-model="form.name" type="text" class="input-base" required />
        <p v-if="errors.name" class="text-red-600 text-sm mt-1">{{ errors.name }}</p>
      </div>
      <div>
        <label class="label-base">Email:</label>
        <input v-model="form.email" type="email" class="input-base read-only-email" readonly />
      </div>
    </div>

    <!-- Row 2: Type & Duration -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
      <div>
        <label class="label-base">Type:</label>
        <select v-model="form.type" class="select-base">
          <option value="Rental">Rental</option>
          <option value="Instruction">Instruction</option>
        </select>
      </div>
      <div v-if="form.type === 'Rental'">
        <label class="label-base">Duration (hours):</label>
        <select v-model.number="form.duration" class="select-base" required>
          <option :value="60">1 hour</option>
          <option :value="90">1.5 hours</option>
          <option :value="120">2 hours</option>
          <option :value="150">2.5 hours</option>
          <option :value="180">3 hours</option>
        </select>
      </div>
    </div>

    <!-- Row 3: Date & Time -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
      <div>
        <label class="label-base">Preferred Date:</label>
        <input v-model="form.preferredDate" type="date" class="input-base" required />
        <p v-if="errors.preferredDate" class="text-red-600 text-sm mt-1">{{ errors.preferredDate }}</p>
      </div>
      <div v-if="form.preferredDate">
        <label class="label-base">Preferred Time:</label>
        <select v-model="form.preferredTime" class="select-base" required>
          <option disabled value="">Select time</option>
          <option v-for="time in timeOptions" :key="time" :value="time">
            {{ time }}
          </option>
        </select>
        <p v-if="errors.preferredTime" class="text-red-600 text-sm mt-1">{{ errors.preferredTime }}</p>
      </div>
    </div>

    <!-- Notes (Optional) -->
    <div class="mt-4">
      <label class="label-base">Notes:</label>
      <textarea v-model="form.notes" class="textarea-base" rows="3"></textarea>
    </div>

    <!-- Submit -->
    <button type="submit" class="button-primary mt-6">
      {{ form.type === 'Instruction' ? 'Request Reservation' : 'Book Flight' }}
    </button>
  </form>
</template>

<script setup>
import { reactive, watch, ref, nextTick, onMounted } from 'vue'
import axios from 'axios'
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()

const props = defineProps({
  type: {
    type: String,
    default: 'Rental',
  },
})

const form = reactive({
  name: '',
  email: '',
  type: '',
  preferredDate: '',
  preferredTime: '',
  duration: 60,
  notes: '',
})

form.type = props.type

const errors = reactive({
  name: '',
  email: '',
  preferredDate: '',
  preferredTime: '',
})

const timeOptions = Array.from({ length: (24 * 60) / 15 }, (_, i) => {
  const hours = String(Math.floor((i * 15) / 60)).padStart(2, '0')
  const minutes = String((i * 15) % 60).padStart(2, '0')
  return `${hours}:${minutes}`
})

watch(
  () => props.type,
  newType => {
    form.type = newType
    form.duration = 60
  }
)

onMounted(() => {
  const user = userStore.user
  if (user) {
    form.name = `${user.first_name} ${user.last_name}`
    form.email = user.email
  }
})

const validateForm = () => {
  errors.name = form.name.trim() ? '' : 'Name is required.'
  errors.preferredDate = form.preferredDate ? '' : 'Please select a date.'
  errors.preferredTime = form.preferredTime ? '' : 'Please select a time.'
  return !Object.values(errors).some(err => err)
}

const scrollToFirstError = async () => {
  await nextTick()
  const el = document.querySelector('.text-red-600')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

const submitForm = async () => {
  if (!validateForm()) {
    scrollToFirstError()
    return
  }

  const preferredDateTime = new Date(`${form.preferredDate}T${form.preferredTime}`).toISOString()

  try {
    const payload = {
      firstName: form.name.split(' ')[0] || '',
      lastName: form.name.split(' ').slice(1).join(' ') || '',
      type: form.type,
      preferredTime: preferredDateTime,
      duration: form.duration,
      notes: form.notes,
    }

    const res = await axios.post('/api/bookings', payload)
    alert(res.data.message)

    Object.assign(form, {
      name: '',
      email: userStore.user.email, // keep email filled
      type: props.type,
      preferredDate: '',
      preferredTime: '',
      duration: 60,
      notes: '',
    })
  } catch (err) {
    alert(err.response?.data?.error || 'Submission failed')
  }
}
</script>
