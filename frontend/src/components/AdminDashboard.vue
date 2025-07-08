<template>
  <div class="admin-dashboard-container pt-20 px-4">
    <!-- pt-20 = 5rem = 80px padding top -->
    <h1>Admin Dashboard - Manage Bookings</h1>

    <select v-model="filterStatus">
      <option value="">All</option>
      <option>Pending</option>
      <option>Approved</option>
      <option>Rejected</option>
    </select>

    <button @click="fetchBookings">Filter</button>

    <table class="w-full border-collapse border border-gray-300 mt-4">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 p-2">Name</th>
          <th class="border border-gray-300 p-2">Email</th>
          <th class="border border-gray-300 p-2">Type</th>
          <th class="border border-gray-300 p-2">Preferred Time</th>
          <th class="border border-gray-300 p-2">Status</th>
          <th class="border border-gray-300 p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="booking in bookings" :key="booking.id" class="hover:bg-gray-50">
          <td class="border border-gray-300 p-2">{{ booking.name }}</td>
          <td class="border border-gray-300 p-2">{{ booking.email }}</td>
          <td class="border border-gray-300 p-2">{{ booking.type }}</td>
          <td class="border border-gray-300 p-2">{{ new Date(booking.preferred_time).toLocaleString() }}</td>
          <td class="border border-gray-300 p-2">{{ booking.status }}</td>
          <td class="border border-gray-300 p-2">
            <button class="mr-2 text-green-600" @click="updateStatus(booking.id, 'Approved')">Approve</button>
            <button class="text-red-600" @click="updateStatus(booking.id, 'Rejected')">Reject</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const bookings = ref([])
const filterStatus = ref('')

const fetchBookings = async () => {
  try {
    const res = await axios.get('/api/bookings/all', { params: { status: filterStatus.value } })
    bookings.value = res.data
  } catch (err) {
    alert('Failed to load bookings')
  }
}

const updateStatus = async (id, status) => {
  try {
    await axios.patch(`/api/bookings/${id}`, { status })
    alert('Booking updated')
    fetchBookings()
  } catch {
    alert('Failed to update booking')
  }
}

onMounted(fetchBookings)
</script>
