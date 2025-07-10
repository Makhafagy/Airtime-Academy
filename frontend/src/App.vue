<template>
  <div>
    <Navbar v-if="userLoaded" />
    <router-view v-if="userLoaded" />

    <div v-else class="flex justify-center items-center min-h-screen">
      <p class="text-gray-500">Loading user info...</p>
    </div>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import { computed } from 'vue'
import { useUserStore } from './stores/userStore'

const userStore = useUserStore()

const userLoaded = computed(() => userStore.userLoaded)
</script>
