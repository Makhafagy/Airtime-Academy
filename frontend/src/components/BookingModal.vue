<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 bg-white/30 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" @click.self="close">
      <transition name="scale-fade">
        <div
          :class="[
            'rounded-xl max-w-md w-full shadow-2xl border transition-all duration-300 relative flex flex-col',
            isDark ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-white text-gray-900 border-gray-200',
          ]"
          @click.stop
        >
          <!-- Close (X) button top-right -->
          <button
            :class="['absolute top-4 right-4 hover:text-white transition', isDark ? 'text-gray-300' : 'text-gray-500 hover:text-gray-700']"
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
import { ref, onMounted, onUnmounted } from 'vue'

const isDark = ref(false)

function checkDark() {
  isDark.value = document.documentElement.classList.contains('dark')
}

onMounted(() => {
  checkDark()

  const observer = new MutationObserver(() => {
    checkDark()
  })

  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

  onUnmounted(() => {
    observer.disconnect()
  })
})

const props = defineProps({
  show: Boolean,
  type: String,
})
const emit = defineEmits(['update:show'])

function close() {
  emit('update:show', false)
}
</script>
