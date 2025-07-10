<template>
  <div :class="['admin-dashboard-container px-4 pt-28 sm:pt-32 min-h-screen', isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900']">
    <h1 :class="['text-2xl font-bold mb-6', isDark ? 'text-gray-100' : 'text-gray-800']">Admin Dashboard - Manage Bookings</h1>

    <div class="flex gap-4 mb-4">
      <select
        v-model="filterStatus"
        :class="['filter-select border rounded p-2', isDark ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-900 border-gray-300']"
      >
        <option value="">All Statuses</option>
        <option>Pending</option>
        <option>Approved</option>
        <option>Confirmed</option>
        <option>Rejected</option>
        <option>Cancelled</option>
      </select>

      <select
        v-model="filterType"
        :class="['filter-select border rounded p-2', isDark ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-900 border-gray-300']"
      >
        <option value="">All Types</option>
        <option>Instruction</option>
        <option>Rental</option>
      </select>
    </div>

    <div :class="['overflow-auto rounded-lg border mt-4', isDark ? 'border-gray-700' : 'border-gray-300']">
      <table class="w-full border-collapse">
        <thead>
          <tr :class="[isDark ? 'bg-gray-800' : 'bg-gray-100']">
            <th
              v-for="header in ['Name', 'Email', 'Type', 'Preferred Time', 'Status', 'Actions']"
              :key="header"
              :class="['border p-2', isDark ? 'border-gray-700 text-gray-300' : 'border-gray-300 text-gray-700']"
            >
              {{ header }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="bookings.length > 0">
            <tr v-for="booking in bookings" :key="booking.id" :class="['hover:bg-gray-50', isDark ? 'dark:hover:bg-gray-700 bg-transparent' : '']">
              <td :class="['p-2', isDark ? 'text-gray-100' : 'text-gray-900']">{{ booking.name || '—' }}</td>
              <td :class="['p-2', isDark ? 'text-gray-100' : 'text-gray-900']">{{ booking.email || '—' }}</td>
              <td :class="['p-2', isDark ? 'text-gray-100' : 'text-gray-900']">{{ booking.type || '—' }}</td>
              <td :class="['p-2', isDark ? 'text-gray-100' : 'text-gray-900']">
                {{ booking.preferred_time ? new Date(booking.preferred_time).toLocaleString() : 'N/A' }}
              </td>
              <td :class="['p-2', isDark ? 'text-gray-100' : 'text-gray-900']">{{ booking.status || '—' }}</td>
              <td class="p-2">
                <!-- Actions for Instruction bookings -->
                <template v-if="booking.type === 'Instruction'">
                  <div class="flex gap-2">
                    <button
                      v-if="booking.status === 'Pending' || booking.status === 'Rejected'"
                      @click="openConfirm(booking.id, 'Approved')"
                      class="action-btn action-approve cursor-pointer"
                    >
                      Approve
                    </button>
                    <button
                      v-if="booking.status === 'Pending' || booking.status === 'Approved'"
                      @click="openConfirm(booking.id, 'Rejected')"
                      class="action-btn action-reject cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </template>

                <!-- Actions for Rental bookings -->
                <!-- Actions for Rental bookings -->
                <!-- Actions for Rental bookings -->
                <template v-else-if="booking.type === 'Rental'">
                  <div class="flex gap-2">
                    <button
                      v-if="booking.status === 'Confirmed'"
                      @click="openConfirm(booking.id, 'Cancelled')"
                      class="action-btn action-cancel cursor-pointer"
                    >
                      Cancel
                    </button>
                    <!-- Show dash for empty space -->
                    <span v-else class="text-gray-500 dark:text-gray-400">—</span>
                  </div>
                </template>

                <!-- For other types or no actions -->
                <template v-else>
                  <!-- Show dash for empty space -->
                  <span class="text-gray-500 dark:text-gray-400">—</span>
                </template>
              </td>
            </tr>
          </template>
          <tr v-else>
            <td colspan="6" :class="['text-center p-4', isDark ? 'text-gray-300' : 'text-gray-700']">No bookings found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <StatusUpdater
      :visible="showConfirm"
      :message="confirmMessage"
      :toast-visible="showToast"
      :toast-message="toastMessage"
      @confirm="onConfirm"
      @cancel="onCancel"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import api from '../api'
import { debounce } from 'lodash'
import StatusUpdater from './StatusUpdater.vue'
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()

const bookings = ref([])
const filterStatus = ref('')
const filterType = ref('')
const showConfirm = ref(false)
const confirmMessage = ref('')
const showToast = ref(false)
const toastMessage = ref('')
const pendingStatusUpdate = ref({ id: null, status: null })
const isDark = ref(false)

const fetchBookings = async () => {
  try {
    const res = await api.get('/bookings/all', {
      params: {
        status: filterStatus.value,
        type: filterType.value,
      },
    })
    bookings.value = res.data
  } catch (err) {
    console.error('Failed to load bookings', err)
    alert('Failed to load bookings')
  }
}

const debouncedFetchBookings = debounce(fetchBookings, 300)

watch([filterStatus, filterType], () => {
  debouncedFetchBookings()
})

watch(
  () => userStore.user, // watch the user object
  newUser => {
    if (newUser) {
      fetchBookings()
    }
  },
  { immediate: true }
)

function openConfirm(id, status) {
  confirmMessage.value = `Are you sure you want to set the booking status to "${status}"?`
  pendingStatusUpdate.value = { id, status }
  showConfirm.value = true
}

async function onConfirm() {
  showConfirm.value = false
  try {
    await api.patch(`/bookings/${pendingStatusUpdate.value.id}`, {
      status: pendingStatusUpdate.value.status,
    })
    toastMessage.value = 'Booking updated successfully'
    showToast.value = true
    fetchBookings()
  } catch (err) {
    console.error('Failed to update booking:', err)
    toastMessage.value = 'Failed to update booking'
    showToast.value = true
  }
}

function onCancel() {
  showConfirm.value = false
}

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
  const observer = new MutationObserver(() => {
    isDark.value = document.documentElement.classList.contains('dark')
  })
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })
})
</script>
