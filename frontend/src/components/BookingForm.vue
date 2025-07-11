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

    <!-- Row 2: Type & Dropoff Time -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
      <div>
        <label class="label-base">Type:</label>
        <select v-model="form.type" class="select-base">
          <option value="Rental">Rental</option>
          <option value="Instruction">Instruction</option>
        </select>
      </div>
      <div v-if="form.preferredDate && form.preferredTime">
        <label class="label-base">Dropoff Time:</label>
        <select v-model="form.dropoffTime" class="select-base" required>
          <option disabled value="">Select time</option>
          <option v-for="time in dropoffOptions" :key="time" :value="time">
            {{ time }}
          </option>
        </select>
        <p v-if="errors.dropoffTime" class="text-red-600 text-sm mt-1">
          {{ errors.dropoffTime }}
        </p>
      </div>
    </div>

    <!-- Row 3: Date & Time -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
      <div>
        <label class="label-base">Preferred Date:</label>
        <input v-model="form.preferredDate" type="date" class="input-base" :min="minDate" required />
        <p v-if="errors.preferredDate" class="text-red-600 text-sm mt-1">{{ errors.preferredDate }}</p>
      </div>
      <div v-if="form.preferredDate">
        <label class="label-base">Pickup Time:</label>
        <select v-model="form.preferredTime" class="select-base" required>
          <option disabled value="">Select time</option>
          <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
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
import api from '../api.js'
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
  dropoffTime: '',
  notes: '',
})

form.type = props.type

const errors = reactive({
  name: '',
  email: '',
  preferredDate: '',
  preferredTime: '',
  dropoffTime: '',
})

watch(
  () => props.type,
  newType => {
    form.type = newType
    form.duration = 60
    if (form.preferredDate) {
      const event = new Event('change')
      document.querySelector('input[type="date"]')?.dispatchEvent(event)
    }
  }
)

const minDate = ref('')
const getTomorrowDateString = () => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
}

minDate.value = getTomorrowDateString()

const timeOptions = ref([])

watch(
  () => form.preferredDate,
  async newDate => {
    if (!newDate || !form.type) return

    try {
      const res = await api.get(`/bookings/available-slots`, {
        params: { date: newDate, type: form.type },
      })
      timeOptions.value = res.data
    } catch (err) {
      timeOptions.value = []
      console.error('Failed to load available slots:', err)
    }
  }
)

const dropoffOptions = ref([])

watch([() => form.preferredDate, () => form.preferredTime], () => {
  if (!form.preferredDate || !form.preferredTime) return

  const baseTime = new Date(`${form.preferredDate}T${form.preferredTime}`)
  const options = []

  for (let mins = 30; mins <= 180; mins += 30) {
    const dropoff = new Date(baseTime.getTime() + mins * 60000)
    options.push(dropoff.toTimeString().slice(0, 5)) // "HH:MM"
  }

  dropoffOptions.value = options
})

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
  errors.preferredTime = form.preferredTime ? '' : 'Please select a pickup time.'
  errors.dropoffTime = form.dropoffTime ? '' : 'Please select a dropoff time.'
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

  const pickup = new Date(`${form.preferredDate}T${form.preferredTime}`).toISOString()
  const dropoff = new Date(`${form.preferredDate}T${form.dropoffTime}`).toISOString()

  try {
    const payload = {
      firstName: form.name.split(' ')[0] || '',
      lastName: form.name.split(' ').slice(1).join(' ') || '',
      type: form.type,
      pickupTime: pickup,
      dropoffTime: dropoff,
      notes: form.notes,
    }

    const res = await api.post('/bookings', payload)
    alert(res.data.message)

    Object.assign(form, {
      name: '',
      email: userStore.user.email,
      type: props.type,
      preferredDate: '',
      preferredTime: '',
      dropoffTime: '',
      notes: '',
    })
  } catch (err) {
    alert(err.response?.data?.error || 'Submission failed')
  }
}
</script>
