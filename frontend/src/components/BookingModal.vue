<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="close"
    >
      <transition name="scale-fade">
        <div
          class="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl transform transition-all duration-300 relative flex flex-col"
          @click.stop
        >
          <!-- Close (X) button top-right -->
          <button
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            @click="close"
            aria-label="Close modal"
          >
            ✕
          </button>

          <!-- Booking form slot -->
          <BookingForm :type="type" />
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import BookingForm from './BookingForm.vue'

const props = defineProps({
  show: Boolean,
  type: String,
})
const emit = defineEmits(['update:show'])

function close() {
  emit('update:show', false)
}
</script>
