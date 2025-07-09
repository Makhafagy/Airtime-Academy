<template>
  <transition name="fade">
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center z-50" aria-modal="true" role="dialog">
      <!-- Blur background -->
      <div class="absolute inset-0 backdrop-blur-sm bg-white/30" @click="cancel" aria-hidden="true"></div>

      <!-- Modal window -->
      <div class="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6 z-10" @click.stop>
        <p class="text-lg text-gray-800 mb-6">{{ message }}</p>
        <div class="flex justify-end gap-4">
          <button @click="cancel" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 transition">Cancel</button>
          <button @click="confirm" class="px-4 py-2 rounded bg-sky-600 hover:bg-sky-700 text-white font-semibold transition">Confirm</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  visible: Boolean,
  message: String,
})

const emit = defineEmits(['confirm', 'cancel'])

function confirm() {
  emit('confirm')
}
function cancel() {
  emit('cancel')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
